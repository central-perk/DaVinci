define([
    'app',
    // '/components/custome/slider/content/editor/index.js'
], function(app) {
    app.directive('fiEditContentCustomSlider', ['config', '$rootScope', '$imageManage', '$layerManage', '$utils', function(config, $rootScope, $imageManage, $layerManage, $utils) {
        var events = config.EVENTS;
        return {
            restrict: 'E',
            templateUrl: '/components/custome/slider/content/index.html',
            scope: {
                layer: "=ngModel"
            },
            link: function($scope, $element, $attrs) {
                // debugger
                // var nodeContent = $scope.layer.content.node;





                $scope.addNode = function() {
                    if ($scope.layer.content.node.length > 5) return;
                    var node = {
                        id: $utils.createToken()
                    };

                    $imageManage.init(null, {
                        title: '选择图片'
                    }).then(function(imagePacks) {
                        node.url = imagePacks[0].url;
                        node.crop = imagePacks[0].crop;
                        node.cropUrl = imagePacks[0].cropUrl;

                        $scope.layer.content.node.push(node);

                    });
                };

                $scope.rmNode = function($event, $index) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.layer.content.node.splice($index, 1);
                };

                // $scope.editNode = function(node) {
                // 	activeNode(node);

                // 	// $timeout(function() {
                // 	// 	$scope.$emit(events.imageCropClick, {
                // 	// 		action: 'resize',
                // 	// 		id: node.id + '-image',
                // 	// 		crop: node.crop
                // 	// 	});
                // 	// });
                // 	// removeHistorySpContainer();
                // };

                // $scope.rmNode = function() {
                // 	var activeNodeID = $scope.activeNodeID;
                // 	if (activeNodeID) {
                // 		_.forEach(nodeContent, function(node, index) {
                // 			if (node && activeNodeID === node.id) {
                // 				nodeContent.splice(index, 1);
                // 				if (index > 0) {
                // 					// active previous node
                // 					activeNode(nodeContent[index - 1]);
                // 				} else {
                // 					// active first node
                // 					activeNode(nodeContent[0]);
                // 				}
                // 			}
                // 		});
                // 	}
                // };

                // function activeNode(node) {
                // 	$scope.activeNode = node;
                // 	$scope.activeNodeID = node.id;
                // 	// removeHistorySpContainer();
                // }

                // (function() {
                // 	// 为每个节点添加id
                // 	if (!nodeContent.length) {
                // 		nodeContent.push({
                // 			id: $utils.createToken()
                // 		});
                // 	} else {
                // 		_.each(nodeContent, function(node) {
                // 			node.id = node.id || $utils.createToken();
                // 		});
                // 	}

                // 	_.forEach(nodeContent, function(node) {
                // 		if (node.id === $scope.activeNodeID) {
                // 			activeNode(node);
                // 		}
                // 	});
                // 	if (!$scope.activeNodeID) {
                // 		activeNode(nodeContent[0]);
                // 	}
                // })();



                // function removeHistorySpContainer() {
                // 	var $spContainers = $('.sp-kindeditor');
                // 	for (var i = 0, len = $spContainers.length; i < len; i++) {
                // 		$spContainers[i].remove();
                // 	}
                // }
            }
        };
    }]);
});