'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

export default function Auth() {
  const {
    authMode,
    setAuthMode,
    authState,
    setAuthState,
    authEmail,
    setAuthEmail,
    authOtpInput,
    setAuthOtpInput,
    authError,
    setAuthError,
    mockOtpMessage,
    setMockOtpMessage,
    handleSendOtp,
    handleVerifyOtp,
    registeredUsers,
  } = useApp();

  return (
    <main className="min-h-screen bg-[#fafafa] text-slate-800 p-4 sm:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Neon Aurora Blur Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-400/20 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[550px] h-[550px] rounded-full bg-fuchsia-400/25 blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-emerald-400/15 blur-[100px] pointer-events-none z-0" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-5xl font-black italic bg-gradient-to-r from-cyan-600 via-blue-600 to-fuchsia-600 bg-clip-text text-transparent filter drop-shadow-[0_2px_10px_rgba(6,182,212,0.2)]"
            style={{ fontFamily: 'Poppins' }}
          >
            NutriFlux
          </h1>
          <p
            className="text-sm text-slate-500 italic mt-2 font-semibold"
            style={{ fontFamily: 'DM Sans' }}
          >
            Personalized AI Calorie & Macro Tracker
          </p>
        </div>

        {/* Mock OTP Delivery Toast Banner */}
        {mockOtpMessage && (
          <div className="mb-4 rounded-xl border border-cyan-200 bg-cyan-50/80 backdrop-blur-md p-4 text-xs font-semibold text-cyan-800 shadow-lg animate-bounce flex items-start gap-2.5">
            <span className="text-lg">📧</span>
            <div className="flex-1">
              <div className="font-bold text-cyan-900">Demo Mailer Notification</div>
              <div className="mt-0.5 leading-relaxed font-mono select-all bg-white/60 p-2 rounded border border-cyan-100 mt-1 cursor-pointer" title="Double click to copy code">
                {mockOtpMessage}
              </div>
              <div className="text-[10px] text-cyan-600 mt-1.5 italic font-medium">Click code to highlight and copy. Paste it below to log in!</div>
            </div>
          </div>
        )}

        {/* Auth Card Container */}
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 sm:p-8 border border-slate-200/80 shadow-2xl shadow-slate-100">
          {/* Tabs */}
          {authState === 'email' && (
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200/50">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError('');
                }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  authMode === 'signin'
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200/40'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                style={{ fontFamily: 'Poppins' }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError('');
                }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  authMode === 'signup'
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200/40'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                style={{ fontFamily: 'Poppins' }}
              >
                Create Account
              </button>
            </div>
          )}

          <h2
            className="text-xl sm:text-2xl font-black italic text-slate-800 mb-2"
            style={{ fontFamily: 'Poppins' }}
          >
            {authState === 'email'
              ? authMode === 'signin'
                ? 'Welcome Back'
                : 'Get Started'
              : 'Enter OTP Code'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold italic mb-6">
            {authState === 'email'
              ? authMode === 'signin'
                ? 'Sign in to access your custom calorie and macro trackers.'
                : 'Create a new profile. Ready-to-go dummy logs will be seeded.'
              : `We sent a 6-digit OTP code to ${authEmail}.`}
          </p>

          {authError && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-150 p-3 text-xs font-bold text-red-600">
              ⚠️ {authError}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); authState === 'email' ? handleSendOtp() : handleVerifyOtp(); }}>
            {authState === 'email' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold italic text-slate-500 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g. demo@nutriflux.com"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 outline-none focus:border-cyan-500 transition text-sm shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold shadow-lg shadow-cyan-500/10 active:scale-95 transition-all py-3.5 text-center italic text-sm"
                  style={{ fontFamily: 'Poppins' }}
                >
                  {authMode === 'signin' ? 'Send OTP Code ➔' : 'Register Email ➔'}
                </button>
                
                {authMode === 'signin' && (
                  <div className="mt-4 text-center">
                    <span className="text-xs text-slate-400 font-medium">Quick Demo Account: </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthEmail('demo@nutriflux.com');
                        setAuthMode('signin');
                      }}
                      className="text-xs text-cyan-600 hover:underline font-bold"
                    >
                      demo@nutriflux.com
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold italic text-slate-500 uppercase tracking-wider mb-2">
                    6-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    pattern="\d{6}"
                    value={authOtpInput}
                    onChange={(e) => setAuthOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 123456"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-lg font-black tracking-widest text-slate-800 placeholder-slate-300 outline-none focus:border-cyan-500 transition shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold shadow-lg shadow-emerald-500/10 active:scale-95 transition-all py-3.5 text-center italic text-sm"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Verify & Sign In ✓
                </button>

                <div className="flex items-center justify-between text-xs font-bold italic mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthState('email');
                      setAuthError('');
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ← Edit Email
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-cyan-600 hover:text-cyan-700"
                  >
                    Resend Code ⟳
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
