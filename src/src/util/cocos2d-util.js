/**
 * @param {*} layerProps
 * @param {?cc.Layer} baseClass
 * @return {*}
 */
export function createSingleLayerScene(layerProps, baseClass) {
  const LayerClass = (baseClass || cc.Layer).extend(layerProps);
  /** @type {cc.Scene} */
  const sceneProps = {
    onEnter: function() {
      this._super();
      const layer = new LayerClass();
      this.addChild(layer);
    },
  };
  return cc.Scene.extend(sceneProps);
}
