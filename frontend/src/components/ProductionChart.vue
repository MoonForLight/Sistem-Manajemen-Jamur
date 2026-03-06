<template>
  <svg width="100%" height="170" viewBox="0 0 720 170" role="img" aria-label="Grafik produksi mingguan">
    <!-- grid -->
    <g stroke="#eef2f7" stroke-width="2">
      <line v-for="y in [30,60,90,120,150]" :key="y" x1="14" :y1="y" x2="706" :y2="y" />
    </g>

    <!-- area fill -->
    <path :d="areaPath" fill="#22c55e" fill-opacity="0.18" />
    <!-- line -->
    <path :d="linePath" fill="none" stroke="#16a34a" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" />

    <!-- points -->
    <g>
      <circle v-for="(p,i) in pts" :key="i" :cx="p.x" :cy="p.y" r="6" fill="#16a34a" />
    </g>

    <!-- labels -->
    <g font-size="12" font-weight="800" fill="#6b7280">
      <text v-for="(d,i) in days" :key="d" :x="pts[i].x" y="166" text-anchor="middle">{{ d }}</text>
    </g>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  values: { type: Array, required: true }
})

const days = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu']

const pts = computed(() => {
  const v = props.values.map((n) => Number(n) || 0)
  const max = Math.max(...v, 1)
  const min = 0
  const left = 40
  const right = 700
  const top = 26
  const bottom = 150
  const step = (right - left) / (v.length - 1)
  return v.map((val, i) => {
    const t = (val - min) / (max - min)
    const y = bottom - t * (bottom - top)
    return { x: left + i * step, y }
  })
})

const linePath = computed(() => {
  const p = pts.value
  return p.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ')
})

const areaPath = computed(() => {
  const p = pts.value
  const start = `M ${p[0].x.toFixed(1)} 150`
  const line = p.map((pt) => `L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ')
  const end = `L ${p[p.length - 1].x.toFixed(1)} 150 Z`
  return `${start} ${line} ${end}`
})
</script>
