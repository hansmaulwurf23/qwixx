<script>
import { mdiLock, mdiLockOpen } from '@mdi/js';

export default {
  data() {
    return {
      numbers: [
        new Array(11).fill(false),
        new Array(11).fill(false),
        new Array(11).fill(false),
        new Array(11).fill(false)
      ],
      locks: new Array(4).fill(false),
      fails: 0,
      colors: [
        'danger', 'warning', 'success', 'primary'
      ],
      pointsMap: [0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78],
      mdiLock, mdiLockOpen
    }
  },
  // TODO:
  // - error handling
  // - points are basically n(n+1)/2
  methods: {
    markNumber(color, number) {
      let nos = this.numbers[color];
      let right = nos.slice(number);
      if (right.some((x) => x === true)) {
        return alert('Es wurde bereits weiter rechts markiert!');
      }

      nos[number] = true;
    },
    markLock(color) {
      if (this.locks[color]) {
        return alert('Diese Farbe wurde bereits gelockt!');
      }
      if (this.getColorNumbers(color) < 5) {
        return alert('Es sind nicht mindestens 5 Zahlen eingelockt!');
      }
      if (!this.numbers[color].at(-1)) {
        return alert('Der letzte Kasten muss angekreuzt sein!');
      }
      if (this.locks.filter((l) => l === true).length === 2) {
        return alert('Es sind bereits zwei Reihen gelockt!');
      }
      this.locks[color] = true;
    },
    markFail() {
      if (this.fails === 4) {
        return alert('Es sind nur 4 Fehlversuche erlaubt!');
      }
      this.fails += 1;
    },
    getColorNumbers(color) {
      return this.numbers[color].filter(x => x === true).length;
    },
    getColorScore(color) {
      return this.pointsMap[this.getColorNumbers(color) + (this.locks[color] ? 1 : 0)];
    },
    getFailPoints() {
      return this.fails * 5;
    },
    getScore() {
      let score = -this.getFailPoints();
      for (let i = 0; i < this.numbers.length; i++) {
        score += this.getColorScore(i);
      }
      return score;
    },
    getBgColor(idx) {
      return 'bg-' + this.colors[idx];
    },
    getBorderColor(idx) {
      return 'border-' + this.colors[idx];
    },
  }
}
</script>

<template>
  <div v-for="(col, cidx) in numbers" class="p-1 m-1 panelrow numrow" :class="getBgColor(cidx)">
    <button @click="markNumber(cidx, i)"
            v-for="(v, i) in numbers[cidx]"
            :class="v ? 'btn-secondary' : 'btn-light'"
            class="btn numbtn m-1">{{ cidx < 2 ? i + 2 : 12 - i }}
    </button>
    <button @click="markLock(cidx)"
            :class="locks[cidx] ? 'btn-secondary' : 'btn-light'"
            class="btn numbtn m-1 rounded-circle">
      <svg-icon type="mdi" :path="locks[cidx] ? mdiLock : mdiLockOpen"></svg-icon>
    </button>
  </div>
  <div class="panelrow">
    <div class="rounded-2 border border-light legend ms-2">
      Kreuze
      <hr/>
      Punkte
    </div>
    <template v-for="(v, i) in pointsMap">
      <div class="rounded-2 border border-secondary legend" v-if="i > 0">
        {{ i }}
        <hr/>
        {{ v }}
      </div>
    </template>
    <button v-for="(v, i) in 4"
            @click="markFail()"
            :class="fails >= v ? 'btn-secondary': 'btn-light'"
            class="btn btn-outline-secondary numbtn m-1">&nbsp;
    </button>
  </div>
  <div class="p-1 m-1 panelrow scorerow">
    Ergebnis:
    <template v-for="(col, cidx) in numbers">
      <div class="mx-2 rounded-2 numbtn bg-light border border-2 align-middle" :class="getBorderColor(cidx)"><p>
        {{ getColorScore(cidx) }}</p></div>
      {{ cidx < 3 ? '+' : '-' }}
    </template>
    <div class="mx-2 rounded-2 numbtn bg-light border border-2 border-secondary"><p>{{ getFailPoints() }}</p></div>
    =
    <div class="mx-2 rounded-2 numbtn bg-light border border-2 border-secondary"><p>{{ getScore() }}</p></div>
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
  min-width: 2.2rem;
  text-align: center;
}

.numbtn {
  width: 3rem;
  height: 3rem;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
}

.scorerow {
  background-color: var(--bs-gray-300);
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
