<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";
import { Ref } from "vue/dist/vue.js";
import {
  renderingEngineId,
  viewportIds,
  toolGroupId,
  imageSliceSync,
  imageCameraSync,
} from "../constants/cornerstoneIds";
import { dicomImageIds } from "../utils/dicomImagePath";
import * as cornerstone from "@cornerstonejs/core";
import * as cornerstoneTools from "@cornerstonejs/tools";
import type { IStackViewport } from "@cornerstonejs/core/dist/types/types";

const element1 = ref();
const element2 = ref();
const viewport1 = ref();
const viewport2 = ref();
const viewportIndex1 = ref(0);
const viewportIndex2 = ref(0);

const renderingEngine = cornerstone.getRenderingEngine(renderingEngineId);
const toolGroup = cornerstoneTools.ToolGroupManager.getToolGroup(toolGroupId);
const { SynchronizerManager } = cornerstoneTools;
const synchronizer = SynchronizerManager.getSynchronizer(imageSliceSync);
const cameraSynchronizer = SynchronizerManager.getSynchronizer(imageCameraSync);

function enableElement(
  viewportId: string,
  element: HTMLDivElement,
  viewport: Ref<cornerstone.Types.IStackViewport | undefined>
) {
  renderingEngine?.enableElement({
    viewportId: viewportId,
    element: element,
    type: cornerstone.Enums.ViewportType.STACK,
    defaultOptions: {
      displayArea: { imageArea: [1, 1] },
    },
  });
  viewport.value = renderingEngine?.getViewport(viewportId) as IStackViewport;
}

function handleWheel(event: WheelEvent, viewport: IStackViewport) {
  event.preventDefault();
  const index = viewport.getCurrentImageIdIndex();
  const direction = event.deltaY < 0 ? -1 : 1;
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= viewport.getImageIds().length) return;
  viewport.setImageIdIndex(newIndex);
}

function handleReset(viewport: IStackViewport) {
  viewport.setImageIdIndex(0);
}

watchEffect(() => {
  if (dicomImageIds.length > 0 && viewport1.value) {
    initViewportRender(dicomImageIds, viewport1.value).then(() => {
      toolGroup?.addViewport(viewportIds[0]);
      if (synchronizer)
        synchronizer.add({ renderingEngineId, viewportId: viewportIds[0] });
      if (cameraSynchronizer)
        cameraSynchronizer.add({
          renderingEngineId,
          viewportId: viewportIds[0],
        });
    });
  }
});

watchEffect(() => {
  if (dicomImageIds.length > 0 && viewport2.value) {
    initViewportRender(dicomImageIds, viewport2.value).then(() => {
      toolGroup?.addViewport(viewportIds[1]);
      if (synchronizer)
        synchronizer.add({ renderingEngineId, viewportId: viewportIds[1] });
      if (cameraSynchronizer)
        cameraSynchronizer.add({
          renderingEngineId,
          viewportId: viewportIds[1],
        });
    });
  }
});

async function initViewportRender(
  imageIds: string[],
  viewport: IStackViewport
) {
  if (imageIds.length > 0 && viewport) {
    await viewport.setStack(imageIds);
    //prefetch all images in imageIds for synchronizer
    imageIds.forEach((_, index) => {
      viewport.setImageIdIndex(index);
    });
    viewport.setImageIdIndex(0);
    viewport.render();
  }
}
onMounted(() => {
  enableElement(viewportIds[0], element1.value, viewport1);
  enableElement(viewportIds[1], element2.value, viewport2);

  //in an application, this should be extract to a hook and and remove event listeners when unmounted
  element1.value.addEventListener(cornerstone.EVENTS.STACK_NEW_IMAGE, () => {
    const index = viewport1.value?.getCurrentImageIdIndex();
    viewportIndex1.value = index;
  });
  element2.value.addEventListener(cornerstone.EVENTS.STACK_NEW_IMAGE, () => {
    const index = viewport2.value?.getCurrentImageIdIndex();
    viewportIndex2.value = index;
  });
});
</script>

<template>
  <main>
    <div class="viewer-container">
      <div>
        <div
          ref="element1"
          class="viewer"
          id="element1"
          @contextmenu="$event.preventDefault()"
          @wheel="(event) => handleWheel(event, viewport1)"
        ></div>
        <p>
          <span>Viewport-1 | Slice: {{ viewportIndex1 + 1 }}</span>
          <button @click="handleReset(viewport1)">Reset</button>
        </p>
      </div>
      <div>
        <div
          ref="element2"
          class="viewer"
          id="element2"
          @contextmenu="$event.preventDefault()"
          @wheel="(event) => handleWheel(event, viewport2)"
        ></div>
        <p>
          <span>Viewport-2 | Slice: {{ viewportIndex2 + 1 }}</span>
          <button @click="handleReset(viewport2)">Reset</button>
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.viewer-container {
  display: flex;
  gap: 16px;
}

.viewer {
  position: relative;
}

p {
  margin: 4px 0;
}

button {
  margin-left: 8px;
}
</style>
