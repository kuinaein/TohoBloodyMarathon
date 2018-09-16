export const RESOURCE_MAP = {
  ChireidenCharacters_png: 'third-party/thv4_chireiden.png',
  BG_Country_png: 'third-party/country-platform-tiles-example.png',
};

if (!window.gResources) {
  window.gResources = [];
  for (const k of Object.keys(RESOURCE_MAP)) {
    gResources.push(RESOURCE_MAP[k]);
  }
}
