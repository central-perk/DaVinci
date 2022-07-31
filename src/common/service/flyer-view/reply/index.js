define([
    'app',
    'common/service/flyer-view/reply/config'
], function(app, pageConfig) {
    app.directive('fvReply', ['config', '$rootScope', '$alert', 'VoteService', 'ReplyService',
        function(config, $rootScope, $alert, VoteService, ReplyService) {
            return {
                restrict: 'E',
                templateUrl: '/common/service/flyer-view/reply/index.html',
                replace: true,
                scope: {
                    setting: '@'
                },
                link: function($scope, $ele, $attrs) {

                    $attrs.$observe('setting', function() {
                        $scope.setting = $scope.$parent.$eval($attrs.setting);
                        $scope.init();
                    });

                    var containerClass = '.fv-reply';

                    $scope.init = function() {
                        $scope.VOTE = _.cloneDeep(pageConfig.vote);
                        $scope.replys = [];
                        $scope.query = _.cloneDeep($scope.setting);
                        $scope.reply = _.cloneDeep($scope.setting);
                        $scope.listReply();

                        $scope.getVote();
                    };

                    // 获取评论列表
                    $scope.listReply = function() {
                        if ($scope.nextPage) $scope.loading = true;
                        ReplyService.list($scope.query)
                            .then(function(data) {
                                if (data.code === 200) {
                                    $scope.loading = false;
                                    $scope.replys = $scope.replys.concat(data.msg.replys || []);
                                    $scope.next = data.msg.next;
                                    $scope.count = data.msg.count;
                                    $scope.nextPage = data.msg.nextPage;
                                } else {
                                    $alert.error(data.msg);
                                }
                            });
                    };

                    // 评论下一页
                    $scope.nextReply = function() {
                        $scope.query.page = $scope.nextPage;
                        $scope.listReply();
                    };

                    // 评论字数剩余
                    $scope.contentLeft = function() {
                        if (!$scope.reply || !$scope.reply.content) return 800;
                        return 800 - $scope.reply.content.length;
                    };

                    // 提交评论
                    $scope.submitReply = function() {
                        ReplyService.create($scope.reply)
                            .then(function(data) {
                                if (data.code === 200) {
                                    $scope.reply.user = $rootScope.user;
                                    $scope.reply.createdTime = new Date();
                                    var reply = _.cloneDeep($scope.reply);
                                    delete $scope.reply;
                                    $scope.reply = _.cloneDeep($scope.setting);
                                    $scope.replys.unshift(reply);
                                    $alert.success(data.msg);
                                } else {
                                    $alert.error(data.msg);
                                }
                            });
                    };

                    // 获取当前投票信息
                    $scope.getVote = function() {
                        VoteService.get($scope.setting).then(function(data) {
                            if (data.code === 200) {
                                $scope.voted = data.msg.voted;
                                if ($scope.voted) {
                                    _.find($scope.VOTE, {
                                        key: data.msg.option
                                    }).active = true;
                                }

                                _.forEach(data.msg.data, function(opt, index) {
                                    _.find($scope.VOTE, {
                                        key: opt.option
                                    }).count = opt.count;
                                });



                                $scope.voteData = _.pluck(_.sortBy(data.msg.data, 'option'), 'count');
                                $scope.voteSum = _.sum($scope.voteData);
                                if ($scope.voteSum === 0) return;
                                drawPieChart($scope.voteSum, $scope.voteData, containerClass + ' .pie-chart');
                            } else {
                                $alert.error(data.msg);
                            }
                        });
                    };

                    // 投票
                    $scope.vote = function(opt) {
                        if ($scope.voted) return $alert.error('您已经投过票了');

                        var vote = _.cloneDeep($scope.setting);
                        vote.option = opt.key;

                        VoteService.create(vote).then(function(data) {
                            if (data.code === 200) {
                                $scope.voted = true;
                                var activeOpt = _.find($scope.VOTE, {
                                    key: opt.key
                                });
                                activeOpt.active = true;
                                activeOpt.count += 1;
                                $scope.voteData[opt.key] += 1;
                                $scope.voteSum += 1;

                                // drawPieChart($scope.voteSum, $scope.voteData, containerClass + ' .pie-chart');
                                $alert.success(data.msg);
                            } else {
                                $alert.error(data.msg);
                            }
                        });
                    };

                    function drawPieChart(sum, data, element) {
                        $(element).empty();

                        var width = 220,
                            height = 220;

                        var outerRadius = height / 2, // 110
                            innerRadius = outerRadius / 3, // 37
                            cornerRadius = 10;

                        var pie = d3.layout.pie();


                        var arc = d3.svg.arc()
                            .padRadius(outerRadius)
                            .innerRadius(innerRadius);

                        var color = ['#c9c9c9', '#fbb42a', '#1da265', '#c91e62'];


                        var svg = d3.select(element).append("svg")
                            .attr("width", width)
                            .attr("height", height);

                        var path = svg.append("g")
                            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                        var text = svg.append("text")
                            .attr("x", width / 2)
                            .attr("y", width / 2)
                            .attr("dy", ".3em")
                            .attr("style", "text-anchor: middle");

                        path.selectAll("path")
                            .data(pie(data))
                            .enter().append("path")
                            .each(function(d) {
                                d.outerRadius = outerRadius - 20;
                                d.percentage = Math.round(d.data / sum * 100) + '%';
                            })
                            .attr("d", arc)
                            .style("fill", function(d, i) {
                                return color[i];
                            })
                            .on("mouseover", arcTween(outerRadius, 0))
                            .on("mouseout", arcTween(outerRadius - 20, 150));

                        function arcTween(outerRadius, delay) {
                            return function(d) {
                                var percentageText = '';
                                if (d3.event.type === 'mouseover') {
                                    percentageText = d.percentage;
                                }
                                text.transition().delay(200).text(function() {
                                    return percentageText;
                                });
                                d3.select(this).transition().delay(delay).attrTween("d", function(d) {
                                    var i = d3.interpolate(d.outerRadius, outerRadius);
                                    return function(t) {
                                        d.outerRadius = i(t);
                                        return arc(d);
                                    };
                                });
                            };
                        }
                    }
                }
            };
        }
    ]);
});