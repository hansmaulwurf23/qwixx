<script setup>
import {useBoardStore} from "@/main.js";

const store = useBoardStore();
</script>

<template>
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
</template>

<style scoped>
hr {
  margin: 0;
  padding: 0;
}

.legend {
  margin: 1px;
  padding-left: 2px;
  padding-right: 2px;
  min-width: 1.9rem;
  text-align: center;
}
</style>
