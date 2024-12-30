<script setup>
import {mdiLock, mdiLockOpen} from '@mdi/js';
import {useBoardStore} from "@/main.js";

const store = useBoardStore();
</script>

<template>
  <div id="boardContainer">
    <div v-for="(colNumbers, cidx) in store.numbers" class="p-1 m-1 panelrow" :class="['bg-' + store.colors[cidx]]">
      <button @click="store.markNumber(cidx, i)"
              v-for="(v, i) in colNumbers"
              :class="[v ? 'btn-secondary' : 'btn-light', 'text-' + store.colors[cidx]]"
              class="squarebtn m-1">{{ cidx < 2 ? i + 2 : 12 - i }}
      </button>
      <button @click="store.markLock(cidx)"
              :class="[store.locks[cidx] ? 'btn-secondary' : 'btn-light', 'text-' + store.colors[cidx]]"
              class="squarebtn m-1 rounded-circle">
        <svg-icon type="mdi" :path="store.locks[cidx] ? mdiLock : mdiLockOpen"></svg-icon>
      </button>
    </div>
    <div class="panelrow">
      <div class="rounded-2 border border-light legend ms-2">
        Kreuze
        <hr/>
        Punkte
      </div>
      <template v-for="(v, i) in store.pointsMap">
        <div class="rounded-2 border border-secondary legend" v-if="i > 0">
          {{ i }}
          <hr/>
          {{ v }}
        </div>
      </template>
      <button v-for="v in 4"
              @click="store.markFail()"
              :class="store.fails >= v ? 'btn-secondary': 'btn-light'"
              class="btn-outline-secondary squarebtn m-1">&nbsp;
      </button>
    </div>
    <div class="p-1 m-1 panelrow scorerow">
      Ergebnis
      <template v-for="(color, cidx) in store.colors">
        <div class="mx-2 rounded-2 squarebtn bg-light border border-2 align-middle" :class="['border-' + color]"><p>
          {{ store.getColorScore(cidx) }}</p></div>
        {{ cidx < 3 ? '+' : '-' }}
      </template>
      <div class="mx-2 rounded-2 squarebtn bg-light border border-2 border-secondary"><p>{{ store.getFailPoints() }}</p></div>
      =
      <div class="mx-2 rounded-2 squarebtn bg-light border border-2 border-secondary"><p>{{ store.getScore() }}</p></div>
    </div>
  </div>
</template>

<style scoped>
hr {
  margin: 0;
  padding: 0;
}

.panelrow {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.legend {
  margin: 1px;
  padding-left: 2px;
  padding-right: 2px;
  min-width: 1.9rem;
  text-align: center;
}

.scorerow {
  background-color: #dee2e6;
}

.scorerow div {
  display: table;
}

.scorerow div p {
  vertical-align: middle;
  display: table-cell;
  text-align: center;
}
</style>
