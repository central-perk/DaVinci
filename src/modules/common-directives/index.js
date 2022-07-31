/**
 *  通用的自定义指令
 *
 */
define(['app'], function(app) {

    //自动聚焦
    app.directive('autoFocus', ['$timeout', '$parse',
        function($timeout, $parse) {
            return {
                //scope: true,   // optionally create a child scope
                link: function(scope, element, attrs) {
                    var model = $parse(attrs.autoFocus);
                    scope.$watch(model, function(value) {
                        if (value === true) {
                            $timeout(function() {
                                element[0].focus();
                            });
                        }
                    });
                }
            };
        }
    ]);



    //颜色选择
    app.directive('colorSelect', [

        function factory() {
            var directive = {
                restrict: 'A', // 指令的使用方式，包括标签，属性，类，注释,
                scope: {
                    ngModel: "="
                },
                link: function($scope, $element, $attrs, $transclude, ngModel) {
                    function rgb2hex(rgb) {
                        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                        return "#" +
                            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
                            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
                            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2);
                    }
                    $scope.$watch('ngModel', function(val) {
                        if (val) {
                            var colorHEX = rgb2hex($element.css('background-color'));
                            if (val === colorHEX) {
                                $element.addClass('checked')
                            } else {
                                $element.removeClass('checked')
                            }
                        }
                    });
                }
            }
            return directive;
        }
    ]);

    //回车按钮
    app.directive('ngEnter', function() {
        return {
            restrict: 'AC',
            link: function($scope, $element, $attr) {
                $element.bind("keydown", function($event) {
                    if (event.which === 13) {
                        $scope.$apply(function() {
                            $scope.$eval($attr.ngEnter);
                        });
                        $event.stopPropagation();
                        return false;
                    }
                });
            }
        };
    });


    //限制input长度
    app.directive('ngInputLimit', function() {
        return {
            restrict: 'AC',
            scope: {
                val: '@ngModel'
            },
            link: function($scope, $element, $attr) {
                var _limit = $attr.ngInputLimit.split(','),
                    _max = _limit[1],
                    _min = _limit[0],
                    _inputVal = $scope.val,
                    _tmpVal;
                $element.bind("change input propertychange", function($event) {

                    var _val = $element.val();
                    if (_val.length > _max) {
                        _tmpVal = _val.substring(0, _max);
                        _inputVal = _tmpVal;
                        $element.val(_inputVal);

                    }
                });
            }
        };
    });

    //数字
    app.directive('amount', ['$compile',
        function($compile) {
            return {
                restrict: 'E',
                template: '<label class="amount" ng-transclude></label>',
                replace: true,
                transclude: true,
            };
        }
    ]);

    app.directive('dateFormat', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModelController) {
                ngModelController.$parsers.push(function(data) {
                    return data;
                });

                ngModelController.$formatters.push(function(data) {
                    if (data) {
                        var year = (new Date(data)).getFullYear(),
                            month = (new Date(data)).getMonth() + 1,
                            day = (new Date(data)).getDate();
                        if (month < 10) {
                            month = '0' + month;
                        }
                        if (day < 10) {
                            day = '0' + day;
                        }
                        return [year, month, day].join('-');
                    }
                });
            }
        };
    });
    app.directive('timeFormat', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModelController) {
                ngModelController.$parsers.push(function(data) {
                    return data;
                });

                ngModelController.$formatters.push(function(data) {
                    if (data) {
                        var hour = (new Date(data)).getHours(),
                            minute = (new Date(data)).getMinutes();
                        if (hour < 10) {
                            hour = '0' + hour;
                        }
                        if (minute < 10) {
                            minute = '0' + minute;
                        }
                        return [hour, minute].join(':');
                    }
                });
            }
        };
    });
    app.directive('dateFullFormat', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModelController) {
                ngModelController.$parsers.push(function(data) {
                    return data;
                });

                ngModelController.$formatters.push(function(data) {
                    if (data) {
                        var year = (new Date(data)).getFullYear(),
                            month = (new Date(data)).getMonth() + 1,
                            day = (new Date(data)).getDate(),
                            hour = (new Date(data)).getHours(),
                            minute = (new Date(data)).getMinutes();
                        if (month < 10) {
                            month = '0' + month;
                        }
                        if (day < 10) {
                            day = '0' + day;
                        }
                        if (hour < 10) {
                            hour = '0' + hour;
                        }
                        if (minute < 10) {
                            minute = '0' + minute;
                        }
                        return [year, month, day].join('-') + ' ' + [hour, minute].join(':');
                    }
                });
            }
        };
    });

    app.directive('showSlide', function() {
        return {
            //restrict it's use to attribute only.
            restrict: 'A',

            //set up the directive.
            link: function(scope, elem, attr) {

                //get the field to watch from the directive attribute.
                var watchField = attr.showSlide;

                //set up the watch to toggle the element.
                scope.$watch(attr.showSlide, function(v) {
                    if (v && !elem.is(':visible')) {
                        elem.slideDown();
                    } else {
                        elem.slideUp();
                    }
                });
            }
        };
    });

    app.directive('resizeToBottom', ['$window',
        function($window) {
            return {
                priority: 1000,
                restrict: 'A',
                scope: {
                    bottom: '@',
                    top: '@',
                },
                link: function($scope, $element, $attrs) {
                    var distance = Number($scope.bottom);

                    distance = distance === null ? 21 : distance;
                    var w = angular.element($window);

                    function resizeToBottom() {
                        if ($element[0].tagName) {
                            $element.css({
                                'height': ''
                            });
                            var windowHeight = w.height(),
                                offsetTop = Number($scope.top) || $element.offset().top,
                                eleHeight = $element.height();
                            if ((eleHeight + offsetTop) < windowHeight) {
                                $element.height(windowHeight - offsetTop - distance);
                            }
                        }
                    }
                    resizeToBottom();
                    w.bind('resize', resizeToBottom);
                }
            }
        }
    ]);

    app.directive('numberFormat', function() {
        return {
            restrict: 'A',
            scope: {
                numberFormat: "@"
            },
            link: function($scope, $ele, $attrs) {
                $scope.$watch('numberFormat', function() {
                    $scope.numberFormat = Number($scope.numberFormat);
                    if ($scope.numberFormat > 99999) {
                        $ele.html(Math.round($scope.numberFormat / 100) / 10 + 'k');
                    } else {
                        $ele.html($scope.numberFormat);
                    }
                });
            }
        };
    });
    app.directive('deltaTime', function() {
        return {
            restrict: 'A',
            scope: {
                deltaTime: "@",
                action: "@"
            },
            link: function($scope, $ele, $attrs) {
                var now = moment();
                var update = moment($scope.deltaTime);
                var action = $scope.action;
                if (!action) {
                    action = '';
                }
                $ele.html(update.from(now) + action);
            }
        };
    });
    app.directive('contactDetailsIcon', function() {
        return {
            restrict: 'A',
            scope: {
                ngModel: "="
            },
            link: function($scope, $ele, $attrs) {
                var className = null;
                switch ($scope.ngModel.category) {
                    case 10:
                        className = 'fa fa-file-text text-primary';
                        break;
                    case 20:
                        className = 'fa fa-paper-plane text-success';
                        break;
                    case 30:
                        className = 'fa fa-comments text-info';
                        break;
                    case 40:
                        className = 'fa fa-envelope text-warning';
                        break;
                    case 50:
                        className = 'fa fa-list text-danger';
                        break;
                }
                $ele.addClass(className)
            }
        }
    });

    // id为必须传入属性
    app.directive('countUp', function() {
        return {
            restrict: 'A',
            require: "ngModel",
            scope: {
                ngModel: "="
            },
            link: function($scope, $ele, $attrs) {
                var animationLength, numDecimals;
                numDecimals = 0;
                animationLength = 4;
                if (($attrs.numDecimals != null) && $attrs.numDecimals >= 0) {
                    numDecimals = $attrs.numDecimals;
                }
                if (($attrs.animationLength != null) && $attrs.animationLength > 0) {
                    animationLength = $attrs.animationLength;
                }
                return $scope.$parent.$watch($attrs.ngModel, function(newVal, oldVal) {
                    if (oldVal == null) {
                        oldVal = 0;
                    }
                    if (newVal == null) {
                        newVal = 0;
                    }
                    if (newVal != null) {
                        return new countUp($attrs.id, oldVal, newVal, numDecimals, animationLength).start();
                    }
                });
            }
        }
    });
    app.directive('historyMonth', ['$timeout',
        function($timeout) {
            return {
                restrict: 'A',
                scope: {
                    historyMonth: '@',
                    topHistory: '='
                },
                link: function($scope, $ele, $attrs) {
                    var flag = false,
                        offsets = [],
                        targets = [],
                        activeTarget = null;

                    function setScrollTops() {
                        offsets = [];
                        _.forEach($ele.find('.history-item .month'), function($item, $index) {
                            var target = $($item).parent();
                            targets.push(target);
                            if (!$index) {
                                offsets.push(0);
                            } else {
                                offsets.push(target.position().top);
                            }
                        });
                        activeTarget = targets[0];
                    }

                    function setMonth(activeTarget) {
                        $scope.topHistory = {
                            month: activeTarget.find('.month').text(),
                            year: activeTarget.find('.year').text(),
                        }
                        $scope.$apply();
                    }
                    $scope.$watch('historyMonth', function(newValue, oldValue, scope) {
                        if (!_.isEmpty(newValue)) {
                            // 保证月份的DOM已经出现
                            $timeout(function() {
                                setScrollTops();
                            }, 500);
                        }
                    }, true);
                    $ele.on('scroll', function() {
                        if (!flag) {
                            setScrollTops();
                            flag = true;
                        }
                        var scrollTop = $ele.scrollTop();
                        _.reduce(offsets, function(before, after, index) {
                            if (scrollTop >= before && scrollTop < after) {
                                activeTarget = targets[index - 1];
                                setMonth(activeTarget);
                            }
                            return after;
                        }, 0)

                        if (scrollTop > offsets[offsets.length - 1]) {
                            activeTarget = targets[offsets.length - 1];
                            setMonth(activeTarget);
                        }
                    });

                }
            }
        }
    ]);

    /**
     * 图片裁剪遮罩层
     *
     */
    app.directive('globalMask', ['config', '$rootScope',
        function(config, $rootScope) {
            var events = config.EVENTS;
            return {
                restrict: 'A',
                link: function($scope, $ele, $attrs) {
                    $rootScope.$on(events.pgImageClick, function(event, data) {
                        if (data.action === 'editPgImage') {
                            showMask();
                        }
                    });
                    $rootScope.$on(events.imageCropClick, function(event, data) {
                        if (data.action === 'cancel' || data.action === 'save') {
                            hideMask();
                        }
                    });

                    function showMask() {
                        $ele.css({
                            opacity: 0,
                            display: 'block'
                        });
                        $ele.animate({
                            opacity: 1
                        }, 300, 'swing', function() {});
                    }

                    function hideMask() {
                        $ele.animate({
                            opacity: 0
                        }, 300, 'swing', function() {
                            $ele.hide();
                        });
                    }
                    $ele.click(function(event) {
                        $scope.$emit(events.globalMaskClick, {
                            action: 'cancel'
                        });
                        event.preventDefault();
                        event.stopPropagation();
                    });

                }
            }
        }
    ]);

    /**
     * 图片预加载
     *
     */
    app.directive('imageOverrun', function() {
        return {
            restrict: 'A',
            scope: {
                'imageOverrun': '@'
            },
            link: function($scope, $ele, $attrs) {
                $ele.addClass('image-loading');
                $ele.attr('src', '/images/img-loading.gif');
                var attempt = 3;

                function load() {
                    var image = new Image();
                    image.src = $scope.imageOverrun;
                    image.onload = function() {
                        $ele.removeClass('image-loading');
                        $ele.attr('src', $scope.imageOverrun);
                    }
                    image.onerror = function() {
                        console.log('err');
                        if (attempt > 0) {
                            attempt--;
                            load();
                        }
                    }
                }
                load();
            }
        }
    });

    app.directive('positiveNumbersOnly', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.unshift(function(inputValue) {
                    if (_.isEmpty(inputValue)) return;

                    if (_.isString(inputValue)) {
                        var transformedInput = Number(inputValue.replace(/[^0-9+.]/g, ''));
                        if (transformedInput !== inputValue) {
                            modelCtrl.$setViewValue(transformedInput);
                            modelCtrl.$render();
                        }
                        return transformedInput;
                    } else {
                        return inputValue;
                    }
                });
            }
        };
    });

    app.directive('numbersOnly', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.unshift(function(inputValue) {
                    if (_.isEmpty(inputValue)) return;


                    if (_.isString(inputValue) && inputValue.indexOf('-') !== 0) {
                        var transformedInput = Number(inputValue.replace(/[^0-9+.]/g, ''));
                        if (transformedInput !== inputValue) {
                            modelCtrl.$setViewValue(transformedInput);
                            modelCtrl.$render();
                        }
                        return transformedInput;
                    } else {
                        return inputValue;
                    }
                });
            }
        };
    });



});
