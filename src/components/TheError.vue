<script setup>
import {useBoardStore} from "@/main.js";
const store = useBoardStore()
</script>

<template>
  <div id="myErrorAlert" @click="store.unsetError()" class="w-50 m-auto mt-4 show"
       :class="{'show': store.currentError, 'disnone': !store.currentError}" role="alert">
    <strong>Fehler:</strong>&nbsp;{{ store.currentError }}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
</template>

<style scoped>
.disnone {
  display: none;
}
</style>
