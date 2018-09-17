export const RESOURCE_MAP = {
  Title_Logo_png: 'third-party/title-logo.png',
  Orin_png: 'third-party/erl/orin.png',
  Satori_jpg: 'third-party/erl/satori.jpg',
  ChireidenCharacters_png: 'third-party/thv4_chireiden.png',
  BG_Country_Platform_png: 'third-party/country-platform-tiles-example.png',
  BG_Forest_png: 'third-party/forest-931706_640.jpg',
  Result_Frame_png: 'third-party/result-frame.png',
};

if (!window.gResources) {
  window.gResources = [];
  for (const k of Object.keys(RESOURCE_MAP)) {
    gResources.push(RESOURCE_MAP[k]);
  }
}
