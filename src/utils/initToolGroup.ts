import * as cornerstoneTools from "@cornerstonejs/tools";
import {
  toolGroupId,
  imageSliceSync,
  imageCameraSync,
} from "../constants/cornerstoneIds";
const { PanTool, ZoomTool, synchronizers, ToolGroupManager } = cornerstoneTools;
const { createImageSliceSynchronizer, createCameraPositionSynchronizer } =
  synchronizers;

export function initToolGroup() {
  cornerstoneTools.addTool(ZoomTool);
  cornerstoneTools.addTool(PanTool);
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
  if (!toolGroup) return console.error("unable to create tool group");
  toolGroup.addTool(ZoomTool.toolName);
  toolGroup.addTool(PanTool.toolName);

  toolGroup.setToolActive(ZoomTool.toolName, {
    bindings: [
      {
        mouseButton: 2,
        // right mouse button
      },
    ],
  });

  toolGroup.setToolActive(PanTool.toolName, {
    bindings: [
      {
        mouseButton: 1,
        // left mouse button
      },
    ],
  });

  createImageSliceSynchronizer(imageSliceSync);
  createCameraPositionSynchronizer(imageCameraSync);
}
