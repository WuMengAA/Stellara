<script setup lang="ts">
definePageMeta({ layout: false })
</script>

<template>
  <div class="gallery">
    <h1 class="gallery-title">OpenUI 效果画廊</h1>

    <div class="card">
      <span class="badge">button6.md</span>
      <div class="preview">
        <div class="b6-wrap">
          <button class="b6-btn">
            <div class="b6-bg"></div>
            <div class="b6-wrap-inner">
              <div class="b6-outline"></div>
              <div class="b6-content">
                <div class="b6-char b6-state-1">
                  <span v-for="(ch, i) in 'Hover'.split('')" :key="i" :data-label="ch" :style="{ '--i': i }">{{ ch }}</span>
                </div>
                <div class="b6-char b6-state-2">
                  <span v-for="i in 3" :key="i" data-label="&#9679;" :style="{ '--i': i - 1 }">&#9679;</span>
                </div>
                <div class="b6-icon"><div></div></div>
              </div>
              <svg class="b6-path" viewBox="0 0 138 50">
                <path fill="none" stroke-dasharray="150 480" stroke-dashoffset="150" stroke-width="4" d="M130.5 46.5H7c-3.5 0-5.5-2-5.5-5.5V9c0-3.5 2-5.5 5.5-5.5h124c3.5 0 5.5 2 5.5 5.5v28c0 3.5-2 9.5-6 9.5z"></path>
              </svg>
              <svg class="b6-splash" viewBox="0 0 60 60">
                <path fill="none" stroke-width="2" d="M10 10h40v40H10z"></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>

    <div class="card">
      <span class="badge">mcload.md</span>
      <div class="preview">
        <div class="mc-wrap">
          <div class="mc-grid">
            <div v-for="(letter, idx) in 'STELLAR'.split('')" :key="idx" class="mc-cube">
              <div class="mc-face mc-front">{{ letter }}</div>
              <div class="mc-face mc-back">{{ letter }}</div>
              <div class="mc-face mc-left">{{ letter }}</div>
              <div class="mc-face mc-right">{{ letter }}</div>
              <div class="mc-face mc-top">{{ letter }}</div>
              <div class="mc-face mc-bottom">{{ letter }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <span class="badge">search.md</span>
      <div class="preview">
        <div class="sr-wrap">
          <div id="sr-poda">
            <div id="sr-main">
              <div class="sr-grid"></div>
              <div class="sr-white"></div>
              <div class="sr-border"></div>
              <div class="sr-dark-bg"></div>
              <div class="sr-glow"></div>
              <input class="sr-input" placeholder="Search..." type="text">
              <div id="sr-mask"></div>
              <div id="sr-pink"></div>
              <div id="sr-icon">&#128269;</div>
            </div>
            <div class="sr-filter-border"></div>
            <div id="sr-filter-icon">&#9881;</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <span class="badge">button.md (theme toggle)</span>
      <div class="preview">
        <div class="th-wrap">
          <label class="th-switch">
            <input type="checkbox" class="th-checkbox">
            <div class="th-container">
              <div class="th-circle">
                <div class="th-sun-moon">
                  <div class="th-moon">
                    <div class="th-spot"></div>
                    <div class="th-spot"></div>
                    <div class="th-spot"></div>
                  </div>
                </div>
              </div>
              <div class="th-clouds"></div>
              <div class="th-stars">&#10022; &#10022; &#10022;</div>
            </div>
          </label>
        </div>
      </div>
    </div>

    <div class="card">
      <span class="badge">&#25991;&#23383;&#24425;&#34425;&#28014;&#29616;.md</span>
      <div class="preview">
        <div class="rb-wrap">
          <div class="rb-loader"></div>
          <span v-for="(ch, i) in 'STELLAR'.split('')" :key="i" class="rb-letter">{{ ch }}</span>
        </div>
      </div>
    </div>

    <div class="card">
      <span class="badge">&#27969;&#20809;&#32972;&#26223;.md</span>
      <div class="preview">
        <div class="au-wrap">
          <div class="au-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery {
  min-height: 100vh;
  background: #0a0a0f;
  padding: 48px 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 32px;
  align-content: start;
}
.gallery-title {
  grid-column: 1 / -1;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 2em;
  font-weight: 600;
  color: #eee;
  margin: 0 0 8px;
}
.card {
  background: #13131a;
  border-radius: 16px;
  border: 1px solid #1e1e2a;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.badge {
  display: block;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.75em;
  color: #888;
  padding: 10px 16px;
  background: #0e0e15;
  border-bottom: 1px solid #1e1e2a;
}
.preview {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  min-height: 200px;
}

