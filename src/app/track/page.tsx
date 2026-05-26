'use client';

import React, { useState, useMemo } from 'react';
import {
  useApp,
  formatNumber,
  nutritionDatabase,
  getNutritionEstimate,
  getServingInfo,
  quickFoods,
  keralaCuisineCategories
} from '@/context/AppContext';

export default function TrackPage() {
  const {
    entries,
    selectedDate,
    handlePrevDay,
    handleNextDay,
    handleGoToToday,
    setSelectedDate,
    handleAddEntry,
    handleRemoveEntry,
  } = useApp();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState(100);
  const [unitMode, setUnitMode] = useState<'g' | 'serving'>('g');
  const [message, setMessage] = useState('Enter a food name to see nutrition estimates.');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'standard' | 'kerala'>('standard');

  const activeEntries = useMemo(() => {
    if (!selectedDate) return [];
    return entries.filter((e) => e.date === selectedDate);
  }, [entries, selectedDate]);

  const handleUnitModeChange = (mode: 'g' | 'serving') => {
    setUnitMode(mode);
    if (mode === 'serving') {
      setAmount(1);
    } else {
      setAmount(100);
    }
  };

  const baseEstimate = useMemo(() => {
    return getNutritionEstimate(name);
  }, [name]);

  const isFoodAvailable = useMemo(() => {
    const query = name.toLowerCase().trim();
    return Object.prototype.hasOwnProperty.call(nutritionDatabase, query);
  }, [name]);

  const filteredSuggestions = useMemo(() => {
    const query = name.toLowerCase().trim();
    if (!query) return [];
    return Object.keys(nutritionDatabase).filter((key) =>
      key.includes(query)
    );
  }, [name]);

  const servingInfo = useMemo(() => {
    return getServingInfo(name);
  }, [name]);

  const calculatedGrams = useMemo(() => {
    if (unitMode === 'g') {
      return amount;
    } else {
      return amount * servingInfo.size;
    }
  }, [amount, unitMode, servingInfo]);

  const calories = name.trim() ? (baseEstimate.calories * calculatedGrams) / 100 : 0;
  const protein = name.trim() ? (baseEstimate.protein * calculatedGrams) / 100 : 0;
  const carbs = name.trim() ? (baseEstimate.carbs * calculatedGrams) / 100 : 0;
  const fat = name.trim() ? (baseEstimate.fat * calculatedGrams) / 100 : 0;

  const handleAdd = () => {
    const result = handleAddEntry(name, amount, unitMode);
    setMessage(result.message);
    if (result.success) {
      setName('');
      setAmount(unitMode === 'g' ? 100 : 1);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black italic text-slate-800 tracking-tight" style={{ fontFamily: 'Poppins' }}>
          Meal Tracker
        </h1>
        <p className="text-sm text-slate-500 italic font-semibold mt-1">
          Search food databases, estimate calories and proteins, and update logs.
        </p>
      </div>

      {/* Date Navigator Banner */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white/60 backdrop-blur-md p-4 sm:p-6 sm:flex-row sm:items-center sm:justify-between border border-slate-200/80 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          <span className="text-sm font-bold italic text-slate-500 hidden sm:inline" style={{ fontFamily: 'Poppins' }}>
            Logging Date:
          </span>
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={handlePrevDay}
              className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-bold text-slate-750 hover:bg-slate-100 transition active:scale-95 shadow-sm"
              title="Previous Day"
            >
              ◀
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-cyan-500 flex-1 sm:flex-none shadow-sm"
            />
            <button
              onClick={handleNextDay}
              className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-bold text-slate-750 hover:bg-slate-100 transition active:scale-95 shadow-sm"
              title="Next Day"
            >
              ▶
            </button>
          </div>
          <button
            onClick={handleGoToToday}
            className="rounded-lg bg-cyan-600 border border-cyan-500/20 px-4 py-2 text-xs font-black italic text-cyan-50 hover:bg-cyan-700 transition w-full sm:w-auto text-center shadow-md shadow-cyan-500/10"
            style={{ fontFamily: 'Poppins' }}
          >
            Today
          </button>
        </div>
      </div>

      {/* Primary columns */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Left Side: Add Food Form */}
        <div className="rounded-2xl bg-white/60 backdrop-blur-md p-5 sm:p-8 border border-slate-200/80 shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-black italic text-slate-800" style={{ fontFamily: 'Poppins' }}>
              Add Food Item
            </h2>
            <p className="mt-1 text-xs text-slate-500 italic font-semibold">
              Log weight or serving size of your breakfast, lunch, dinner or snack.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* Food Name Search input */}
              <div className="block relative">
                <span className="text-xs font-bold italic text-slate-500 uppercase tracking-wider" style={{ fontFamily: 'Poppins' }}>
                  Food name
                </span>
                <input
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 outline-none focus:border-cyan-500 transition text-sm shadow-sm"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="e.g. banana, rice, chicken"
                />

                {/* Suggestions Dropdown */}
                {showSuggestions && name.trim() !== '' && filteredSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 z-30 mt-1 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl py-1 divide-y divide-slate-100 animate-fade-in">
                    {filteredSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          setName(suggestion);
                          setShowSuggestions(false);
                          setMessage(`Selected ${suggestion}`);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-bold transition flex items-center justify-between"
                      >
                        <span>{suggestion}</span>
                        <span className="text-[10px] text-cyan-600 font-black font-mono">
                          ~{nutritionDatabase[suggestion].calories} kcal/100g
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Measure Option / Input */}
              <div className="block">
                <span className="text-xs font-bold italic text-slate-500 uppercase tracking-wider flex items-center justify-between" style={{ fontFamily: 'Poppins' }}>
                  <span>Measure by</span>
                  <div className="flex gap-0.5 bg-slate-100 p-0.5 rounded-md text-[10px] not-italic border border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleUnitModeChange('g')}
                      className={`px-2 py-0.5 rounded-sm font-semibold transition ${
                        unitMode === 'g'
                          ? 'bg-white text-slate-800 shadow-sm border border-slate-200/40'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Weight (g)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUnitModeChange('serving')}
                      className={`px-2 py-0.5 rounded-sm font-semibold transition ${
                        unitMode === 'serving'
                          ? 'bg-white text-slate-800 shadow-sm border border-slate-200/40'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Serving Unit
                    </button>
                  </div>
                </span>

                <div className="mt-2 flex rounded-lg border border-slate-200 bg-white overflow-hidden focus-within:border-cyan-500 transition shadow-sm">
                  <input
                    className="w-full px-4 py-3 bg-transparent text-slate-800 placeholder-slate-400 outline-none text-sm"
                    type="number"
                    min={unitMode === 'g' ? 1 : 0.1}
                    step={unitMode === 'g' ? 1 : 0.1}
                    value={amount}
                    onChange={(event) => setAmount(Number(event.target.value))}
                  />
                  <div className="bg-slate-50 px-3 flex items-center justify-center text-xs font-bold text-slate-500 border-l border-slate-200 select-none whitespace-nowrap min-w-[95px] max-w-[120px] text-ellipsis overflow-hidden">
                    {unitMode === 'g' ? 'g' : servingInfo.unit}
                  </div>
                </div>
                {unitMode === 'serving' && name.trim() && (
                  <p className="mt-1 text-[11px] text-slate-400 italic font-medium">
                    = {formatNumber(calculatedGrams)} grams total ({servingInfo.size}g per {servingInfo.unit})
                  </p>
                )}
              </div>
            </div>

            {/* AI Estimation / Database confirmation panel */}
            <div className="mt-6 rounded-xl bg-slate-50 p-4 border border-slate-200/60 shadow-inner">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <p className="text-xs font-bold italic text-slate-500" style={{ fontFamily: 'Poppins' }}>
                  Nutrition Estimates
                </p>
                {name.trim() && (
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all ${
                    isFoodAvailable
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {isFoodAvailable ? '✓ Verified In Database' : '⚠️ AI Estimate (Item Not in Database)'}
                  </span>
                )}
              </div>

              <div className="grid gap-3 grid-cols-2 mt-4">
                <div className="rounded-lg bg-cyan-50 border border-cyan-100 p-3">
                  <p className="text-[10px] italic text-cyan-600 font-bold" style={{ fontFamily: 'Poppins' }}>Calories</p>
                  <p className="text-xl font-black text-cyan-700 font-mono">{formatNumber(calories, 0)} kcal</p>
                </div>
                <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3">
                  <p className="text-[10px] italic text-emerald-600 font-bold" style={{ fontFamily: 'Poppins' }}>Protein</p>
                  <p className="text-xl font-black text-emerald-700 font-mono">{formatNumber(protein)}g</p>
                </div>
                <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                  <p className="text-[10px] italic text-amber-600 font-bold" style={{ fontFamily: 'Poppins' }}>Carbs</p>
                  <p className="text-xl font-black text-amber-700 font-mono">{formatNumber(carbs)}g</p>
                </div>
                <div className="rounded-lg bg-fuchsia-50 border border-fuchsia-100 p-3">
                  <p className="text-[10px] italic text-fuchsia-600 font-bold" style={{ fontFamily: 'Poppins' }}>Fat</p>
                  <p className="text-xl font-black text-fuchsia-700 font-mono">{formatNumber(fat)}g</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <button
              type="button"
              onClick={handleAdd}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/25 active:scale-95 transition-all py-3 text-center italic text-sm"
              style={{ fontFamily: 'Poppins' }}
            >
              Add to Daily Log
            </button>
            <p className="text-xs italic text-slate-400 text-center font-medium">{message}</p>
          </div>
        </div>

        {/* Right Side: Log Reference Hub */}
        <div className="rounded-2xl bg-white/60 backdrop-blur-md p-5 border border-slate-200/80 shadow-lg">
          {/* Tabs */}
          <div className="flex bg-slate-200/60 p-1 rounded-xl mb-6 border border-slate-200/50">
            <button
              type="button"
              onClick={() => setActiveGuideTab('standard')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeGuideTab === 'standard'
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200/40'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              style={{ fontFamily: 'Poppins' }}
            >
              Standard Quick Logs
            </button>
            <button
              type="button"
              onClick={() => setActiveGuideTab('kerala')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeGuideTab === 'kerala'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm border border-emerald-500/20'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              style={{ fontFamily: 'Poppins' }}
            >
              Kerala Cuisine Hub 🌴
            </button>
          </div>

          {activeGuideTab === 'standard' ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-black italic text-slate-800 text-sm" style={{ fontFamily: 'Poppins' }}>
                  Quick Reference List
                </h3>
                <p className="text-xs text-slate-400 italic">Select common ingredients to fill details instantly.</p>
              </div>

              <div className="grid gap-2 grid-cols-2">
                {quickFoods.map((item) => (
                  <button
                    key={item.food}
                    type="button"
                    onClick={() => {
                      setName(item.food);
                      setUnitMode('serving');
                      setAmount(1);
                      setMessage(`Selected ${item.label}`);
                    }}
                    className="rounded-xl bg-white hover:bg-slate-50 border border-slate-200 shadow-sm p-3 text-left transition text-xs text-slate-700 font-semibold"
                  >
                    <div className="truncate text-slate-800 font-bold">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-1 font-normal">~{item.calories} kcal</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="font-black italic text-emerald-800 text-sm flex items-center gap-1" style={{ fontFamily: 'Poppins' }}>
                  Kerala Cuisine Hub 🌴
                </h3>
                <p className="text-xs text-emerald-600/80 italic font-semibold">Explore traditional South Indian calories.</p>
              </div>

              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                {keralaCuisineCategories.map((cat) => (
                  <div key={cat.category} className="space-y-2">
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-wider pl-1">{cat.category}</h4>
                    <div className="grid gap-2 grid-cols-2">
                      {cat.items.map((item) => (
                        <button
                          key={item.food}
                          type="button"
                          onClick={() => {
                            setName(item.food);
                            setUnitMode('serving');
                            setAmount(1);
                            setMessage(`Selected Kerala Special: ${item.label}`);
                          }}
                          className="rounded-xl bg-white hover:bg-emerald-50/20 border border-slate-200 hover:border-emerald-250 shadow-sm p-2.5 text-left transition text-xs text-slate-700 font-semibold flex flex-col justify-between"
                          title={item.desc}
                        >
                          <div>
                            <div className="truncate text-slate-800 font-black">{item.label}</div>
                            <div className="text-[9px] text-slate-400 font-medium truncate mt-0.5 leading-tight">{item.desc}</div>
                          </div>
                          <div className="text-[10px] text-emerald-650 font-black mt-2 font-mono">~{item.calories} kcal</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Full Daily Log List */}
      <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 border border-slate-200/80 shadow-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-black italic text-slate-800" style={{ fontFamily: 'Poppins' }}>
            Daily Log for {selectedDate}
          </h2>
          <p className="text-xs text-slate-500 italic mt-1 font-semibold">
            Review, audit, or delete specific meals tracked for this date.
          </p>
        </div>

        {activeEntries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center bg-slate-50/50">
            <p className="text-slate-400 font-bold">No meals logged for this day</p>
            <p className="text-xs text-slate-550 italic mt-1">Use the search form above to populate your meals.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition border border-slate-150"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-black text-slate-850 truncate text-sm sm:text-base" style={{ fontFamily: 'Poppins' }}>
                    {entry.name}
                  </div>
                  <div className="text-[11px] sm:text-xs italic text-slate-400 mt-0.5 font-semibold">
                    {entry.unit === 'g' ? `Weight: ${formatNumber(entry.grams)}g` : `Qty: ${formatNumber(entry.amount)} ${entry.unit} (${formatNumber(entry.grams)}g)`}
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-slate-100 sm:border-t-0 pt-2 sm:pt-0">
                  <div className="grid grid-cols-4 gap-3 text-right text-xs">
                    <div>
                      <p className="text-slate-400 italic text-[9px] font-bold">Cal</p>
                      <p className="font-black text-cyan-600">{formatNumber(entry.calories, 0)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 italic text-[9px] font-bold">P</p>
                      <p className="font-black text-emerald-600">{formatNumber(entry.protein, 0)}g</p>
                    </div>
                    <div>
                      <p className="text-slate-400 italic text-[9px] font-bold">C</p>
                      <p className="font-black text-amber-600">{formatNumber(entry.carbs, 0)}g</p>
                    </div>
                    <div>
                      <p className="text-slate-400 italic text-[9px] font-bold">F</p>
                      <p className="font-black text-fuchsia-600">{formatNumber(entry.fat, 0)}g</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveEntry(entry.id)}
                    className="text-slate-350 hover:text-red-500 rounded p-1 transition"
                    title="Delete item"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
