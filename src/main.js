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

export const useBoardStore = defineStore("qwixxBoardStore", () => {
  const numbers = [
    ref(new Array(11).fill(false)),
    ref(new Array(11).fill(false)),
    ref(new Array(11).fill(false)),
    ref(new Array(11).fill(false))
  ];

  const locks = ref(new Array(4).fill(false))
  const otherLocks = ref(new Array(4).fill(false))
  const fails = ref(0)
  const colors = ref(['danger', 'warning', 'success', 'primary'])
  const pointsMap = ref([0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78])
  const undoStack = ref([])

  const currentError = ref("")

  function newGame() {
    for (let i = 0; i < numbers.length; i++) {
      for (let j = 0; j <  numbers[i].value.length; j++) {
        numbers[i].value[j] = false;
      }
    }

    fails.value = 0;
    undoStack.value.length = 0;
    for(let i = 0; i < locks.value.length; i++) {
      locks.value[i] = false;
      otherLocks.value[i] = false;
    }
  }

  function markNumber(color, number) {
    if (locks.value[color]) {
      return setError('Die Farbe ist bereits gelockt!');
    }
    if (numbers[color].value.slice(number).some((x) => x === true)) {
      return setError('Es wurde bereits weiter rechts markiert!');
    }

    undoStack.value.push(['number', color, number]);
    numbers[color].value[number] = true;
  }

  function markLock(color) {
    if (locks.value[color]) {
      return setError('Diese Farbe wurde bereits gelockt!');
    }
    if (countColorMarks(color) < 5) {
      return setError('Es sind nicht mindestens 5 Zahlen eingelockt!');
    }
    if (!numbers[color].value.at(-1)) {
      return setError('Der letzte Kasten muss angekreuzt sein!');
    }
    if (isFinished()) {
      return setError('Es sind bereits zwei Reihen gelockt!');
    }

    undoStack.value.push(['lock', color, undefined]);
    locks.value[color] = true;
  }

  function markLockGlobally(color) {
    locks.value[color] = true;
    otherLocks.value[color] = true;
    undoStack.value.push(['globalLock', color, undefined]);
  }

  function markFail() {
    if (fails.value === 4) {
      return setError('Es sind nur 4 Fehlversuche erlaubt!');
    }
    fails.value += 1;
    undoStack.value.push(['fail', undefined, undefined]);
  }

  function countColorMarks(color) {
    return numbers[color].value.filter(x => x === true).length;
  }

  function getColorScore(color) {
    return pointsMap.value[countColorMarks(color) + (locks.value[color] && !otherLocks.value[color] ? 1 : 0)];
  }

  function getFailPoints() {
    return fails.value * 5;
  }

  function getScore() {
    let score = -getFailPoints();
    for (let i = 0; i < numbers.length; i++) {
      score += getColorScore(i);
    }
    return score;
  }

  function isFinished() {
    return locks.value.filter((l) => l === true).length === 2
  }

  function undo() {
    if (undoStack.value.length > 0) {
      let [action, arg1, arg2] = undoStack.value.pop();
      if (action === 'fail') {
        fails.value -= 1;
      } else if (action === 'globalLock') {
        locks.value[arg1] = false;
        otherLocks.value[arg1] = false;
      } else if (action === 'lock') {
        locks.value[arg1] = false;
      } else if (action === 'number') {
        numbers[arg1].value[arg2] = false;
      }
    }
  }

  function setError(msg) {
    currentError.value = msg;
  }

  function unsetError() {
    currentError.value = undefined;
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
