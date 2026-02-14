set shell := ["bash", "-euo", "pipefail", "-c"]

PROJECT_ID := "40992"
BASE_URL := "https://api-prod.raw-data.hotosm.org/v1/s3/get/TM/hotosm_project_40992/buildings/polygons"
SHP_ZIP := BASE_URL + "/hotosm_project_40992_buildings_polygons_shp.zip"
SHP_FILE := "hotosm_project_40992_buildings_polygons_shp.shp"

clean:
  rm -rf tmp

build:
  if [ ! -d node_modules ]; then npm install; fi
  npm run build

today:
  just clean
  mkdir -p tmp docs/daily
  curl -L -o tmp/buildings.zip "{{SHP_ZIP}}"
  unzip -p tmp/buildings.zip "Readme.txt" > tmp/Readme.txt
  DATE=$(grep -Eo "[0-9]{4}-[0-9]{2}-[0-9]{2}" tmp/Readme.txt | head -n 1); \
    echo "Date: $DATE"; \
    mkdir -p "$DATE"; \
    unzip -o -d "$DATE" tmp/buildings.zip; \
    ogr2ogr -f GeoJSONSeq /vsistdout/ "$DATE/{{SHP_FILE}}" | \
      tippecanoe -o "docs/daily/$DATE.pmtiles" -f -zg --read-parallel --layer=buildings
  rm -rf tmp
  just build
