'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useApp, formatNumber } from '@/context/AppContext';

export default function Dashboard() {
  const {
    entries,
    dailyCalorieGoal,
    selectedDate,
    handlePrevDay,
    handleNextDay,
    handleGoToToday,
    setSelectedDate,
    setDailyCalorieGoal,
    handleRemoveEntry,
  } = useApp();

  const activeEntries = useMemo(() => {
    if (!selectedDate) return [];
    return entries.filter((e) => e.date === selectedDate);
  }, [entries, selectedDate]);

  const totals = useMemo(() => {
    return activeEntries.reduce(
      (acc, entry) => {
        acc.calories += entry.calories;
        acc.protein += entry.protein;
        acc.carbs += entry.carbs;
        acc.fat += entry.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [activeEntries]);

  // Adherence and calorie ratios
  const calorieRatio = dailyCalorieGoal > 0 ? totals.calories / dailyCalorieGoal : 0;
  const isOverGoal = totals.calories > dailyCalorieGoal;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Upper Section: Welcome Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black italic text-slate-800 tracking-tight" style={{ fontFamily: 'Poppins' }}>
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 italic font-semibold mt-1">
            Check your daily calorie targets and nutrient balance.
          </p>
        </div>
        
        {/* Quick Log Button */}
        <Link
          href="/track"
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 active:scale-95 transition-all px-6 py-3 text-sm italic self-start md:self-auto"
          style={{ fontFamily: 'Poppins' }}
        >
          <span>+ Log a Meal</span>
        </Link>
      </div>

      {/* Date Selector Banner */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white/60 backdrop-blur-md p-4 sm:p-6 sm:flex-row sm:items-center sm:justify-between border border-slate-200/80 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          <span className="text-sm font-bold italic text-slate-500 hidden sm:inline" style={{ fontFamily: 'Poppins' }}>
            Viewing Date:
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

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t border-slate-200/85 sm:border-t-0 pt-3 sm:pt-0">
          <label className="flex items-center justify-between sm:justify-end gap-2 text-sm font-semibold italic text-slate-500 w-full sm:w-auto" style={{ fontFamily: 'Poppins' }}>
            <span>Calorie Goal:</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={500}
                max={10000}
                step={50}
                value={dailyCalorieGoal}
                onChange={(e) => setDailyCalorieGoal(Number(e.target.value))}
                className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-center text-sm font-bold text-cyan-600 focus:outline-none focus:border-cyan-500 shadow-sm"
              />
              <span className="text-xs text-slate-450 not-italic">kcal</span>
            </div>
          </label>
        </div>
      </div>

      {/* Main Grid: Gauges & Nutrient Metrics */}
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] xl:grid-cols-3">
        {/* Calorie Card */}
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 border border-slate-200/80 shadow-xl flex flex-col justify-between xl:col-span-2">
          <div>
            <h2 className="text-lg font-black italic text-slate-800 uppercase tracking-wide mb-1" style={{ fontFamily: 'Poppins' }}>
              Calorie Consumption
            </h2>
            <p className="text-xs text-slate-400 italic font-semibold">Compare today's intake with your targeted goals.</p>
          </div>

          <div className="my-8 flex flex-col sm:flex-row items-center justify-around gap-6">
            {/* Visual Gauge Ring */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Track Circle */}
                <circle cx="50" cy="50" r="42" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                {/* Active Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={isOverGoal ? '#ef4444' : 'url(#cyanGrad)'}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="264"
                  strokeDashoffset={264 - 264 * Math.min(calorieRatio, 1)}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
                <defs>
                  <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Text inside Ring */}
              <div className="absolute text-center">
                <span className="block text-3xl font-black text-slate-800 font-mono">
                  {formatNumber(totals.calories, 0)}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black leading-none mt-1 block">
                  kcal
                </span>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-4 flex-1 max-w-xs">
              <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Daily Goal</span>
                <span className="text-slate-800 font-black font-mono">{dailyCalorieGoal} kcal</span>
              </div>
              <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Consumed</span>
                <span className="text-cyan-600 font-black font-mono">{formatNumber(totals.calories, 0)} kcal</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Remaining</span>
                {isOverGoal ? (
                  <span className="text-red-500 font-black font-mono">+{formatNumber(totals.calories - dailyCalorieGoal, 0)} kcal</span>
                ) : (
                  <span className="text-emerald-600 font-black font-mono">{formatNumber(dailyCalorieGoal - totals.calories, 0)} kcal</span>
                )}
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverGoal ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}
              style={{ width: `${Math.min(calorieRatio * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Macros Card */}
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 border border-slate-200/80 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-black italic text-slate-800 uppercase tracking-wide mb-1" style={{ fontFamily: 'Poppins' }}>
              Macros Breakdown
            </h2>
            <p className="text-xs text-slate-400 italic font-semibold">Overview of macronutrient weights logged.</p>
          </div>

          <div className="my-6 space-y-4">
            {/* Protein bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-emerald-600 italic">Protein (P)</span>
                <span className="text-slate-700 font-mono">{formatNumber(totals.protein)}g</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min((totals.protein / 150) * 100, 100)}%` }} />
              </div>
            </div>

            {/* Carbs bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-amber-600 italic">Carbohydrates (C)</span>
                <span className="text-slate-700 font-mono">{formatNumber(totals.carbs)}g</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min((totals.carbs / 300) * 100, 100)}%` }} />
              </div>
            </div>

            {/* Fat bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-fuchsia-600 italic">Fat (F)</span>
                <span className="text-slate-700 font-mono">{formatNumber(totals.fat)}g</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-fuchsia-500 h-full rounded-full" style={{ width: `${Math.min((totals.fat / 80) * 100, 100)}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-[10px] text-slate-500 font-semibold italic flex items-center gap-2">
            <span>💡</span>
            <span>Tip: Try keeping a 30:45:25 ratio of Protein:Carbs:Fat for active metabolism.</span>
          </div>
        </div>
      </div>

      {/* Daily Log Snapshot */}
      <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 border border-slate-200/80 shadow-xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-black italic text-slate-800" style={{ fontFamily: 'Poppins' }}>
              Meal Log Summary
            </h2>
            <p className="text-xs text-slate-400 mt-1 italic font-semibold">
              Today's items list ({activeEntries.length} logged)
            </p>
          </div>
          <Link
            href="/track"
            className="text-xs font-black text-cyan-600 hover:text-cyan-700 underline italic"
            style={{ fontFamily: 'Poppins' }}
          >
            Manage Detailed Logs ➔
          </Link>
        </div>

        {activeEntries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center bg-slate-50/50">
            <p className="text-slate-400 font-bold text-sm">No foods logged on this day</p>
            <p className="text-xs text-slate-500 mt-1 italic">Click "+ Log a Meal" above to search or estimate your dishes.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeEntries.slice(0, 4).map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition border border-slate-150"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-black text-slate-850 truncate text-sm sm:text-base" style={{ fontFamily: 'Poppins' }}>
                    {entry.name}
                  </div>
                  <div className="text-[11px] sm:text-xs italic text-slate-400 mt-0.5 font-semibold">
                    {entry.unit === 'g' ? `Weight: ${formatNumber(entry.grams)}g` : `Qty: ${formatNumber(entry.amount)} ${entry.unit}`}
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
            {activeEntries.length > 4 && (
              <p className="text-xs text-center text-slate-450 italic mt-2">
                And {activeEntries.length - 4} more items. Click 'Manage Detailed Logs' to view all.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
