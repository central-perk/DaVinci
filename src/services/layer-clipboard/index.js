/**
 *  导出客户
 *
 */
define([
    'app'
], function(app) {
    app.service('$layerClipboard', ['config', '$layerManage', '$http', '$alert', '$rootScope', '$utils',
        function(config, $layerManage, $http, $alert, $rootScope, $utils) {
            var cache = {};
            var events = config.EVENTS;
            var _copy = function(_layer) {
                var layer = angular.copy(_layer);
                layer.id = 'layer-' + $utils.createToken();
                layer._new = true;
                cache.layer = layer;

            };
            var _paste = function(layer, options) {
                _setOffset(layer, options);
                layer.style.zIndex = $layerManage.getNextzIndex();
                $layerManage.addLayer(layer);
                // $alert.success('粘贴成功');
            };
            var _setOffset = function(layer, options) {
                if (options && options.x && options.y) {
                    layer.style.x = options.x;
                    layer.style.y = options.y;
                } else {
                    layer.style.x += 10;
                    layer.style.y += 10;
                }
            };

            this.init = function(page) {
                cache.page = page;
            };
            this.clone = function(_layer) {
                _copy(_layer);
                if (cache.layer) {
                    //拷贝时10px偏差
                    var options = {
                        x: _layer.style.x + 20,
                        y: _layer.style.y + 20
                    };
                    _paste(cache.layer, options);
                    cache.layer = null;
                }
                // $alert.success('拷贝成功');

            };
            // 展示
            this.copy = function(_layer) {
                _copy(_layer);
                // $alert.success('复制成功');
            };

            this.paste = function(options) {
                if (cache.layer) {
                    if (options) {
                        options.x -= cache.layer.style.width / 2;
                        options.y -= cache.layer.style.height / 2;
                    }
                    _paste(cache.layer, options);
                    _copy(cache.layer);
                }
            };

            this.cut = function(_layer) {
                $layerManage.rmLayer(_layer, true);
                _copy(_layer);
                // $alert.success('剪切成功');
            };
        }
    ]);
});