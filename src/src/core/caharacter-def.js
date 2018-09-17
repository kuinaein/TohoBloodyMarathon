import {AppConstants} from '@/core/constants';
import {RESOURCE_MAP} from '@/resource';

/** キャラクター単体分のマスタ */
export class CharacterDef {
  /**
   * @param {string} imageFilename
   * @param {number} row 画像中の行番号÷4(キャラ単位)
   * @param {number} col 画像中の行番号÷3(キャラ単位)
   * @param {number} scale 表示倍率
   * @param {boolean} flying 飛べるかどうか
   */
  constructor(imageFilename, row, col, scale, flying) {
    this.imageFilename = imageFilename;
    this.row = row;
    this.col = col;
    this.scale = scale;
    this.flying = flying;
  }
}

/**
 * @typedef CharacterDefParams
 * @property {string} imageFilename
 * @property {number} row
 * @property {number} col
 */

/** プレイヤーキャラ毎のキャラクター定義のセット */
export class CharacterSet {
  /**
   * @param {string} name
   * @param {string} pcSdImage キャラクター選択時のSD画像のファイル名
   * @param {CharacterDefParams} pcDef
   * @param {CharacterDefParams} landEnemyDef
   * @param {CharacterDefParams} flyingEnemyDef
   */
  constructor(name, pcSdImage, pcDef, landEnemyDef, flyingEnemyDef) {
    this.name = name;
    this.playerCharacterSdImage = pcSdImage;
    this.playerCharacterDef = new CharacterDef(
        pcDef.imageFilename,
        pcDef.row,
        pcDef.col,
        AppConstants.BASE_SCALE,
        false
    );

    /** @type {CharacterDef[]} */
    this.enemyDefs = [];

    let enemyDef = new CharacterDef(
        landEnemyDef.imageFilename,
        landEnemyDef.row,
        landEnemyDef.col,
        AppConstants.BASE_SCALE,
        false
    );
    this.enemyDefs.push(enemyDef);

    // でかい○○
    enemyDef = Object.assign({}, enemyDef);
    enemyDef.scale = AppConstants.BASE_SCALE * 1.5;
    this.enemyDefs.push(enemyDef);

    this.enemyDefs.push(
        new CharacterDef(
            flyingEnemyDef.imageFilename,
            flyingEnemyDef.row,
            flyingEnemyDef.col,
            AppConstants.BASE_SCALE,
            true
        )
    );
  }
}

/** @type {{[idx: string]: CharacterSet}} */
export const CHARACTER_SET_MAP = {};

CHARACTER_SET_MAP['お燐'] = new CharacterSet(
    'お燐',
    RESOURCE_MAP.SD_Orin_jpg,
    {
      imageFilename: RESOURCE_MAP.Characters_Chireiden_png,
      row: 0,
      col: 2,
    },
    {
      imageFilename: RESOURCE_MAP.Characters_Chireiden_png,
      row: 0,
      col: 1,
    },
    {
      imageFilename: RESOURCE_MAP.Characters_Chireiden_png,
      row: 0,
      col: 3,
    }
);

CHARACTER_SET_MAP['穣子'] = new CharacterSet(
    '穣子',
    RESOURCE_MAP.SD_Minoriko_jpg,
    {
      imageFilename: RESOURCE_MAP.Characters_Akisys_png,
      row: 0,
      col: 1,
    },
    {
      imageFilename: RESOURCE_MAP.Characters_Akisys_png,
      row: 0,
      col: 0,
    },
    {
      imageFilename: RESOURCE_MAP.Characters_Hina_png,
      row: 0,
      col: 0,
    }
);

CHARACTER_SET_MAP['こころ'] = new CharacterSet(
    'こころ',
    RESOURCE_MAP.SD_Kokoro_png,
    {
      imageFilename: RESOURCE_MAP.Characters_Kokoro_png,
      row: 1,
      col: 3,
    },
    {
      imageFilename: RESOURCE_MAP.Characters_Tenshi_png,
      row: 0,
      col: 0,
    },
    {
      imageFilename: RESOURCE_MAP.Characters_Iku_png,
      row: 0,
      col: 0,
    }
);

CHARACTER_SET_MAP['霊夢'] = new CharacterSet(
    '霊夢',
    RESOURCE_MAP.SD_Reimu_jpg,
    {
      imageFilename: RESOURCE_MAP.Characters_PC_png,
      row: 0,
      col: 0,
    },
    {
      imageFilename: RESOURCE_MAP.Characters_PC_png,
      row: 0,
      col: 2,
    },
    {
      imageFilename: RESOURCE_MAP.Characters_PC_png,
      row: 0,
      col: 1,
    }
);
