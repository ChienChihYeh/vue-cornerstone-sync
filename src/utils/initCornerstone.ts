import * as cornerstone from "@cornerstonejs/core";
import * as cornerstoneTools from "@cornerstonejs/tools";
import cornerstoneDICOMImageLoader from "@cornerstonejs/dicom-image-loader";
import dicomParser from "dicom-parser";
import { renderingEngineId } from "../constants/cornerstoneIds";

const { RenderingEngine } = cornerstone;

export async function initCornerstone() {
  await cornerstone.init();
  cornerstoneTools.init();
  cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
  cornerstoneDICOMImageLoader.external.dicomParser = dicomParser;
  new RenderingEngine(renderingEngineId);
}
