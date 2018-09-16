/** ストレージAPIの簡単なラッパ */
export class TbmStorage {
  /**
   * @param {string} key
   * @return {*}
   */
  static get(key) {
    if (localStorage) {
      return localStorage.getItem(key);
    }
  }

  /**
   * @param {string} key
   * @param {string} value
   */
  static set(key, value) {
    if (localStorage) {
      localStorage.setItem(key, value);
    } else {
      console.error('localStorageが無効で保存できない： ' + key);
    }
  }
}

TbmStorage.KEY_HIGH_SCORE = 'toho_bloody_marathon.highscore';
