import './assets/main.scss'

import {createApp, ref} from 'vue'
import {createPinia, defineStore} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import SvgIcon from "vue3-icon"
import App from './App.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
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
  const otherLocks = ref(new Array(4).fill(false))
  const fails = ref(0)
  const colors = ref(['danger', 'warning', 'success', 'primary'])
  const pointsMap = ref([0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78])
  const undoStack = ref([])

  const currentError = ref("")

  function newGame() {
    for (let i = 0; i < this.numbers.length; i++) {
      for (let j = 0; j <  this.numbers[i].length; j++) {
        this.numbers[i][j] = false;
      }
    }

    this.fails = 0;
    this.undoStack.length = 0;
    for(let i = 0; i < this.locks.length; i++) {
      this.locks[i] = false;
      this.otherLocks[i] = false;
    }
  }

  function markNumber(color, number) {
    if (this.locks[color]) {
      return this.setError('Die Farbe ist bereits gelockt!');
    }
    let numbers = this.numbers[color];
    if (numbers.slice(number).some((x) => x === true)) {
      return this.setError('Es wurde bereits weiter rechts markiert!');
    }

    this.undoStack.push(['number', color, number]);
    numbers[number] = true;
  }

  function markLock(color) {
    if (this.locks[color]) {
      return this.setError('Diese Farbe wurde bereits gelockt!');
    }
    if (this.countColorMarks(color) < 5) {
      return this.setError('Es sind nicht mindestens 5 Zahlen eingelockt!');
    }
    if (!this.numbers[color].at(-1)) {
      return this.setError('Der letzte Kasten muss angekreuzt sein!');
    }
    if (this.isFinished()) {
      return this.setError('Es sind bereits zwei Reihen gelockt!');
    }

    this.undoStack.push(['lock', color, undefined]);
    this.locks[color] = true;
  }

  function markLockGlobally(color) {
    this.locks[color] = true;
    this.otherLocks[color] = true;
    this.undoStack.push(['globalLock', color, undefined]);
  }

  function markFail() {
    if (this.fails === 4) {
      return this.setError('Es sind nur 4 Fehlversuche erlaubt!');
    }
    this.fails += 1;
    this.undoStack.push(['fail', undefined, undefined]);
  }

  function countColorMarks(color) {
    return this.numbers[color].filter(x => x === true).length;
  }

  function getColorScore(color) {
    return this.pointsMap[this.countColorMarks(color) + (this.locks[color] && !this.otherLocks[color] ? 1 : 0)];
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

  function isFinished() {
    return this.locks.filter((l) => l === true).length === 2
  }

  function undo() {
    if (this.undoStack.length > 0) {
      let [action, arg1, arg2] = this.undoStack.pop();
      if (action === 'fail') {
        this.fails -= 1;
      } else if (action === 'globalLock') {
        this.locks[arg1] = false;
        this.otherLocks[arg1] = false;
      } else if (action === 'lock') {
        this.locks[arg1] = false;
      } else if (action === 'number') {
        this.numbers[arg1][arg2] = false;
      }
    }
  }

  function setError(msg) {
    this.currentError = msg;
  }

  function unsetError() {
    this.currentError = undefined;
  }

  return {
    numbers,
    locks,
    otherLocks,
    fails,
    colors,
    pointsMap,
    undoStack,
    currentError,
    newGame,
    markNumber,
    markLock,
    markLockGlobally,
    markFail,
    countColorMarks,
    getColorScore,
    getFailPoints,
    getScore,
    isFinished,
    undo,
    setError,
    unsetError
  }
},{
    persist: true,
})


app.mount("#app");
