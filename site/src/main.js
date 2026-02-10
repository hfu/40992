import "maplibre-gl/dist/maplibre-gl.css";
import "maplibre-gl-layer-control/style.css";
import "./style.css";

import maplibregl from "maplibre-gl";
import { Protocol } from "pmtiles";
import { LayerControl } from "maplibre-gl-layer-control";
import dailyManifest from "./daily-manifest.json";

const TILEJSON_URL = "https://tunnel.optgeo.org/martin/freetown_2025-10-22_nearest";

const protocol = new Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

const buildStyle = (tilejson) => {
  const tileSize = tilejson.tileSize || 512;
  return {
    version: 8,
    sources: {
      background: {
        type: "raster",
        tiles: tilejson.tiles,
        tileSize,
        attribution: tilejson.attribution || ""
      }
    },
    layers: [
      {
        id: "background",
        type: "raster",
        source: "background",
        paint: {
          "raster-opacity": 0.35
        }
      }
    ]
  };
};

const initMap = async () => {
  const tilejson = await fetch(TILEJSON_URL).then((res) => res.json());
  const style = buildStyle(tilejson);

  const map = new maplibregl.Map({
    container: "map",
    style,
    center: tilejson.center ? [tilejson.center[0], tilejson.center[1]] : [-13.247, 8.463],
    zoom: tilejson.center ? tilejson.center[2] : 15,
    attributionControl: true,
    hash: "map"
  });

  map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-left");

  const layerIds = [];
  const files = Array.isArray(dailyManifest?.files) ? dailyManifest.files : [];

  map.on("load", () => {
    files.forEach((file) => {
      const idBase = file.replace(/\.pmtiles$/i, "");
      const sourceId = `daily-${idBase}`;
      const layerId = `daily-${idBase}-fill`;

      map.addSource(sourceId, {
        type: "vector",
        url: `pmtiles://daily/${file}`
      });

      map.addLayer({
        id: layerId,
        type: "fill",
        source: sourceId,
        "source-layer": "buildings",
        paint: {
          "fill-color": "#38bdf8",
          "fill-opacity": 0.45,
          "fill-outline-color": "#0f172a"
        }
      });

      layerIds.push(layerId);
    });

    const layerControl = new LayerControl({
      collapsed: false,
      layers: layerIds,
      panelWidth: 320,
      panelMinWidth: 240,
      panelMaxWidth: 420
    });

    map.addControl(layerControl, "top-right");

    if (tilejson.bounds && !window.location.hash.includes("map=")) {
      map.fitBounds(tilejson.bounds, { padding: 40, maxZoom: 19 });
    }
  });

  map.on("remove", () => {
    maplibregl.removeProtocol("pmtiles");
  });
};

initMap().catch((error) => {
  console.error("Failed to initialize map", error);
});
