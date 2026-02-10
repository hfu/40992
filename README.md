# 40992

This repository contains data derived from OpenStreetMap.
Please make sure we respect all the OpenStreetMap licenses and policies.

## Purpose
This project collects building data from the “Download OSM data” section of
https://tasks.hotosm.org/projects/40992. Each dataset is stored under a folder
named by date (for example, 2026-02-10), converted to PMTiles, and saved as a
date-stamped file such as /docs/daily/2026-02-10.pmtiles.

The /docs folder also hosts a web site that references those PMTiles files. The
site is hosted with GitHub Pages, and /docs contains the site assets.

## Build and hosting notes
- The site in /docs is generated with Vite.
- Configure Vite to inline CSS and JS into index.html (for example, via a
	vite.config.json setup that embeds assets).
- Use the latest MapLibre GL JS and pmtiles.js, embedded as ESM modules.
- Use es2022 mode (important for MapLibre).

## Data download and conversion notes
- The HOT Raw Data export is accessible via the raw-data API using stable S3
	paths. For project 40992 buildings polygons:
	- Shapefile ZIP (preferred):
		https://api-prod.raw-data.hotosm.org/v1/s3/get/TM/hotosm_project_40992/buildings/polygons/hotosm_project_40992_buildings_polygons_shp.zip
	- GeoJSON ZIP:
		https://api-prod.raw-data.hotosm.org/v1/s3/get/TM/hotosm_project_40992/buildings/polygons/hotosm_project_40992_buildings_polygons_geojson.zip
- The GeoJSON export has a known issue where the extent is a GeoJSON Geometry
	rather than a Feature. To keep tippecanoe inputs consistent, prefer using the
	Shapefile export and convert it to GeoJSONSeq.
- The dataset date is recorded in the ZIP Readme.txt; it is parsed and used for
	the PMTiles filename (for example, /docs/daily/2026-02-10.pmtiles).
- The conversion uses `ogr2ogr` to GeoJSONSeq and pipes directly to
	`tippecanoe`. Temporary files are placed under tmp/ and cleaned afterward.

## Commands
- Use the Justfile to run tasks. See [Justfile](Justfile) for `clean` and
	`today` tasks.
- Build the static site (inlines CSS/JS into docs/index.html):
	- `just build`
- Operational flow:
	- `just today` downloads the latest Shapefile ZIP, extracts it into a
		date-named folder, and produces the daily PMTiles.
	- `just build` regenerates docs/index.html using the current PMTiles list.

## Contents
- 2026-02-10/: OpenStreetMap data of the study area as of 2026-02-10 (includes
	Shapefile contents extracted from the daily ZIP).

## See also
- https://github.com/unopengis/7/issues/857
- https://tasks.hotosm.org/projects/40992

## Web site
- https://hfu.github.io/40992/#map=14.72/8.46293/-13.24763
