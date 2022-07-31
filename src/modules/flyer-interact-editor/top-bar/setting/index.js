define(['app'], function(app) {
	app.directive('fiSetting', ['$modalService', '$flyerConfig', 'FlyerService', '$q', '$utils', '$alert', '$rootScope', 'config', 'TplService', '$tplConfig', '$state',
		function($modalService, $flyerConfig, FlyerService, $q, $utils, $alert, $rootScope, config, TplService, $tplConfig, $state) {
			return {
				restrict: 'E',
				templateUrl: '/modules/flyer-interact-editor/top-bar/setting/index.html',
				replace: true,
				link: function($scope, $ele, $attrs) {
					var events = config.EVENTS;
					var uploadAudios; //上传的音乐库
					var contextFlyer = $scope.flyer;
					var flyerID = contextFlyer._id;
					$scope.editAudio = function() {
						$modalService.show({
							width: 500,
							// height: 300,
							windowClass: '',
							templateUrl: '/modules/flyer-interact-editor/top-bar/setting/audio.html',
							controller: ['$scope', '$modalInstance', '$alert', 'config', '$audio', '$timeout',
								function($scope, $modalInstance, $alert, config, $audio, $timeout) {
									$scope.tabs = [{
										label: '乐曲库',
										category: 30
									}, {
										label: '外链音乐',
										category: 20
									}, {
										label: '我的乐曲库',
										category: 10
									}];

									var audioGlobalConfig = config.FLYERS.audio;
									var audioPlayer;
									//音乐库

									var libraryAudios = [{
										key: 'hk01',
										uri: '/music/hk01.mp3',
										name: '欢快-喜洋洋.mp3'
									}, {
										key: 'hk02',
										uri: '/music/hk02.mp3',
										name: '欢快-步步高.mp3'
									}, {
										key: 'hk03',
										uri: '/music/hk03.mp3',
										name: '欢快-小苹果.mp3'
									}, {
										key: 'hk04',
										uri: '/music/hk04.mp3',
										name: '欢快-欢乐激扬.mp3'
									}, {
										key: 'hk05',
										uri: '/music/hk05.mp3',
										name: '欢快-欢快悠扬.mp3'
									}, {
										key: 'hk06',
										uri: '/music/hk06.mp3',
										name: '欢快-放克清脆.mp3'
									}, {
										key: 'jr01',
										uri: '/music/jr01.mp3',
										name: '节日-优美轻快.mp3'
									}, {
										key: 'jr02',
										uri: '/music/jr02.mp3',
										name: '节日-美好前奏.mp3'
									}, {
										key: 'jr03',
										uri: '/music/jr03.mp3',
										name: '节日-生日快乐.mp3'
									}, {
										key: 'jr04',
										uri: '/music/jr04.mp3',
										name: '节日-铃儿响叮当.mp3'
									}, {
										key: 'jr05',
										uri: '/music/jr05.mp3',
										name: '节日-圣诞快乐.mp3'
									}, {
										key: 'jz01',
										uri: '/music/jz01.mp3',
										name: '节奏-清晰清脆.mp3'
									}, {
										key: 'jz02',
										uri: '/music/jz02.mp3',
										name: '节奏-清晰节奏.mp3'
									}, {
										key: 'jz03',
										uri: '/music/jz03.mp3',
										name: '节奏-清晰简单.mp3'
									}, {
										key: 'jz04',
										uri: '/music/jz04.mp3',
										name: '节奏-爵士在巴黎.mp3'
									}, {
										key: 'jz05',
										uri: '/music/jz05.mp3',
										name: '节奏-激越节奏.mp3'
									}, {
										key: 'jz06',
										uri: '/music/jz06.mp3',
										name: '节奏-激励清晰.mp3'
									}, {
										key: 'jz07',
										uri: '/music/jz07.mp3',
										name: '节奏-微芯.mp3'
									}, {
										key: 'jz08',
										uri: '/music/jz08.mp3',
										name: '节奏-浪漫.mp3'
									}, {
										key: 'jz09',
										uri: '/music/jz09.mp3',
										name: '节奏-环太平洋.mp3'
									}, {
										key: 'gd01',
										uri: '/music/gd01.mp3',
										name: '古典-禅院钟声.mp3'
									}, {
										key: 'gd02',
										uri: '/music/gd02.mp3',
										name: '古典-寒鸦戏水.mp3'
									}, {
										key: 'gd03',
										uri: '/music/gd03.mp3',
										name: '古典-渔舟唱晚.mp3'
									}, {
										key: 'gd04',
										uri: '/music/gd04.mp3',
										name: '古典-古琴弹奏.mp3'
									}, {
										key: 'yy01',
										uri: '/music/yy01.mp3',
										name: '悠扬-缠绵悦耳.mp3'
									}, {
										key: 'yy02',
										uri: '/music/yy02.mp3',
										name: '悠扬-再度梦想.mp3'
									}, {
										key: 'yy03',
										uri: '/music/yy03.mp3',
										name: '悠扬-萨克斯.mp3'
									}, {
										key: 'yy04',
										uri: '/music/yy04.mp3',
										name: '悠扬-小夜曲.mp3'
									}, {
										key: 'yy05',
										uri: '/music/yy05.mp3',
										name: '悠扬-平静.mp3'
									}, {
										key: 'yy06',
										uri: '/music/yy06.mp3',
										name: '悠扬-激励.mp3'
									}];

									var flyerAudio;
									$scope.audios = [];
									$scope.init = function() {
										flyerAudio = contextFlyer.audio;
										$scope.audio = {
											active: flyerAudio.active
										};
										_.forEach($scope.tabs, function(tab) {
											if (tab.category === flyerAudio.category) {
												tab.active = true;
											} else {
												tab.active = false;
											}
										});
										if (!uploadAudios) {
											$audio.list()
												.then(function(listResult) {
													uploadAudios = listResult.audios;
													$scope.changeCategory(flyerAudio.category);
												});
										} else {
											$scope.changeCategory(flyerAudio.category);
										}
									};


									// 切换音乐类型
									$scope.changeCategory = function(category) {
										if (!flyerAudio) return;

										var categorys = audioGlobalConfig.categorys;
										$scope.audio.category = category;
										// 一下代码 压缩后在 360 浏览器中会报错，改成 if 写法
										//!TODO 获取当前类型下的audio的uri
										$scope.audio = $scope.audio || {};
										$scope.audio.uri = '';
										if (category === categorys.upload) {
											flyerAudio.upload = flyerAudio.upload || {};
											$scope.audio.uri = flyerAudio.upload.uri;
											$scope.audio.key = flyerAudio.upload.key;
											$scope.audios = uploadAudios;
											$timeout(function() {
												$scope.changeAudio($scope.audio);
											});
										}
										if (category === categorys.thirdparty) {
											flyerAudio.thirdparty = flyerAudio.thirdparty || {};
											$scope.audio.uri = flyerAudio.thirdparty.uri;
										}
										if (category === categorys.library) {
											flyerAudio.library = flyerAudio.library || {};
											$scope.audio.uri = flyerAudio.library.uri;
											$scope.audio.key = flyerAudio.library.key;
											$scope.audios = libraryAudios;
											$timeout(function() {
												$scope.changeAudio($scope.audio);
											});
										}
									};

									var initCount = 1;
									$scope.$watch('audio.uri', function(val) {
										if (val) {
											if (initCount >= 2) {
												$scope.audio.active = true;
											}
											initCount = initCount + 1;

										}
									});
									// 选择音乐
									$scope.changeAudio = function(audio) {
										// 所选音乐无链接，则隐藏播放器

										if (!audio.key) {
											$scope.audio.uri = '';
											$scope.audio.key = '';
											if ($(audioPlayer)) {
												$(audioPlayer)
													.hide();
											}
											return;
										}
										var index = _.findIndex($scope.audios, {
											'key': audio.key
										});
										if (index !== -1) {
											audio.uri = $scope.audios[index].uri;
											loadAudio(audio);
										} else {
											audio.key = '';
											audio.uri = '';
										}
									};

									function loadAudio(audio) {
										audioPlayer = $('.setting-audio form audio')
											.get(0);
										if (audio.uri && audioPlayer) {
											audioPlayer.pause();
											$(audioPlayer)
												.show();
											audioPlayer.src = audio.uri;
											audioPlayer.load();
										}
									}

									$scope.uploadAudioFile = function($file, $event) {
										if ($file.length < 1) return;
										if ($scope.audio.uploading) return;

										$('.setting-audio .uploading .audio-name')
											.text($file[0].name.slice(0, -4));

										$scope.audio.uploading = true;
										$scope.audio.progress = 0;
										if ($file[0].size > 3670016) {
											$scope.errorUpload('音乐大小不能超过 3.5M');
											return;
										}

										var a = $audio.upload($file)
											.then(function(result) {
												$scope.apiCreateAudio(result);
											}, function(result) {
												$scope.errorUpload(result);
											}, function(percentage) {
												setProgress(percentage * 0.9);
											});
									};
									$scope.errorUpload = function(result) {
										if (result) {
											$alert.error(result);
										}
										$scope.audio.uploading = false;
										setProgress(0);
									};
									$scope.apiCreateAudio = function(options) {
										$audio.create({
												name: options.name,
												uri: options.uri
											})
											.then(function(result) {
												$scope.audio.uri = result.uri;
												$scope.audio.key = result._id;
												$scope.audio.name = result.name;
												$scope.audios.push($scope.audio);

												$timeout(function() {
													$scope.changeAudio($scope.audio);
												});


												setProgress(100);
												$timeout(function() {
													$scope.audio.uploading = false;
													setProgress(0);
												}, 600);
											}, function(result) {
												$scope.errorUpload(result);
											});
									};
									$scope.abort = function() {
										$audio.abort();
										$scope.audio.uploading = false;
										setProgress(0);
									};

									function setProgress(percentage) {
										$scope.audio.progress = percentage;
									}

									$scope.mp3Pattern = (function() {
										var regexp1 = /[\/\.]+/i,
											regexp2 = /\.mp3$/i;
										return {
											test: function(value) {
												if (regexp1.test(value) && regexp2.test(value)) {
													return true;
												} else {
													return false;
												}
											}
										};
									})();

									$scope.toggleAudio = function() {
										$scope.audio.active = !$scope.audio.active;
									};

									$scope.save = function() {
										FlyerService.updateAudio(flyerID, $scope.audio)
											.then(function(result) {
												contextFlyer.audio = _.merge(contextFlyer.audio, result.msg);
												$scope.close();
												$alert.success('保存音乐成功');
											});
									};
									$scope.close = function() {
										$modalInstance.close();
									};

								}
							]
						});
					};

					$scope.flyerConfig = function() {
						$flyerConfig.show({
							flyer: contextFlyer,
							action: 'update'
						}).then(function(flyer) {
							contextFlyer = _.merge(contextFlyer, flyer);
							$state.current.pageTitle = contextFlyer.title;
						});
					};

					// 模板设置
					$scope.tplConfig = function($event) {
						TplService.getSetting(flyerID)
							.then(function(data) {
								if (data.code !== 200) return $alert.error(data.msg);
								$tplConfig.show({
									tpl: data.msg,
									action: 'update'
								}).then(function(tpl) {
									contextFlyer = _.merge(contextFlyer, tpl);
									$state.current.pageTitle = contextFlyer.title;
								});
							});
					};


				}
			};
		}
	]);
});