.b6-wrap {
  transform: scale(0.75);
}
.b6-btn {
  --white: #ffe7ff;
  --purple-100: #f4b1fd;
  --purple-200: #d190ff;
  --purple-300: #c389f2;
  --purple-400: #8e26e2;
  --purple-500: #5e2b83;
  --radius: 18px;
  border-radius: var(--radius);
  outline: none;
  cursor: pointer;
  font-size: 23px;
  font-family: Arial;
  background: transparent;
  letter-spacing: -1px;
  border: 0;
  position: relative;
  width: 220px;
  height: 80px;
  transform: rotate(353deg) skewX(4deg);
}
.b6-bg {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  filter: blur(1px);
}
.b6-bg::before, .b6-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: calc(var(--radius) * 1.1);
  background: var(--purple-500);
}
.b6-bg::before {
  filter: blur(5px);
  transition: all 0.3s ease;
  box-shadow: -7px 6px 0 0 rgba(115,75,155,0.4), -14px 12px 0 0 rgba(115,75,155,0.3), -21px 18px 4px 0 rgba(115,75,155,0.25), -28px 24px 8px 0 rgba(115,75,155,0.15), -35px 30px 12px 0 rgba(115,75,155,0.12), -42px 36px 16px 0 rgba(115,75,155,0.08), -56px 42px 20px 0 rgba(115,75,155,0.05);
}
.b6-wrap-inner {
  border-radius: inherit;
  overflow: hidden;
  height: 100%;
  transform: translate(6px, -6px);
  padding: 3px;
  background: linear-gradient(to bottom, var(--purple-100), var(--purple-400));
  position: relative;
  transition: all 0.3s ease;
}
.b6-outline {
  position: absolute;
  overflow: hidden;
  inset: 0;
  opacity: 0;
  outline: none;
  border-radius: inherit;
  transition: all 0.4s ease;
}
.b6-outline::before {
  content: "";
  position: absolute;
  inset: 2px;
  width: 120px;
  height: 300px;
  margin: auto;
  background: linear-gradient(to right, transparent, white, transparent);
  animation: b6-spin 3s linear infinite;
  animation-play-state: paused;
}
.b6-content {
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  position: relative;
  height: 100%;
  gap: 16px;
  border-radius: calc(var(--radius) * 0.85);
  font-weight: 600;
  transition: all 0.3s ease;
  background: linear-gradient(to bottom, var(--purple-300), var(--purple-400));
  box-shadow: inset -2px 12px 11px -5px var(--purple-200), inset 1px -3px 11px 0 rgba(0,0,0,0.35);
}
.b6-content::before {
  content: "";
  inset: 0;
  position: absolute;
  z-index: 10;
  width: 80%;
  top: 45%;
  bottom: 35%;
  opacity: 0.7;
  margin: auto;
  background: linear-gradient(to bottom, transparent, var(--purple-400));
  filter: brightness(1.3) blur(5px);
}
.b6-char {
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.b6-char span {
  display: block;
  color: transparent;
  position: relative;
}
.b6-char span:nth-child(5) { margin-left: 5px; }
.b6-state-1 span:nth-child(5) { margin-right: -3px; }
.b6-state-1 span {
  animation: b6-char-appear 1.2s ease backwards calc(var(--i) * 0.03s);
}
.b6-state-1 span::before, .b6-char span::after {
  content: attr(data-label);
  position: absolute;
  color: var(--white);
  text-shadow: -1px 1px 2px var(--purple-500);
  left: 0;
}
.b6-char span::before {
  opacity: 0;
  transform: translateY(-100%);
}
.b6-state-2 { position: absolute; left: 80px; }
.b6-state-2 span::after { opacity: 1; }
.b6-icon {
  animation: b6-reset-arrow 0.8s cubic-bezier(0.7, -0.5, 0.3, 1.2) forwards;
  z-index: 10;
}
.b6-icon div, .b6-icon div::before, .b6-icon div::after {
  height: 3px;
  border-radius: 1px;
  background-color: var(--white);
}
.b6-icon div::before, .b6-icon div::after {
  content: "";
  position: absolute;
  right: 0;
  transform-origin: center right;
  width: 14px;
  border-radius: 15px;
  transition: all 0.3s ease;
}
.b6-icon div {
  position: relative;
  width: 24px;
  box-shadow: -2px 2px 5px var(--purple-400);
  transform: scale(0.9);
  background: linear-gradient(to bottom, var(--white), var(--purple-100));
  animation: b6-swing-arrow 1s ease-in-out infinite;
  animation-play-state: paused;
}
.b6-icon div::before {
  transform: rotate(44deg);
  top: 1px;
  box-shadow: 1px -2px 3px -1px var(--purple-400);
  animation: b6-rotate-line 1s linear infinite;
  animation-play-state: paused;
}
.b6-icon div::after {
  bottom: 1px;
  transform: rotate(316deg);
  box-shadow: -2px 2px 3px 0 var(--purple-400);
  background: linear-gradient(200deg, var(--white), var(--purple-100));
  animation: b6-rotate-line2 1s linear infinite;
  animation-play-state: paused;
}
.b6-path {
  position: absolute;
  z-index: 12;
  bottom: 0;
  left: 0;
  right: 0;
  stroke-dasharray: 150 480;
  stroke-dashoffset: 150;
  pointer-events: none;
}
.b6-splash {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  stroke-dasharray: 60 60;
  stroke-dashoffset: 60;
  transform: translate(-17%, -31%);
  stroke: var(--purple-300);
}
.b6-btn:hover .b6-outline { opacity: 1; }
.b6-btn:hover .b6-outline::before,
.b6-btn:hover .b6-icon div,
.b6-btn:hover .b6-icon div::before,
.b6-btn:hover .b6-icon div::after { animation-play-state: running; }
.b6-btn:hover .b6-wrap-inner { transform: translate(8px, -8px); }
.b6-btn:hover .b6-state-1 span::before {
  animation: b6-char-appear 0.7s ease calc(var(--i) * 0.03s);
}
.b6-btn:hover .b6-state-1 span::after {
  opacity: 1;
  animation: b6-char-disappear 0.7s ease calc(var(--i) * 0.03s);
}
.b6-btn:active .b6-bg::before {
  filter: blur(5px);
  opacity: 0.7;
  box-shadow: -7px 6px 0 0 rgba(115,75,155,0.4), -14px 12px 0 0 rgba(115,75,155,0.25), -21px 18px 4px 0 rgba(115,75,155,0.15);
}
.b6-btn:active .b6-content {
  box-shadow: inset -1px 12px 8px -5px rgba(71,0,137,0.4), inset 0 -3px 8px 0 var(--purple-200);
}
.b6-btn:active .b6-wrap-inner { transform: translate(3px, -3px); }
.b6-btn:active .b6-outline { opacity: 0; }
.b6-btn:active .b6-splash {
  animation: b6-splash-anim 0.8s cubic-bezier(0.3, 0, 0, 1) forwards 0.05s;
}
.b6-btn:focus .b6-path {
  animation: b6-path-anim 1.6s ease forwards 0.2s;
}
.b6-btn:focus .b6-icon {
  animation: b6-arrow-anim 1s cubic-bezier(0.7, -0.5, 0.3, 1.5) forwards;
}
.b6-state-2 span::after,
.b6-btn:focus .b6-state-1 span {
  animation: b6-char-disappear 0.5s ease forwards calc(var(--i) * 0.03s);
}
.b6-btn:focus .b6-state-2 span::after {
  animation: b6-char-appear 1s ease backwards calc(var(--i) * 0.03s);
}
@keyframes b6-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes b6-char-appear {
  0% { transform: translateY(50%); opacity: 0; filter: blur(20px); }
  20% { transform: translateY(70%); opacity: 1; }
  50% { transform: translateY(-15%); opacity: 1; filter: blur(0); }
  100% { transform: translateY(0); opacity: 1; }
}
@keyframes b6-char-disappear {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-70%); opacity: 0; filter: blur(3px); }
}
@keyframes b6-arrow-anim {
  0% { opacity: 1; }
  50% { transform: translateX(60px); opacity: 0; }
  51% { transform: translateX(-200px); opacity: 0; }
  100% { transform: translateX(-128px); opacity: 1; }
}
@keyframes b6-swing-arrow { 50% { transform: translateX(5px) scale(0.9); } }
@keyframes b6-rotate-line { 50% { transform: rotate(30deg); } 80% { transform: rotate(55deg); } }
@keyframes b6-rotate-line2 { 50% { transform: rotate(330deg); } 80% { transform: rotate(300deg); } }
@keyframes b6-reset-arrow { 0% { transform: translateX(-128px); } 100% { transform: translateX(0); } }
@keyframes b6-path-anim { from { stroke: white; } to { stroke-dashoffset: -480; stroke: #f9c6fe; } }
@keyframes b6-splash-anim { to { stroke-dasharray: 2 60; stroke-dashoffset: -60; } }

.mc-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
.mc-grid {
  --animation-duration: 2.1s;
  --cube-color: #0000;
  --highlight-color: #00cc44;
  --cube-width: 40px;
  --cube-height: 40px;
  --font-size: 1.5em;
  position: relative;
  display: grid;
  grid-template-columns: repeat(7, var(--cube-width));
  width: calc(7 * var(--cube-width));
  height: var(--cube-height);
  perspective: 350px;
  font-family: "Poppins", sans-serif;
  font-size: var(--font-size);
  font-weight: 800;
  color: transparent;
}
.mc-cube {
  position: relative;
  transform-style: preserve-3d;
}
.mc-face {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--cube-width);
  height: var(--cube-height);
  background-color: var(--cube-color);
}
.mc-left, .mc-right, .mc-back, .mc-front {
  box-shadow: inset 0 0 2px 1px #0001, inset 0 0 12px 1px #fff1;
}
.mc-front { transform: rotateY(0deg) translateZ(calc(var(--cube-width) / 2)); }
.mc-back { transform: rotateY(180deg) translateZ(calc(var(--cube-width) / 2)); opacity: 0.6; }
.mc-left { transform: rotateY(-90deg) translateZ(calc(var(--cube-width) / 2)); opacity: 0.6; }
.mc-right { transform: rotateY(90deg) translateZ(calc(var(--cube-width) / 2)); opacity: 0.6; }
.mc-top {
  height: var(--cube-width);
  transform: rotateX(90deg) translateZ(calc(var(--cube-width) / 2));
  opacity: 0.8;
}
.mc-bottom {
  height: var(--cube-width);
  transform: rotateX(-90deg) translateZ(calc(var(--cube-height) - var(--cube-width) * 0.5));
  opacity: 0.8;
}
.mc-cube:nth-child(1) { z-index: 0; animation-delay: 0s; }
.mc-cube:nth-child(2) { z-index: 1; animation-delay: 0.2s; }
.mc-cube:nth-child(3) { z-index: 2; animation-delay: 0.4s; }
.mc-cube:nth-child(4) { z-index: 3; animation-delay: 0.6s; }
.mc-cube:nth-child(5) { z-index: 2; animation-delay: 0.8s; }
.mc-cube:nth-child(6) { z-index: 1; animation-delay: 1s; }
.mc-cube:nth-child(7) { z-index: 0; animation-delay: 1.2s; }
.mc-cube {
  animation: mc-translate-z var(--animation-duration) ease-in-out infinite;
}
.mc-cube .mc-face {
  animation: mc-face-color var(--animation-duration) ease-in-out infinite, mc-edge-glow var(--animation-duration) ease-in-out infinite;
  animation-delay: inherit;
}
.mc-cube .mc-face.mc-front {
  animation: mc-face-color var(--animation-duration) ease-in-out infinite, mc-face-glow var(--animation-duration) ease-in-out infinite, mc-edge-glow var(--animation-duration) ease-in-out infinite;
  animation-delay: inherit;
}
@keyframes mc-translate-z {
  0%, 40%, 100% { transform: translateZ(-2px); }
  30% { transform: translateZ(16px) translateY(-1px); }
}
@keyframes mc-face-color {
  0%, 50%, 100% { background-color: var(--cube-color); }
  10% { background-color: var(--highlight-color); }
}
@keyframes mc-face-glow {
  0%, 50%, 100% { color: #fff0; filter: none; }
  30% { color: #fff; filter: drop-shadow(0 14px 10px var(--highlight-color)); }
}
@keyframes mc-edge-glow {
  0%, 40%, 100% { box-shadow: inset 0 0 2px 1px #0001, inset 0 0 12px 1px #fff1; }
  30% { box-shadow: 0 0 2px 0 var(--highlight-color); }
}

.sr-wrap { position: relative; }
#sr-poda { display: flex; align-items: center; justify-content: center; position: relative; }
#sr-main { position: relative; }
.sr-grid {
  height: 800px; width: 800px;
  background-image: linear-gradient(to right, #0f0f10 1px, transparent 1px), linear-gradient(to bottom, #0f0f10 1px, transparent 1px);
  background-size: 1rem 1rem;
  background-position: center center;
  position: absolute; z-index: -1; filter: blur(1px);
}
.sr-white, .sr-border, .sr-dark-bg, .sr-glow {
  max-height: 70px; max-width: 314px; height: 100%; width: 100%;
  position: absolute; overflow: hidden; z-index: -1; border-radius: 12px; filter: blur(3px);
}
.sr-input {
  background-color: #010201; border: none; width: 301px; height: 56px;
  border-radius: 10px; color: white; padding-inline: 59px; font-size: 18px;
}
.sr-input::placeholder { color: #c0b9c0; }
.sr-input:focus { outline: none; }
#sr-main:focus-within > #sr-mask { display: none; }
#sr-mask {
  pointer-events: none; width: 100px; height: 20px;
  position: absolute; background: linear-gradient(90deg, transparent, black);
  top: 18px; left: 70px;
}
#sr-pink {
  pointer-events: none; width: 30px; height: 20px;
  position: absolute; background: #cf30aa;
  top: 10px; left: 5px; filter: blur(20px); opacity: 0.8; transition: all 2s;
}
#sr-main:hover > #sr-pink { opacity: 0; }
.sr-white {
  max-height: 63px; max-width: 307px; border-radius: 10px; filter: blur(2px);
}
.sr-white::before {
  content: ""; z-index: -2; text-align: center;
  top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(83deg);
  position: absolute; width: 600px; height: 600px;
  background-repeat: no-repeat; background-position: 0 0;
  filter: brightness(1.4);
  background-image: conic-gradient(rgba(0,0,0,0), #a099d8, rgba(0,0,0,0) 8%, rgba(0,0,0,0) 50%, #dfa2da, rgba(0,0,0,0) 58%);
  transition: all 2s;
}
.sr-border {
  max-height: 59px; max-width: 303px; border-radius: 11px; filter: blur(0.5px);
}
.sr-border::before {
  content: ""; z-index: -2; text-align: center;
  top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(70deg);
  position: absolute; width: 600px; height: 600px;
  filter: brightness(1.3); background-repeat: no-repeat; background-position: 0 0;
  background-image: conic-gradient(#1c191c, #402fb5 5%, #1c191c 14%, #1c191c 50%, #cf30aa 60%, #1c191c 64%);
  transition: all 2s;
}
.sr-dark-bg { max-height: 65px; max-width: 312px; }
.sr-dark-bg::before {
  content: ""; z-index: -2; text-align: center;
  top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(82deg);
  position: absolute; width: 600px; height: 600px;
  background-repeat: no-repeat; background-position: 0 0;
  background-image: conic-gradient(rgba(0,0,0,0), #18116a, rgba(0,0,0,0) 10%, rgba(0,0,0,0) 50%, #6e1b60, rgba(0,0,0,0) 60%);
  transition: all 2s;
}
#sr-poda:hover > .sr-dark-bg::before,
#sr-poda:hover > .sr-glow::before,
#sr-poda:hover > .sr-white::before,
#sr-poda:hover > .sr-border::before { transform: translate(-50%,-50%) rotate(240deg); }
#sr-poda:hover > .sr-dark-bg::before { transform: translate(-50%,-50%) rotate(-98deg); }
#sr-poda:hover > .sr-glow::before { transform: translate(-50%,-50%) rotate(-120deg); }
#sr-poda:hover > .sr-white::before { transform: translate(-50%,-50%) rotate(-97deg); }
#sr-poda:hover > .sr-border::before { transform: translate(-50%,-50%) rotate(-110deg); }
#sr-poda:focus-within > .sr-dark-bg::before { transform: translate(-50%,-50%) rotate(442deg); transition: all 4s; }
#sr-poda:focus-within > .sr-glow::before { transform: translate(-50%,-50%) rotate(420deg); transition: all 4s; }
#sr-poda:focus-within > .sr-white::before { transform: translate(-50%,-50%) rotate(443deg); transition: all 4s; }
#sr-poda:focus-within > .sr-border::before { transform: translate(-50%,-50%) rotate(430deg); transition: all 4s; }
.sr-glow {
  overflow: hidden; filter: blur(30px); opacity: 0.4;
  max-height: 130px; max-width: 354px;
}
.sr-glow::before {
  content: ""; z-index: -2; text-align: center;
  top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(60deg);
  position: absolute; width: 999px; height: 999px;
  background-repeat: no-repeat; background-position: 0 0;
  background-image: conic-gradient(#000, #402fb5 5%, #000 38%, #000 50%, #cf30aa 60%, #000 87%);
  transition: all 2s;
}
#sr-filter-icon {
  position: absolute; top: 8px; right: 8px;
  display: flex; align-items: center; justify-content: center;
  z-index: 2; max-height: 40px; max-width: 38px; height: 100%; width: 100%;
  isolation: isolate; overflow: hidden; border-radius: 10px;
  background: linear-gradient(180deg, #161329, black, #1d1b4b);
  border: 1px solid transparent; color: #888; font-size: 18px;
}
.sr-filter-border {
  height: 42px; width: 40px; position: absolute; overflow: hidden;
  top: 7px; right: 7px; border-radius: 10px;
}
.sr-filter-border::before {
  content: ""; text-align: center;
  top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(90deg);
  position: absolute; width: 600px; height: 600px;
  background-repeat: no-repeat; background-position: 0 0; filter: brightness(1.35);
  background-image: conic-gradient(rgba(0,0,0,0), #3d3a4f, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 50%, #3d3a4f, rgba(0,0,0,0) 100%);
  animation: sr-rotate 4s linear infinite;
}
#sr-icon { position: absolute; left: 20px; top: 15px; font-size: 20px; }
@keyframes sr-rotate { 100% { transform: translate(-50%,-50%) rotate(450deg); } }

.th-wrap { --toggle-size: 30px; }
.th-switch {
  --toggle-size: 30px;
  --container-width: 5.625em;
  --container-height: 2.5em;
  --container-radius: 6.25em;
  --container-light-bg: #3D7EAE;
  --container-night-bg: #1D1F2C;
  --circle-container-diameter: 3.375em;
  --sun-moon-diameter: 2.125em;
  --sun-bg: #ECCA2F;
  --moon-bg: #C4C9D1;
  --spot-color: #959DB1;
  --circle-container-offset: calc((var(--circle-container-diameter) - var(--container-height)) / 2 * -1);
  --stars-color: #fff;
  --clouds-color: #F3FDFF;
  --back-clouds-color: #AACADF;
  --transition: .5s cubic-bezier(0, -0.02, 0.4, 1.25);
  --circle-transition: .3s cubic-bezier(0, -0.02, 0.35, 1.17);
}
.th-switch, .th-switch *, .th-switch *::before, .th-switch *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: var(--toggle-size);
}
.th-container {
  width: var(--container-width); height: var(--container-height);
  background-color: var(--container-light-bg);
  border-radius: var(--container-radius);
  overflow: hidden; cursor: pointer;
  box-shadow: 0 -0.062em 0.062em rgba(0,0,0,0.25), 0 0.062em 0.125em rgba(255,255,255,0.94);
  transition: var(--transition);
  position: relative;
}
.th-container::before {
  content: "";
  position: absolute; z-index: 1; inset: 0;
  box-shadow: 0 0.05em 0.187em rgba(0,0,0,0.25) inset, 0 0.05em 0.187em rgba(0,0,0,0.25) inset;
  border-radius: var(--container-radius);
}
.th-checkbox { display: none; }
.th-circle {
  width: var(--circle-container-diameter); height: var(--circle-container-diameter);
  background-color: rgba(255,255,255,0.1);
  position: absolute; left: var(--circle-container-offset); top: var(--circle-container-offset);
  border-radius: var(--container-radius);
  box-shadow: inset 0 0 0 3.375em rgba(255,255,255,0.1), inset 0 0 0 3.375em rgba(255,255,255,0.1), 0 0 0 0.625em rgba(255,255,255,0.1), 0 0 0 1.25em rgba(255,255,255,0.1);
  display: flex; transition: var(--circle-transition); pointer-events: none;
}
.th-sun-moon {
  pointer-events: auto; position: relative; z-index: 2;
  width: var(--sun-moon-diameter); height: var(--sun-moon-diameter);
  margin: auto; border-radius: var(--container-radius);
  background-color: var(--sun-bg);
  box-shadow: 0.062em 0.062em 0.062em 0 rgba(254,255,239,0.61) inset, 0 -0.062em 0.062em 0 #a1872a inset;
  filter: drop-shadow(0.062em 0.125em 0.125em rgba(0,0,0,0.25)) drop-shadow(0 0.062em 0.125em rgba(0,0,0,0.25));
  overflow: hidden; transition: var(--transition);
}
.th-moon {
  transform: translateX(100%); width: 100%; height: 100%;
  background-color: var(--moon-bg); border-radius: inherit;
  box-shadow: 0.062em 0.062em 0.062em 0 rgba(254,255,239,0.61) inset, 0 -0.062em 0.062em 0 #969696 inset;
  transition: var(--transition); position: relative;
}
.th-spot {
  position: absolute; top: 0.75em; left: 0.312em;
  width: 0.75em; height: 0.75em; border-radius: var(--container-radius);
  background-color: var(--spot-color); box-shadow: 0 0.0312em 0.062em rgba(0,0,0,0.25) inset;
}
.th-spot:nth-of-type(2) { width: 0.375em; height: 0.375em; top: 0.937em; left: 1.375em; }
.th-spot:nth-last-of-type(3) { width: 0.25em; height: 0.25em; top: 0.312em; left: 0.812em; }
.th-clouds {
  width: 1.25em; height: 1.25em; background-color: var(--clouds-color);
  border-radius: var(--container-radius); position: absolute;
  bottom: -0.625em; left: 0.312em;
  box-shadow: 0.937em 0.312em var(--clouds-color), -0.312em -0.312em var(--back-clouds-color), 1.437em 0.375em var(--clouds-color), 0.5em -0.125em var(--back-clouds-color), 2.187em 0 var(--clouds-color), 1.25em -0.062em var(--back-clouds-color), 2.937em 0.312em var(--clouds-color), 2em -0.312em var(--back-clouds-color), 3.625em -0.062em var(--clouds-color), 2.625em 0 var(--back-clouds-color), 4.5em -0.312em var(--clouds-color), 3.375em -0.437em var(--back-clouds-color), 4.625em -1.75em 0 0.437em var(--clouds-color), 4em -0.625em var(--back-clouds-color), 4.125em -2.125em 0 0.437em var(--back-clouds-color);
  transition: 0.5s cubic-bezier(0, -0.02, 0.4, 1.25);
}
.th-stars {
  position: absolute; color: var(--stars-color); top: -100%;
  left: 0.312em; width: 2.75em; height: auto;
  transition: var(--transition); font-size: 0.8em; letter-spacing: 2px;
}
.th-checkbox:checked + .th-container { background-color: var(--container-night-bg); }
.th-checkbox:checked + .th-container .th-circle { left: calc(100% - var(--circle-container-offset) - var(--circle-container-diameter)); }
.th-checkbox:checked + .th-container .th-circle:hover { left: calc(100% - var(--circle-container-offset) - var(--circle-container-diameter) - 0.187em); }
.th-circle:hover { left: calc(var(--circle-container-offset) + 0.187em); }
.th-checkbox:checked + .th-container .th-moon { transform: translate(0); }
.th-checkbox:checked + .th-container .th-clouds { bottom: -4.062em; }
.th-checkbox:checked + .th-container .th-stars { top: 50%; transform: translateY(-50%); }

.rb-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  width: auto;
  margin: 2rem;
  font-family: "Poppins", sans-serif;
  font-size: 1.6em;
  font-weight: 600;
  user-select: none;
  color: #fff;
}
.rb-loader {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  background-color: transparent;
  mask: repeating-linear-gradient(90deg, transparent 0, transparent 6px, black 7px, black 8px);
}
.rb-loader::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle at 50% 50%, #ff0 0%, transparent 50%), radial-gradient(circle at 45% 45%, #f00 0%, transparent 45%), radial-gradient(circle at 55% 55%, #0ff 0%, transparent 45%), radial-gradient(circle at 45% 55%, #0f0 0%, transparent 45%), radial-gradient(circle at 55% 45%, #00f 0%, transparent 45%);
  mask: radial-gradient(circle at 50% 50%, transparent 0%, transparent 10%, black 25%);
  animation: rb-transform 2s infinite alternate, rb-opacity 4s infinite;
  animation-timing-function: cubic-bezier(0.6, 0.8, 0.5, 1);
}
.rb-letter {
  display: inline-block;
  opacity: 0;
  animation: rb-letter-anim 4s infinite linear;
  z-index: 2;
}
.rb-letter:nth-child(2) { animation-delay: 0.1s; }
.rb-letter:nth-child(3) { animation-delay: 0.205s; }
.rb-letter:nth-child(4) { animation-delay: 0.31s; }
.rb-letter:nth-child(5) { animation-delay: 0.415s; }
.rb-letter:nth-child(6) { animation-delay: 0.521s; }
.rb-letter:nth-child(7) { animation-delay: 0.626s; }
@keyframes rb-transform { 0% { transform: translate(-55%); } 100% { transform: translate(55%); } }
@keyframes rb-opacity { 0%, 100% { opacity: 0; } 15% { opacity: 1; } 65% { opacity: 0; } }
@keyframes rb-letter-anim { 0% { opacity: 0; } 5% { opacity: 1; text-shadow: 0 0 4px #fff; transform: scale(1.1) translateY(-2px); } 20% { opacity: 0.2; } 100% { opacity: 0; } }

.au-wrap { position: relative; width: 100%; height: 250px; border-radius: 12px; overflow: hidden; }
.au-container {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(ellipse at 20% 30%, rgba(138,43,226,0.8) 0%, rgba(138,43,226,0) 60%), radial-gradient(ellipse at 80% 50%, rgba(0,191,255,0.7) 0%, rgba(0,191,255,0) 70%), radial-gradient(ellipse at 50% 80%, rgba(50,205,50,0.6) 0%, rgba(50,205,50,0) 65%), linear-gradient(135deg, #000 0%, #0a0520 100%);
  background-blend-mode: overlay, screen, hard-light;
  overflow: hidden;
  animation: au-drift 25s infinite alternate ease-in-out;
}
.au-container::before {
  content: "";
  position: absolute; width: 200%; height: 200%; top: -50%; left: -50%;
  background: repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 60px);
  animation: au-grid 20s linear infinite;
}
.au-container::after {
  content: "";
  position: absolute; width: 100%; height: 100%;
  background: radial-gradient(circle at center, transparent 70%, rgba(10,5,32,0.9) 100%);
  animation: au-pulse 8s infinite alternate;
}
@keyframes au-drift {
  0% { background-position: 0% 0%, 0% 0%, 0% 0%; filter: hue-rotate(0deg) brightness(1); }
  50% { background-position: -10% -5%, 5% 10%, 0% 15%; filter: hue-rotate(30deg) brightness(1.2); }
  100% { background-position: 5% 10%, -10% -5%, 15% 0%; filter: hue-rotate(60deg) brightness(1); }
}
@keyframes au-grid { 0% { transform: translate(0,0); } 100% { transform: translate(-50%,-50%); } }
@keyframes au-pulse { 0% { opacity: 0.8; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.05); } 100% { opacity: 0.8; transform: scale(1); } }
</style>