<template>
  <svg width="100%" height="120" viewBox="0 0 360 120" role="img" aria-label="Grafik tahapan (dummy)">
    <line x1="28" y1="96" x2="340" y2="96" stroke="#e5e7eb" stroke-width="2"/>
    <g v-for="(p,i) in points" :key="i">
      <circle :cx="p.x" :cy="p.y" r="6" fill="#16a34a"/>
      <text :x="p.x" y="112" text-anchor="middle" font-size="10" font-weight="800" fill="#6b7280">{{ p.label }}</text>
    </g>
  </svg>
</template>

<script setup>
const points = [
  { x: 60,  y: 82, label: 'Bibit' },
  { x: 130, y: 70, label: 'Inkubasi' },
  { x: 200, y: 58, label: 'Miselium' },
  { x: 270, y: 44, label: 'Tumbuh' },
  { x: 330, y: 34, label: 'Panen' }
]
</script>
