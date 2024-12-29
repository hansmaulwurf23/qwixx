import './assets/main.css'
import './assets/board.scss'

import { createApp } from 'vue'
import SvgIcon from "vue3-icon";

import App from './App.vue'
const app = createApp(App);
app.component("svg-icon", SvgIcon);
app.mount("#app");
