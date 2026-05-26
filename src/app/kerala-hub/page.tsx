'use client';

import React, { useState } from 'react';

export default function KeralaHubPage() {
  const [selectedLeafPortion, setSelectedLeafPortion] = useState<string | null>(null);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black italic text-slate-800 tracking-tight" style={{ fontFamily: 'Poppins' }}>
          Kerala Diet & Wellness 🌴
        </h1>
        <p className="text-sm text-slate-500 italic font-semibold mt-1">
          Explore nutritional balances using native South Indian foods & traditional wisdom.
        </p>
      </div>

      {/* Main Grid: Leaf Balance and Superfoods */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Leaf Balance - taking 7 cols on large screens */}
        <div className="lg:col-span-7 rounded-2xl bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-950 text-slate-100 p-6 border border-emerald-500/20 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-emerald-500/10 blur-[60px] pointer-events-none" />
          <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 rounded-full bg-teal-500/10 blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <div className="border-b border-emerald-500/25 pb-4 mb-6">
              <h2 className="text-2xl font-black italic bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins' }}>
                Traditional Banana Leaf Plate Balance
              </h2>
              <p className="text-xs text-emerald-300/80 italic font-semibold mt-1">
                Click different portions of the banana leaf plate to explore diet tips & traditional portion guides.
              </p>
            </div>

            {/* Banana Leaf Graphic Layout */}
            <div className="my-6 flex flex-col items-center">
              <div className="w-full max-w-[450px] aspect-[2/1] relative bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-[50%/10%] border-2 border-emerald-500/40 p-2 overflow-hidden shadow-inner flex flex-col justify-between">
                {/* Leaf Spine / Center Line */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-400/30 -translate-y-1/2" />
                
                {/* Top half: Curries & Sides */}
                <div className="grid grid-cols-2 h-1/2 relative z-10 pb-0.5">
                  <button
                    type="button"
                    onClick={() => setSelectedLeafPortion('fiber')}
                    className={`m-1 rounded bg-emerald-950/40 hover:bg-emerald-950/60 border transition-all flex flex-col items-center justify-center p-1.5 cursor-pointer ${
                      selectedLeafPortion === 'fiber' 
                        ? 'border-emerald-300 ring-2 ring-emerald-300/50 bg-emerald-950/80 text-white font-black' 
                        : 'border-emerald-500/20 text-slate-350 text-slate-300'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">🥗 Fiber & Vitamins</span>
                    <span className="text-[9px] text-emerald-350/80 font-semibold italic mt-0.5">Thoran & Avial</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedLeafPortion('protein')}
                    className={`m-1 rounded bg-emerald-950/40 hover:bg-emerald-950/60 border transition-all flex flex-col items-center justify-center p-1.5 cursor-pointer ${
                      selectedLeafPortion === 'protein' 
                        ? 'border-emerald-300 ring-2 ring-emerald-300/50 bg-emerald-950/80 text-white font-black' 
                        : 'border-emerald-500/20 text-slate-355 text-slate-300'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">🍗 Lean Proteins</span>
                    <span className="text-[9px] text-emerald-355/80 font-semibold italic mt-0.5">Fish/Egg Curry, Kadala</span>
                  </button>
                </div>

                {/* Bottom half: Carbs & Fats/Probiotics */}
                <div className="grid grid-cols-2 h-1/2 relative z-10 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setSelectedLeafPortion('carbs')}
                    className={`m-1 rounded bg-emerald-950/40 hover:bg-emerald-950/60 border transition-all flex flex-col items-center justify-center p-1.5 cursor-pointer ${
                      selectedLeafPortion === 'carbs' 
                        ? 'border-emerald-300 ring-2 ring-emerald-300/50 bg-emerald-950/80 text-white font-black' 
                        : 'border-emerald-500/20 text-slate-355 text-slate-300'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">🍚 Energy Source</span>
                    <span className="text-[9px] text-emerald-355/80 font-semibold italic mt-0.5">Matta Rice, Tapioca</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedLeafPortion('fats')}
                    className={`m-1 rounded bg-emerald-950/40 hover:bg-emerald-950/60 border transition-all flex flex-col items-center justify-center p-1.5 cursor-pointer ${
                      selectedLeafPortion === 'fats' 
                        ? 'border-emerald-300 ring-2 ring-emerald-300/50 bg-emerald-950/80 text-white font-black' 
                        : 'border-emerald-500/20 text-slate-355 text-slate-300'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">🥥 Fats & Probiotics</span>
                    <span className="text-[9px] text-emerald-355/80 font-semibold italic mt-0.5">Coconut, Curd, Pachadi</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Educational feedback panel */}
            <div className="mt-6 rounded-xl bg-emerald-950/60 p-4 border border-emerald-500/20 text-xs min-h-[110px] flex items-start gap-3">
              <div className="text-lg">💡</div>
              <div className="flex-1">
                {!selectedLeafPortion ? (
                  <p className="text-emerald-300/90 font-medium italic animate-pulse leading-relaxed">
                    Tap any banana leaf portion above (Fiber, Protein, Energy, or Fats) to view expert dietary insights for balancing a Kerala meal.
                  </p>
                ) : selectedLeafPortion === 'fiber' ? (
                  <div className="animate-fade-in">
                    <h4 className="font-bold text-emerald-300 text-sm mb-1">Thoran & Avial (50% Leaf Area Recommended)</h4>
                    <p className="text-slate-300 leading-relaxed">
                      Traditional vegetable sides like Cabbage Thoran and Avial are loaded with fiber, potassium, and micronutrients. 
                      <strong className="text-emerald-250 block mt-1">Fitness Tip:</strong> Increase the portion size of Thoran and Avial. Their high fiber content provides fullness (satiety) on fewer calories, helping control weight while getting vital nutrients.
                    </p>
                  </div>
                ) : selectedLeafPortion === 'protein' ? (
                  <div className="animate-fade-in">
                    <h4 className="font-bold text-emerald-300 text-sm mb-1">Proteins & Curries (25% Leaf Area Recommended)</h4>
                    <p className="text-slate-300 leading-relaxed">
                      Spicy fish curry, beef fry, egg roast, and Kadala (chickpea) curry are excellent protein options.
                      <strong className="text-emerald-250 block mt-1">Fitness Tip:</strong> Kerala breakfast foods (Appam, Puttu, Idiyappam) are naturally high in carbohydrates. Always pair them with Kadala curry or Egg curry rather than plain sugar or coconut milk to balance the macro ratio and prevent blood sugar spikes.
                    </p>
                  </div>
                ) : selectedLeafPortion === 'carbs' ? (
                  <div className="animate-fade-in">
                    <h4 className="font-bold text-emerald-300 text-sm mb-1">Starchy Carbohydrates (25% Leaf Area Recommended)</h4>
                    <p className="text-slate-300 leading-relaxed">
                      Matta Rice (brown/red parboiled rice) and Kappa (tapioca) are staples that supply glycogen.
                      <strong className="text-emerald-250 block mt-1">Fitness Tip:</strong> Matta rice is highly recommended over white rice because it retains the outer bran layers, yielding a lower glycemic index, more B vitamins, and high dietary fiber for stable, sustained energy release.
                    </p>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <h4 className="font-bold text-emerald-300 text-sm mb-1">Fats & Digestion (Subtle Accents Recommended)</h4>
                    <p className="text-slate-300 leading-relaxed">
                      Coconut oil, coconut milk, and curd/pachadi are used to flavor dishes. Curd acts as a natural probiotic.
                      <strong className="text-emerald-250 block mt-1">Fitness Tip:</strong> Coconut contains Medium-Chain Triglycerides (MCTs) which are burned rapidly by the liver for energy. However, fats are calorie-dense (9 kcal/g), so watch overall cooking oil amounts if trying to lose weight!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Superfoods Guide - taking 5 cols on large screens */}
        <div className="lg:col-span-5 rounded-2xl bg-white/70 backdrop-blur-xl p-6 border border-slate-200/80 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black italic text-slate-800 uppercase tracking-wide mb-1" style={{ fontFamily: 'Poppins' }}>
              Wellness Superfoods
            </h3>
            <p className="text-xs text-slate-400 italic font-semibold mb-6">Traditional ingredients that pack huge nutritional values.</p>
            
            <div className="space-y-4">
              <div className="flex gap-3 p-3 bg-slate-50 border border-slate-150 rounded-xl hover:shadow-sm transition">
                <span className="text-2xl mt-0.5">🌿</span>
                <div>
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider" style={{ fontFamily: 'Poppins' }}>Moringa (Muringakkai)</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Rich in Iron, Vitamin C, and plant-based Calcium. Helps lower blood pressure and combat cellular inflammation.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-slate-50 border border-slate-150 rounded-xl hover:shadow-sm transition">
                <span className="text-2xl mt-0.5">🌶️</span>
                <div>
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider" style={{ fontFamily: 'Poppins' }}>Turmeric & Black Pepper</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Traditional curries blend turmeric (curcumin) with black pepper (piperine). Pepper increases curcumin absorption by up to 2000%!
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-slate-50 border border-slate-150 rounded-xl hover:shadow-sm transition">
                <span className="text-2xl mt-0.5">Leaf</span>
                <div>
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider" style={{ fontFamily: 'Poppins' }}>Curry Leaves (Kariveppila)</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Contains antioxidant compounds. Promotes healthy digestion, supports hair strength, and aids cholesterol control.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-slate-50 border border-slate-150 rounded-xl hover:shadow-sm transition">
                <span className="text-2xl mt-0.5">🍊</span>
                <div>
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider" style={{ fontFamily: 'Poppins' }}>Kudampuli (Garcinia Cambogia)</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Traditional wood-smoked tamarind used in fish curries. Contains Hydroxycitric Acid (HCA) which supports natural appetite control.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-3 text-[10px] text-emerald-800 font-semibold italic mt-6 text-center">
            🌴 Fact: Most Kerala dishes use fresh grated coconut instead of heavy dairy creams, making them light and fiber-rich!
          </div>
        </div>
      </div>
    </div>
  );
}
