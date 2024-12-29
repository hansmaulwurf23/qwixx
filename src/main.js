import './assets/main.scss'

import {createApp, ref} from 'vue'
import {createPinia, defineStore} from 'pinia'
import SvgIcon from "vue3-icon"
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App);
app.component("svg-icon", SvgIcon);
app.use(pinia);

export const useBoardStore = defineStore("boardStore", () => {
  const numbers = ref([
    new Array(11).fill(false),
    new Array(11).fill(false),
    new Array(11).fill(false),
    new Array(11).fill(false)
  ]);

  const locks = ref(new Array(4).fill(false))
  const fails = ref(0)
  const colors = ref(['danger', 'warning', 'success', 'primary'])
  const pointsMap = ref([0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78])

  function markNumber(color, number) {
    if (this.locks[color]) {
      return alert('Die Farbe ist bereits gelockt!');
    }
    let numbers = this.numbers[color];
    if (numbers.slice(number).some((x) => x === true)) {
      return alert('Es wurde bereits weiter rechts markiert!');
    }

    numbers[number] = true;
  }

  function markLock(color) {
    if (this.locks[color]) {
      return alert('Diese Farbe wurde bereits gelockt!');
    }
    if (this.countColorMarks(color) < 5) {
      return alert('Es sind nicht mindestens 5 Zahlen eingelockt!');
    }
    if (!this.numbers[color].at(-1)) {
      return alert('Der letzte Kasten muss angekreuzt sein!');
    }
    if (this.locks.filter((l) => l === true).length === 2) {
      return alert('Es sind bereits zwei Reihen gelockt!');
    }
    this.locks[color] = true;
  }

  function markLockGlobally(color) {
    this.locks[color] = true;
  }

  function markFail() {
    if (this.fails === 4) {
      return alert('Es sind nur 4 Fehlversuche erlaubt!');
    }
    this.fails += 1;
  }

  function countColorMarks(color) {
    return this.numbers[color].filter(x => x === true).length;
  }

  function getColorScore(color) {
    return this.pointsMap[this.countColorMarks(color) + (this.locks[color] ? 1 : 0)];
  }

  function getFailPoints() {
    return this.fails * 5;
  }

  function getScore() {
    let score = -this.getFailPoints();
    for (let i = 0; i < this.numbers.length; i++) {
      score += this.getColorScore(i);
    }
    return score;
  }

  return {
    numbers,
    locks,
    fails,
    colors,
    pointsMap,
    markNumber,
    markLock,
    markLockGlobally,
    markFail,
    countColorMarks,
    getColorScore,
    getFailPoints,
    getScore
  };
})


app.mount("#app");
