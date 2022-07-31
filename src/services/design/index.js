define(['app'], function(app) {
    //$design对外提供主题，背景，色彩，字体，音乐
    app.service('$design', ['config', '$http',
        function(config) {


            var defaultFlyerCategory = config.FLYERS.categorys.static,
                DESIGN = config.DESIGN[defaultFlyerCategory],
                FEELS = [],
                BGS = [],
                bgDefaultKey = 0,
                fontDefaultKey = 0,
                curFeel,
                curDesign;

            var self = this;
            this.init = function(_flyer) {
                if (!_flyer) return;
                DESIGN = config.DESIGN[_flyer.category || defaultFlyerCategory];
                curDesign = _flyer.design;
                curFeel = angular.copy(curDesign.feel);
                FEELS = _.reduce(DESIGN.FEELS, function(result, val, key) {
                    if (key && val.name) {
                        result.push({
                            key: key,
                            name: val.name
                        });
                    }
                    return result;
                },[]);
            };
            this.feelList = function() {
                return FEELS;
            };
            this.bgList = function() {
                if(!curFeel) return [];
                return DESIGN.FEELS[curFeel.key].bgs;
            };
            this.colorList = function() {
                return DESIGN.COLORS;
            }
            this.fontList = function() {
                return DESIGN.FONTS;
            }
            this.audioList = function() {
                return DESIGN.FEELS[curFeel.key].audios;
            }
            this.bgDefault = function(feel) {
                feel = feel || curFeel;
                return DESIGN.FEELS[feel.key].bgs[bgDefaultKey];
            }
            this.fontDefault = function() {
                return DESIGN.FONTS[fontDefaultKey];
            }
            this.curFeel = function() {
                return curFeel.key;
            }
            this.curFeelName = function() {
                _.each(FEELS, function(feel) {
                    if (feel.key === curFeel.key) {
                        return feel.name;
                    }
                })
            }
            this.curDesign = function() {
                return curDesign;
            }

            // old
            this.feelDefaultBgKey = function(feel) {
                var _index = 0,
                    _curFeel = feel || curFeel;
                switch (_curFeel.key) {
                    case 'feel-carve-time':
                        _index = 3;
                        break;
                    case 'feel-color-life':
                        _index = 10;
                        break;
                    case 'feel-minimal':
                        _index = 2;
                        break;
                    case 'feel-abstract':
                        _index = 6;
                        break;
                }
                return _index;
            }
            this.feelDefaultFontKey = function() {
                return 0;
            }
            this.feelDefaultBg = function(options) {
                var _feel = options ? options.feel : curFeel,
                    _feelDefaultBgKey = this.feelDefaultBgKey(_feel);
                return DESIGN.FEELS[_feel.key].bgs[_feelDefaultBgKey];
            }
            this.feelDefaultFont = function() {
                var _feelDefaultFontKey = this.feelDefaultFontKey();
                return DESIGN.FONTS[_feelDefaultFontKey];
            }
            this.feelKey = function() {
                return curFeel.key;
            }
            this.getFeelName = function() {
                var _feels = this.feelList();
                for (var i = 0; i < _feels.length; i++) {
                    if (_feels[i].key === curFeel.key) {
                        return _feels[i].name;
                    }
                }
            }
            this.getDesign = function() {
                return curDesign;
            }
            this.setFeel = function(_feel) {
                curFeel = _feel;
            }
            this.current = function(_feature, _value) {
                var _data,
                    _tmps = self[_feature + 'List']();
                for (var i = 0; i < _tmps.length; i++) {
                    if (_value.key === _tmps[i].key) {
                        _data = _tmps[i];
                    }
                }
                return _data || null;
            }
        }
    ]);
});
