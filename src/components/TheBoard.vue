<script setup>
import {mdiLock, mdiLockOpen} from '@mdi/js';
import {useBoardStore} from "@/main.js";
import ThePointsLegend from "@/components/ThePointsLegend.vue";

const store = useBoardStore();
</script>

<template>
  <div id="boardContainer">
    <div v-for="(colNumbers, cidx) in store.numbers" class="p-1 m-1 panelrow" :class="['bg-' + store.colors[cidx]]">
      <div class="panelrow rounded-2" :class="['bg-' + store.colors[cidx] + '-subtle']">
        <button @click="store.markNumber(cidx, i)"
                v-for="(v, i) in colNumbers.value"
                :disabled="store.isFinished()"
                :class="[v ? 'btn-secondary' : 'btn-light', v ? 'text-white' : 'text-' + store.colors[cidx], i > 0 ? 'ms-0': 'ms-1']"
                class="squarebtn m-1">{{ cidx < 2 ? i + 2 : 12 - i }}
        </button>
      </div>
      <span style="width: 15px; height: 5px;" :class="['bg-' + store.colors[cidx] + '-subtle']"></span>
      <div class="panelrow rounded-circle" :class="['bg-' + store.colors[cidx] + '-subtle']">
        <button @click="store.markLock(cidx)"
                :class="[store.locks[cidx] ? 'btn-secondary' : 'btn-light', store.locks[cidx] ? 'text-white' : 'text-' + store.colors[cidx]]"
                :disabled="store.isFinished()"
                class="squarebtn m-1 rounded-circle">
          <svg-icon type="mdi" :path="store.locks[cidx] ? mdiLock : mdiLockOpen"></svg-icon>
        </button>
      </div>
    </div>
    <div class="panelrow">
      <ThePointsLegend/>
      <button v-for="v in 4"
              @click="store.markFail()"
              :disabled="store.isFinished()"
              :class="store.fails >= v ? 'btn-secondary': 'btn-light'"
              class="btn-outline-secondary squarebtn m-1">&nbsp;
      </button>
    </div>
    <div class="p-1 m-1 panelrow scorerow">
      Ergebnis
      <template v-for="(color, cidx) in store.colors">
        <div class="scorediv" :class="['border-' + color]"><p>
          {{ store.getColorScore(cidx) }}</p></div>
        {{ cidx < 3 ? '+' : '-' }}
      </template>
      <div class="scorediv border-secondary"><p>{{ store.getFailPoints() }}</p>
      </div>
      =
      <div class="scorediv border-secondary"><p>{{ store.getScore() }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panelrow {
  display: flex;
  flex-direction: row;
  align-items: center;
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
