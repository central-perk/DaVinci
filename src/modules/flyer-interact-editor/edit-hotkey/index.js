define([
	'app'
], function(app) {
	app.service('$editHotkey', ['hotkeys', '$layerManage', '$layerClipboard', '$rootScope', 'config', function(hotkeys, $layerManage, $layerClipboard, $rootScope, config) {
		var events = config.EVENTS;


		// 复制
		hotkeys.add({
			combo: 'mod+c',
			description: 'copy current layer',
			callback: function() {
				var layer = $layerManage.getCurLayer();
				if (!layer) return;
				$layerClipboard.copy(layer);
			}
		});

		// 粘贴
		hotkeys.add({
			combo: 'mod+v',
			description: 'past current layer',
			callback: function() {
				$layerClipboard.paste();
			}
		});

		// 剪切
		hotkeys.add({
			combo: 'mod+x',
			description: 'cut current layer',
			callback: function() {
				var layer = $layerManage.getCurLayer();
				if (!layer) return;
				$layerClipboard.cut(layer);
			}
		});

		// 拷贝
		hotkeys.add({
			combo: 'alt+shift+c',
			description: 'cut current layer',
			callback: function() {
				var layer = $layerManage.getCurLayer();
				if (!layer) return;
				$layerClipboard.clone(layer);
			}
		});

		// 删除
		hotkeys.add({
			combo: ['backspace', 'del', 'command+backspace'],
			description: 'delete current layer',
			callback: function(e) {
				if (e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}
				var layer = $layerManage.getCurLayer();
				if (!layer) return;
				$rootScope.$broadcast(events.layerClick, {
					action: 'removeLayer',
					layer: layer
				});
			}
		});



		// 上移
		hotkeys.add({
			combo: 'up',
			callback: function() {
				var layer = $layerManage.getCurLayer();
				if (!layer) return;
				$layerManage.moveUp(layer);
			}
		});

		// 下移
		hotkeys.add({
			combo: 'down',
			callback: function() {
				var layer = $layerManage.getCurLayer();
				if (!layer) return;
				$layerManage.moveDown(layer);
			}
		});

		// 左移
		hotkeys.add({
			combo: 'left',
			callback: function() {
				var layer = $layerManage.getCurLayer();
				if (!layer) return;
				$layerManage.moveLeft(layer);
			}
		});

		// 右移
		hotkeys.add({
			combo: 'right',
			callback: function() {
				var layer = $layerManage.getCurLayer();
				if (!layer) return;
				$layerManage.moveRight(layer);
			}
		});

		// --------------------------------------------

		// 上移10
		hotkeys.add({
			combo: 'shift+up',
			callback: function() {
				var layer = $layerManage.getCurLayer();
				if (!layer) return;
				$layerManage.moveUp(layer, 10);
			}
		});

		// 下移10
		hotkeys.add({
			combo: 'shift+down',
			callback: function() {
				var layer = $layerManage.getCurLayer();
				if (!layer) return;
				$layerManage.moveDown(layer, 10);
			}
		});

		// 左移10
		hotkeys.add({
			combo: 'shift+left',
			callback: function() {
				var layer = $layerManage.getCurLayer();
				if (!layer) return;
				$layerManage.moveLeft(layer, 10);
			}
		});

		// 右移10
		hotkeys.add({
			combo: 'shift+right',
			callback: function() {
				var layer = $layerManage.getCurLayer();
				if (!layer) return;
				$layerManage.moveRight(layer, 10);
			}
		});




		this.init = function() {


		};
	}]);
});