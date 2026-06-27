<template>
  <div class="ls-overlay">
    <div class="wrapper-grid">
      <div v-for="(ch, i) in 'STELLARA'.split('')" :key="i" class="cube">
        <span class="face face-front">{{ ch }}</span>
        <span class="face face-back"></span>
        <span class="face face-left"></span>
        <span class="face face-right"></span>
        <span class="face face-top"></span>
        <span class="face face-bottom"></span>
      </div>
    </div>
    <p class="ls-subtitle">loading...</p>
  </div>
</template>

<style>
.ls-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  background: color-mix(in srgb, var(--color-background, #0a0a0f) 92%, transparent);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.ls-subtitle {
  font-size: .75rem;
  letter-spacing: .3em;
  text-transform: uppercase;
  color: var(--color-muted, #888);
  animation: ls-pulse 2s ease-in-out infinite;
}

@keyframes ls-pulse {
  0%, 100% { opacity: .3; }
  50% { opacity: .8; }
}

.wrapper-grid {
  --animation-duration: 2.1s;
  --cube-color: #0000;
  --highlight-color: var(--color-accent, #00cc44);
  --cube-width: 48px;
  --cube-height: 48px;
  --font-size: 1.6em;

  position: relative;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(8, var(--cube-width));
  grid-template-rows: auto;
  grid-gap: 0;
  width: calc(8 * var(--cube-width));
  height: var(--cube-height);
  perspective: 350px;
  font-family: "Poppins", sans-serif;
  font-size: var(--font-size);
  font-weight: 800;
  color: transparent;
}

.cube {
  position: relative;
  transform-style: preserve-3d;
  animation: translate-z var(--animation-duration) ease-in-out infinite;
}

.face {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--cube-width);
  height: var(--cube-height);
  background-color: var(--cube-color);
  color: transparent;
  animation:
    face-color var(--animation-duration) ease-in-out infinite,
    edge-glow var(--animation-duration) ease-in-out infinite;
  animation-delay: inherit;
}

.face.face-front {
  animation:
    face-color var(--animation-duration) ease-in-out infinite,
    face-glow var(--animation-duration) ease-in-out infinite,
    edge-glow var(--animation-duration) ease-in-out infinite;
  animation-delay: inherit;
}

.face-left,
.face-right,
.face-back,
.face-front {
  box-shadow:
    inset 0 0 2px 1px #0001,
    inset 0 0 12px 1px #fff1;
}

.face-front   { transform: rotateY(0deg)    translateZ(calc(var(--cube-width) / 2)); }
.face-back    { transform: rotateY(180deg)   translateZ(calc(var(--cube-width) / 2)); opacity: 0.6; }
.face-left    { transform: rotateY(-90deg)   translateZ(calc(var(--cube-width) / 2)); opacity: 0.6; }
.face-right   { transform: rotateY(90deg)    translateZ(calc(var(--cube-width) / 2)); opacity: 0.6; }
.face-top     { height: var(--cube-width);   transform: rotateX(90deg)  translateZ(calc(var(--cube-width) / 2)); opacity: 0.8; }
.face-bottom  { height: var(--cube-width);   transform: rotateX(-90deg) translateZ(calc(var(--cube-height) - var(--cube-width) * 0.5)); opacity: 0.8; }

.cube:nth-child(1) { z-index: 0; animation-delay: 0s; }
.cube:nth-child(2) { z-index: 1; animation-delay: 0.2s; }
.cube:nth-child(3) { z-index: 2; animation-delay: 0.4s; }
.cube:nth-child(4) { z-index: 3; animation-delay: 0.6s; }
.cube:nth-child(5) { z-index: 3; animation-delay: 0.8s; }
.cube:nth-child(6) { z-index: 2; animation-delay: 1.0s; }
.cube:nth-child(7) { z-index: 1; animation-delay: 1.2s; }
.cube:nth-child(8) { z-index: 0; animation-delay: 1.4s; }

@keyframes translate-z {
  0%, 40%, 100% { transform: translateZ(-2px); }
  30% { transform: translateZ(16px) translateY(-1px); }
}

@keyframes face-color {
  0%, 50%, 100% { background-color: var(--cube-color); }
  10% { background-color: var(--highlight-color); }
}

@keyframes face-glow {
  0%, 50%, 100% { color: #fff0; filter: none; }
  30% { color: #fff; filter: drop-shadow(0 14px 10px var(--highlight-color)); }
}

@keyframes edge-glow {
  0%, 40%, 100% {
    box-shadow: inset 0 0 2px 1px #0001, inset 0 0 12px 1px #fff1;
  }
  30% {
    box-shadow: 0 0 2px 0px var(--highlight-color);
  }
}

@media (max-width: 640px) {
  .wrapper-grid {
    --cube-width: 32px;
    --cube-height: 32px;
    --font-size: 1.1em;
  }
}
</style>
