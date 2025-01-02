<script setup>
import {mdiRestart, mdiUndo, mdiAccountLock} from '@mdi/js'
import {useBoardStore} from "@/main.js";

const store = useBoardStore()
</script>

<template>
  <div class="controlsContainer">
    <button class="squarebtn btn-secondary m-1" @click="store.newGame()">
      <svg-icon type="mdi" :path="mdiRestart"></svg-icon>
    </button>
    <button class="squarebtn btn-secondary m-1" @click="store.undo()">
      <svg-icon type="mdi" :path="mdiUndo"></svg-icon>
    </button>
    <button class="squarebtn m-1" v-for="(c, i) in store.colors" :class="['bg-' + c, 'text-white']"
    @click="store.markLockGlobally(i)" :disabled="store.isFinished()">
      <svg-icon type="mdi" :path="mdiAccountLock"></svg-icon>
    </button>
  </div>
</template>

<style scoped>
.controlsContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
