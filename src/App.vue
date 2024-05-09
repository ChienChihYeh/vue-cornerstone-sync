<script setup lang="ts">
import SyncViewers from "./components/SyncViewers.vue";
import { initCornerstone } from "./utils/initCornerstone";
import { ref } from "vue";
import { initToolGroup } from "./utils/initToolGroup";
const isInit = ref(false);

initCornerstone().then(() => {
  initToolGroup();
  isInit.value = true;
});
</script>

<template>
  <main>
    <h1>Vue Cornerstone Stack Synchronizers</h1>
    <SyncViewers v-if="isInit" />
    <p>
      Mouse Wheel: Scroll | Left Mouse Button: Pan | Right Mouse Button: Zoom
    </p>
  </main>
</template>

<style scoped></style>
