define([
	'app',
	'pages/account/setting/index',
	'pages/account/manage/index',
	'pages/account/msg/index',
	'pages/account/relation/index',
], function(app) {
	app.controller('ActController', ['$scope', '$rootScope', '$state', '$http', 'config', '$alert',
		function($scope, $rootScope, $state, $http, config, $alert) {

			var events = config.EVENTS;

			// 监听－未读消息数量
			$scope.$on(events.countUnReadMessages, countUnReadMessages);

			// 获取未读信息数量
			function countUnReadMessages() {
				$http({
					method: 'get',
					url: '/api/messages/count/unread'
				}).
				success(function(data, status, headers, config) {
					if (data.code === 200) {
						$scope.unReadMsgCount = data.msg;
					} else {
						$alert.error(data.msg);
					}
				});
			}
			countUnReadMessages();

			if ($state.is('account')) $state.go('account.setting');

		}
	]);

	app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
		$stateProvider
			.state('account', {
				url: '/account',
				templateUrl: '/pages/account/index.html',
				controller: 'ActController',
				pageTitle: '用户中心'
			})
			.state('account.setting', {
				url: '/setting',
				templateUrl: '/pages/account/setting/index.html',
				controller: 'ActSettingController',
				pageTitle: '用户中心'
			})
			.state('account.manage', {
				url: '/manage',
				templateUrl: '/pages/account/manage/index.html',
				controller: 'ActManageController',
				pageTitle: '用户中心'
			})
			.state('account.msg', {
				url: '/msg',
				templateUrl: '/pages/account/msg/index.html',
				controller: 'ActMsgController',
				pageTitle: '用户中心'
			})
			.state('account.relation', {
				url: '/relation',
				templateUrl: '/pages/account/relation/index.html',
				controller: 'ActRelationController',
				pageTitle: '用户中心'
			});
	}]);
});