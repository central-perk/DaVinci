define([
	'app'
], function(app) {
	app.directive('fiEditAreaStd', ['config', '$rootScope', '$layerClipboard', '$layerFactory', '$layerManage', '$compile',
		function(config, $rootScope, $layerClipboard, $layerFactory, $layerManage, $compile) {
			var fiCptBasePath = '/components/interact/';
			var events = config.EVENTS;

			return {
				restrict: 'E',
				templateUrl: '/modules/flyer-interact-editor/edit-area/std/index.html',
				replace: true,
				link: function($scope, $element, $attrs) {

					$scope.tabs = [{
						label: '内容',
						key: 'content'
					}, {
						label: '动画',
						key: 'animate'
					}, {
						label: '背景',
						key: 'bg'
					}, {
						label: '特效',
						key: 'effect'
					}];
					$scope.env = 'et';


					//切换页面编辑器页签
					var _onTabChange = function(tab) {
						if (tab) {
							if (tab.key === 'effect' && $scope.page && $scope.page.effect.enable) {
								$scope.page.effect = $scope.page.effect || {};
								$scope.$emit(events.pageEditorClick, {
									action: 'editEffect'
								});
							} else {

								// if(tab.key === 'content'||tab.key === 'animate'){
								// 	$scope.getPageEditTpl();
								// }
								$scope.$emit(events.pageEditorClick, {
									action: 'notEditEffect'
								});
							}
						}
					};

					//切换页面编辑器页签
					$scope.changeTab = function(tab) {
						if (tab) {
							$scope.activeTab = tab;
							$scope.activeTab.active = true;
							_onTabChange(tab);
						}
					};

					$scope.tabStyle = function(tabs) {
						return {
							width: (1 / tabs.length) * 100 + '%'
						};
					};

					$scope.changeTab($scope.tabs[0]);



					//监听 - 缩略图被点击
					$rootScope.$on(events.pgThumbClick, function(event, data) {
						if (data &&
							data.action === 'edit' &&
							$scope.page &&
							$scope.page.kind === 'std') {
							// 激活内容页签
							$scope.changeTab($scope.tabs[0]);
						}
					});

					$scope.$watch('page.effect', function() {
						_onTabChange($scope.curTab);
					}, true);
				}
			};
		}
	]);
});