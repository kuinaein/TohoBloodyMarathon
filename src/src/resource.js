export const RESOURCE_MAP = {
  Title_Logo_png: 'third-party/title-logo.png',
  Orin_Title_png: 'third-party/erl/orin-title.png',
  Satori_About_jpg: 'third-party/erl/satori-about.jpg',

  SD_Orin_jpg: 'third-party/erl/orin.jpg',
  SD_Minoriko_jpg: 'third-party/erl/minoriko.jpg',
  SD_Kokoro_png: 'third-party/erl/kokoro.png',
  SD_Reimu_jpg: 'third-party/erl/reimu.jpg',

  Characters_Chireiden_png: 'third-party/dispell/thv4_chireiden.png',
  Characters_Akisys_png: 'third-party/dispell/thv4_akisys.png',
  Characters_Hina_png: 'third-party/dispell/thv4_hina.png',
  Characters_Kokoro_png: 'third-party/dispell/thv4_kokoroomen01-08.png',
  Characters_Tenshi_png: 'third-party/dispell/thv4_tenshi.png',
  Characters_Iku_png: 'third-party/dispell/thv4_iku.png',
  Characters_PC_png: 'third-party/dispell/char_th0012.png',

  BG_Country_Platform_png: 'third-party/country-platform-tiles-example.png',
  BG_Forest_png: 'third-party/forest-931706_640.jpg',
  Result_Frame_png: 'third-party/result-frame.png',

  SE_Transition_mp3: 'third-party/lokif-gui-se/load.mp3',
  SE_GameStart_mp3: 'third-party/lokif-gui-se/misc_sound.mp3',
  SE_Jump: 'third-party/jumppp22.mp3',
  SE_Shock_mp3: 'third-party/qubodupPunch05.mp3',
  SE_Result_mp3: 'third-party/lokif-gui-se/save.mp3',

  BGM_Main_mp3: 'third-party/adventuring_song.mp3',
};

if (!window.gResources) {
  window.gResources = [];
  for (const k of Object.keys(RESOURCE_MAP)) {
    gResources.push(RESOURCE_MAP[k]);
  }
}
