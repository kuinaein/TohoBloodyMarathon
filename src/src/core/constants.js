export const AppConstants = {
  BASE_SCALE: 2,
  CHARACTER_WIDTH: 24,
  CHARACTER_HEIGHT: 32,
  GRAZE_DISTANCE_SQ: 0,

  COLLISION_TYPE_PLAYER: 1,
  COLLISION_TYPE_ENEMY: 2,
};

AppConstants.GRAZE_DISTANCE_SQ =
  Math.pow(AppConstants.CHARACTER_WIDTH * 0.8, 2) +
  Math.pow(AppConstants.CHARACTER_HEIGHT * 0.8, 2);
