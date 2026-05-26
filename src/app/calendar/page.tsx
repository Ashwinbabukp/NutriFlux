'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  useApp,
  formatNumber,
  getTodayDateString,
  getDaysInMonth,
  getFirstDayOfWeekIndex,
  getMonthYearLabel
} from '@/context/AppContext';

export default function CalendarPage() {
  const router = useRouter();
  const {
    entries,
    dailyCalorieGoal,
    selectedDate,
    setSelectedDate,
    setDailyCalorieGoal,
  } = useApp();

  // Group days of current month for Monthly Report
  const monthlyDaysData = useMemo(() => {
    const targetDate = selectedDate || getTodayDateString();
    const days = getDaysInMonth(targetDate);
    
    const dailyMap: Record<
      string,
      { calories: number; protein: number; carbs: number; fat: number; hasLogs: boolean }
    > = {};

    days.forEach((day) => {
      dailyMap[day] = { calories: 0, protein: 0, carbs: 0, fat: 0, hasLogs: false };
    });

    entries.forEach((entry) => {
      if (dailyMap[entry.date] !== undefined) {
        dailyMap[entry.date].calories += entry.calories;
        dailyMap[entry.date].protein += entry.protein;
        dailyMap[entry.date].carbs += entry.carbs;
        dailyMap[entry.date].fat += entry.fat;
        dailyMap[entry.date].hasLogs = true;
      }
    });

    return days.map((day) => ({
      date: day,
      ...dailyMap[day],
    }));
  }, [entries, selectedDate]);

  const loggedDays = useMemo(() => {
    return monthlyDaysData.filter((d) => d.hasLogs);
  }, [monthlyDaysData]);

  const averageCalories = useMemo(() => {
    if (loggedDays.length === 0) return 0;
    return loggedDays.reduce((sum, d) => sum + d.calories, 0) / loggedDays.length;
  }, [loggedDays]);

  const adherenceRate = useMemo(() => {
    if (loggedDays.length === 0) return 0;
    const adhered = loggedDays.filter((d) => d.calories <= dailyCalorieGoal);
    return (adhered.length / loggedDays.length) * 100;
  }, [loggedDays, dailyCalorieGoal]);

  const averageMacros = useMemo(() => {
    if (loggedDays.length === 0) return { protein: 0, carbs: 0, fat: 0 };
    return {
      protein: loggedDays.reduce((sum, d) => sum + d.protein, 0) / loggedDays.length,
      carbs: loggedDays.reduce((sum, d) => sum + d.carbs, 0) / loggedDays.length,
      fat: loggedDays.reduce((sum, d) => sum + d.fat, 0) / loggedDays.length,
    };
  }, [loggedDays]);

  // Handler for calendar date click
  const handleDateClick = (dateString: string) => {
    setSelectedDate(dateString);
    router.push('/track');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black italic text-slate-800 tracking-tight" style={{ fontFamily: 'Poppins' }}>
            Calendar & Progress
          </h1>
          <p className="text-sm text-slate-500 italic font-semibold mt-1">
            Audit your nutrition achievements, averages, and historical logs.
          </p>
        </div>

        {/* Goal Setting inside Calendar */}
        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm self-start md:self-auto">
          <label className="flex items-center gap-2 text-xs font-black italic text-slate-500 uppercase tracking-wider" style={{ fontFamily: 'Poppins' }}>
            <span>Calorie Limit:</span>
            <div className="flex items-center gap-1 not-italic">
              <input
                type="number"
                min={500}
                max={10000}
                step={50}
                value={dailyCalorieGoal}
                onChange={(e) => setDailyCalorieGoal(Number(e.target.value))}
                className="w-18 rounded bg-slate-50 border border-slate-200 px-2 py-1 text-center text-xs font-black text-cyan-600 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-400 font-bold uppercase">kcal</span>
            </div>
          </label>
        </div>
      </div>

      {/* Stats Dashboard Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white/70 backdrop-blur-md p-4 sm:p-5 border border-slate-200/80 shadow-md">
          <p className="text-[10px] font-bold italic text-slate-400 uppercase tracking-wider" style={{ fontFamily: 'Poppins' }}>
            Avg Daily Intake
          </p>
          <p className="mt-2 text-2xl font-black text-cyan-600 font-mono" style={{ fontFamily: 'Poppins' }}>
            {formatNumber(averageCalories, 0)} kcal
          </p>
          <p className="text-[10px] text-slate-400 mt-1.5 font-medium italic">
            Over {loggedDays.length} logged day{loggedDays.length === 1 ? '' : 's'}
          </p>
        </div>

        <div className="rounded-2xl bg-white/70 backdrop-blur-md p-4 sm:p-5 border border-slate-200/80 shadow-md">
          <p className="text-[10px] font-bold italic text-slate-400 uppercase tracking-wider" style={{ fontFamily: 'Poppins' }}>
            Goal Adherence
          </p>
          <p className="mt-2 text-2xl font-black text-emerald-600 font-mono" style={{ fontFamily: 'Poppins' }}>
            {formatNumber(adherenceRate, 0)}%
          </p>
          <p className="text-[10px] text-slate-400 mt-1.5 font-medium italic">
            {loggedDays.filter((d) => d.calories <= dailyCalorieGoal).length} days kept under limit
          </p>
        </div>

        <div className="rounded-2xl bg-white/70 backdrop-blur-md p-4 sm:p-5 border border-slate-200/80 shadow-md">
          <p className="text-[10px] font-bold italic text-slate-400 uppercase tracking-wider" style={{ fontFamily: 'Poppins' }}>
            Average Macros
          </p>
          <div className="mt-2.5 flex items-baseline gap-1 text-slate-700 font-bold" style={{ fontFamily: 'Poppins' }}>
            <span className="text-sm font-black text-emerald-600">{formatNumber(averageMacros.protein, 0)}g</span>
            <span className="text-[9px] text-slate-400 font-normal">P</span>
            <span className="text-xs text-slate-200 mx-0.5">|</span>
            <span className="text-sm font-black text-amber-600">{formatNumber(averageMacros.carbs, 0)}g</span>
            <span className="text-[9px] text-slate-400 font-normal">C</span>
            <span className="text-xs text-slate-200 mx-0.5">|</span>
            <span className="text-sm font-black text-fuchsia-600">{formatNumber(averageMacros.fat, 0)}g</span>
            <span className="text-[9px] text-slate-400 font-normal">F</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 font-medium italic">
            Daily averages recorded
          </p>
        </div>

        <div className="rounded-2xl bg-white/70 backdrop-blur-md p-4 sm:p-5 border border-slate-200/80 shadow-md">
          <p className="text-[10px] font-bold italic text-slate-400 uppercase tracking-wider" style={{ fontFamily: 'Poppins' }}>
            Logged Ratio
          </p>
          <p className="mt-2 text-2xl font-black text-slate-700 font-mono" style={{ fontFamily: 'Poppins' }}>
            {loggedDays.length}{' '}
            <span className="text-xs font-normal text-slate-400 not-italic">
              / {monthlyDaysData.length} days
            </span>
          </p>
          <p className="text-[10px] text-slate-400 mt-1.5 font-medium italic">
            Total active month coverage
          </p>
        </div>
      </div>

      {/* Main Monthly Calendar Card */}
      <div className="rounded-2xl bg-white/70 backdrop-blur-md p-6 border border-slate-200/80 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-black italic text-slate-800" style={{ fontFamily: 'Poppins' }}>
              {getMonthYearLabel(selectedDate || getTodayDateString())}
            </h2>
            <p className="text-xs text-slate-400 mt-1 italic font-semibold">
              Click a cell to open the tracker and edit meals for that specific day.
            </p>
          </div>
        </div>

        {/* Calendar Grid - PC/Tablet view */}
        <div className="hidden md:block bg-slate-50/50 rounded-xl p-6 border border-slate-200 shadow-inner">
          <div className="grid grid-cols-7 gap-2.5 mb-3 text-center text-xs font-black text-slate-400 uppercase tracking-wider" style={{ fontFamily: 'Poppins' }}>
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-2.5">
            {/* Pad prepending days */}
            {Array.from({ length: getFirstDayOfWeekIndex(selectedDate || getTodayDateString()) }).map((_, index) => (
              <div key={`pad-${index}`} className="aspect-square bg-slate-100/50 rounded-xl border border-dashed border-slate-200/40" />
            ))}

            {/* Days cells */}
            {monthlyDaysData.map((dayData) => {
              const dateObj = new Date(dayData.date + 'T00:00:00');
              const dayNum = dateObj.getDate();
              const isSelected = dayData.date === selectedDate;

              let cellClass = 'bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50/50 text-slate-600';
              let badgeClass = 'text-slate-500 bg-slate-100';

              if (dayData.hasLogs) {
                const ratio = dayData.calories / dailyCalorieGoal;
                if (ratio > 1.0) {
                  cellClass = 'bg-red-50/80 border-red-200 text-red-800 hover:bg-red-55 shadow-sm';
                  badgeClass = 'bg-red-100 text-red-700 border border-red-200/45';
                } else if (ratio >= 0.8) {
                  cellClass = 'bg-emerald-50/80 border-emerald-200 text-emerald-800 hover:bg-emerald-55 shadow-sm';
                  badgeClass = 'bg-emerald-100 text-emerald-700 border border-emerald-200/45';
                } else {
                  cellClass = 'bg-cyan-50/80 border-cyan-200 text-cyan-800 hover:bg-cyan-55 shadow-sm';
                  badgeClass = 'bg-cyan-100 text-cyan-700 border border-cyan-200/45';
                }
              }

              if (isSelected) {
                cellClass += ' ring-2 ring-cyan-500 border-transparent z-10 shadow-[0_0_12px_rgba(6,182,212,0.25)]';
              }

              return (
                <button
                  key={dayData.date}
                  type="button"
                  onClick={() => handleDateClick(dayData.date)}
                  className={`flex flex-col justify-between p-3 aspect-square rounded-xl border text-left transition cursor-pointer group ${cellClass}`}
                >
                  <div className="flex items-start justify-between w-full">
                    <span className={`text-sm font-black rounded px-1.5 py-0.5 ${isSelected ? 'bg-cyan-600 text-white' : 'text-slate-700'}`} style={{ fontFamily: 'Poppins' }}>
                      {dayNum}
                    </span>
                    {dayData.hasLogs && (
                      <span className={`text-[9px] font-black rounded px-1.5 py-0.5 ${badgeClass}`} style={{ fontFamily: 'Poppins' }}>
                        {formatNumber(dayData.calories, 0)} kcal
                      </span>
                    )}
                  </div>

                  {dayData.hasLogs ? (
                    <div className="w-full mt-2">
                      <div className="w-full h-1 bg-slate-200/80 rounded-full overflow-hidden mb-1">
                        <div
                          className={`h-full rounded-full transition-all ${
                            dayData.calories > dailyCalorieGoal
                              ? 'bg-red-500'
                              : dayData.calories >= dailyCalorieGoal * 0.8
                              ? 'bg-emerald-500'
                              : 'bg-cyan-500'
                          }`}
                          style={{ width: `${Math.min((dayData.calories / dailyCalorieGoal) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[8px] text-slate-500 font-bold">
                        <span>P:{formatNumber(dayData.protein, 0)}</span>
                        <span>C:{formatNumber(dayData.carbs, 0)}</span>
                        <span>F:{formatNumber(dayData.fat, 0)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[9px] text-slate-300 italic group-hover:text-cyan-600 font-bold transition">
                      + Log day
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Calendar Mobile list view */}
        <div className="block md:hidden bg-slate-50/50 rounded-xl p-4 border border-slate-200 shadow-inner space-y-2 max-h-[420px] overflow-y-auto">
          {monthlyDaysData.map((dayData) => {
            const dateObj = new Date(dayData.date + 'T00:00:00');
            const isSelected = dayData.date === selectedDate;
            const ratio = dayData.calories / dailyCalorieGoal;

            let rowBg = 'bg-white border-slate-200 hover:border-slate-350 text-slate-650';
            let statusText = 'No entries logged';
            let statusColor = 'text-slate-400 font-semibold';

            if (dayData.hasLogs) {
              statusText = `${formatNumber(dayData.calories, 0)} kcal`;
              if (ratio > 1.0) {
                rowBg = 'bg-red-50/80 border-red-200 text-red-800 shadow-sm';
                statusColor = 'text-red-600 font-black';
              } else if (ratio >= 0.8) {
                rowBg = 'bg-emerald-50/80 border-emerald-200 text-emerald-800 shadow-sm';
                statusColor = 'text-emerald-600 font-black';
              } else {
                rowBg = 'bg-cyan-50/80 border-cyan-200 text-cyan-800 shadow-sm';
                statusColor = 'text-cyan-600 font-black';
              }
            }

            if (isSelected) {
              rowBg += ' ring-2 ring-cyan-500 border-transparent shadow-[0_0_10px_rgba(6,182,212,0.2)]';
            }

            return (
              <button
                key={dayData.date}
                type="button"
                onClick={() => handleDateClick(dayData.date)}
                className={`w-full flex flex-col p-3.5 rounded-xl border text-left transition cursor-pointer gap-2 ${rowBg}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-800" style={{ fontFamily: 'Poppins' }}>
                    {dateObj.toLocaleDateString('default', { day: 'numeric', month: 'short', weekday: 'short' })}
                  </span>
                  <span className={`text-xs ${statusColor}`} style={{ fontFamily: 'Poppins' }}>
                    {statusText}
                  </span>
                </div>

                {dayData.hasLogs ? (
                  <div className="space-y-1.5 w-full">
                    <div className="flex gap-2 text-[9px] text-slate-500 font-bold">
                      <span className="bg-emerald-50 text-emerald-700 px-1.5 rounded">P: {formatNumber(dayData.protein, 0)}g</span>
                      <span className="bg-amber-50 text-amber-700 px-1.5 rounded">C: {formatNumber(dayData.carbs, 0)}g</span>
                      <span className="bg-fuchsia-50 text-fuchsia-700 px-1.5 rounded">F: {formatNumber(dayData.fat, 0)}g</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-150 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          dayData.calories > dailyCalorieGoal
                            ? 'bg-red-500'
                            : dayData.calories >= dailyCalorieGoal * 0.8
                            ? 'bg-emerald-500'
                            : 'bg-cyan-500'
                        }`}
                        style={{ width: `${Math.min((dayData.calories / dailyCalorieGoal) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 italic font-medium">+ Touch to log this day</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
