const res = {
  ChireidenCharacters_png: 'res/third-party/thv4_chireiden.png',
};

window.gResources = [];
for (const k of Object.keys(res)) {
  gResources.push(res[k]);
}
