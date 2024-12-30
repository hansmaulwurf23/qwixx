<script setup>
import TheBoard from './components/TheBoard.vue'
import TheControls from "@/components/TheControls.vue"
import TheError from "@/components/TheError.vue";
</script>

<template>
  <header>
  </header>

  <main>
    <TheError/>
    <TheBoard/>
    <TheControls/>
  </main>
</template>
