<template>
  <Transition appear name="fade">
    <div
      :style="{
        '--cell': `${width / cols}px`,
        '--rows': rows - 1
      }"
    >
      <div
        ref="el"
        class="absolute inset-0 grid justify-center auto-rows-[var(--cell)] -space-y-px"
      >
        <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="grid grid-flow-col auto-cols-[--cell] flex-1 -space-x-px">
          <div v-for="(cell, cellIndex) in row" :key="cellIndex" class="transition-[background] duration-1000 border border-primary-200/50 dark:border-primary-900/25 bg-opacity-10 hover:bg-opacity-20 dark:bg-opacity-5 dark:hover:bg-opacity-10" :class="[cell && `bg-primary-500 dark:bg-primary-400 cursor-pointer`]" @click="removeCell(rowIndex, cellIndex)" />
        </div>

        <div class="absolute top-[calc((var(--cell)*var(--rows))+1px)] inset-x-0 h-[calc(var(--cell)*2)] bg-gradient-to-t from-white dark:from-gray-900" />
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useElementSize } from '@vueuse/core'

const el = ref(null)
const grid = ref([])
const rows = ref(0)
const cols = ref(0)

const colors = useAppConfig()?.ui.colors
const { width, height } = useElementSize(el)

function getRandomColor () {
  return colors[Math.floor(Math.random() * (colors.length - 1))]
}

function createGrid () {
  grid.value = []

  for (let i = 0; i <= rows.value; i++) {
    grid.value.push(new Array(cols.value).fill(null))
  }
}

function createNewCell () {
  const color = getRandomColor()
  const x = Math.floor(Math.random() * cols.value)

  grid.value[0][x] = color
}

function moveCellsDown () {
  for (let row = rows.value - 1; row >= 0; row--) {
    for (let col = 0; col < cols.value; col++) {
      if (grid.value[row][col] !== null && grid.value[row + 1][col] === null) {
        grid.value[row + 1][col] = grid.value[row][col]
        grid.value[row][col] = null
      }
    }
  }

  setTimeout(() => {
    if (grid.value[rows.value].every(cell => cell !== null)) {
      for (let col = 0; col < cols.value; col++) {
        grid.value[rows.value][col] = null
      }
    }
  }, 500)
}

function removeCell (row, col) {
  grid.value[row][col] = null
}

function calcGrid () {
  const base = Math.ceil(width.value / 60)
  const cell = width.value / base

  rows.value = Math.ceil(height.value / cell)
  cols.value = width.value / cell

  createGrid()
}

watch(width, calcGrid)

onMounted(() => {
  setTimeout(calcGrid, 50)

  setInterval(() => {
    moveCellsDown()
    createNewCell()
  }, 1000)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
