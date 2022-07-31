/**
 *  通用的过滤器
 *
 */
define([
    'app',
    'pages/account/setting/config'
], function(app, actSettingConfig) {
    //`dateDisplay` transform the data to the formater of `yyyy-MM-dd HH:mm`

    var snippets = {
        empty: ''
    };
    app.filter('dateDisplay', ['$filter',
        function($filter) {
            var standardDateFilterFn = $filter('date');
            return function(data) {
                if (data == null || data == '') {
                    return snippets.empty;
                } else {
                    return standardDateFilterFn(data, 'yyyy-MM-dd HH:mm');
                }
            };
        }
    ]);

    app.filter('dayDisplay', ['$filter',
        function($filter) {
            var standardDateFilterFn = $filter('date');
            return function(data) {
                if (data == null || data == '') {
                    return snippets.empty;
                } else {
                    return standardDateFilterFn(data, 'yyyy-MM-dd');
                }
            };
        }
    ]);

    app.filter('cnDayDisplay', ['$filter',
        function($filter) {
            var standardDateFilterFn = $filter('date');
            return function(data) {
                if (data == null || data == '') {
                    return null;
                } else {
                    return standardDateFilterFn(data, 'yyyy年M月dd日');
                }
            };
        }
    ]);

    app.filter('flyerPermission', function() {
        return function(data) {
            if (data === 10) {
                return '公开';
            }
            if (data === 20) {
                return '加密';
            }
            if (data === 30) {
                return '私密';
            }
        };
    });



    app.filter('flyerStatus', function() {
        return function(data) {
            if (data === 10) {
                return '草稿';
            }
            if (data === 20) {
                return '已发布';
            }
            if (data === 30) {
                return '待更新';
            }
        };
    });

    app.filter('tplStatus', function() {
        return function(data) {
            if (data === 10) {
                return '草稿';
            }
            if (data === 20 || data === 60) {
                return '待审核';
            }
            if (data === 30) {
                return '已上架';
            }
            if (data === 40) {
                return '已下架';
            }
            if (data === 50) {
                return '审核失败';
            }
        };
    });

    app.filter('userStatus', function() {
        return function(data) {
            if (data === 10) {
                return '未激活';
            }
            if (data === 20) {
                return '正常';
            }
            if (data === 30) {
                return '禁用';
            }
        };
    });

    app.filter('plan', function() {
        return function(data) {
            if (data === 10) {
                return '大众版';
            }
            if (data === 20) {
                return '标准版';
            }
            if (data === 30) {
                return '商务版';
            }
            if (data === 40) {
                return '企业版';
            }
        };
    });
    app.filter('toFixed', function() {
        return function(data) {
            var _val = 2;
            if (data >= 0) {
                return data.toFixed(_val);
            } else if (data < 0) {
                return data.toFixed(_val);
            }
        };
    });


    app.filter('btnUpgradeName', function() {
        return function(data) {
            if (data == null || data == 1) {
                return '升级';
            } else {
                return '续费或升级';
            }
        };
    });


    //消息发送者名称
    app.filter('senderDisplay', function() {
        return function(data) {
            var name;
            switch (data) {
                case 1:
                    name = '系统消息';
                    break;
                case 2:
                    name = '用户消息';
                    break;
                case 3:
                    name = '管理员消息';
                    break;
                case 4:
                    name = '论坛消息';
                    break;
                case 5:
                    name = '私信消息';
                    break;
                default:
                    name = '系统消息';
                    break;
            }
            return name;
        };
    });

    //`dateDisplay` transform the data to `暂无` when the data is null or ``
    app.filter('emptyFilter', function() {
        return function(data) {
            if (data == null || data == '') {
                return snippets.empty;
            } else {
                return data;
            }
        };
    });


    //`truncate`
    app.filter('truncate', function() {

        return function(text, length, end) {
            if (isNaN(length))
                length = 10;

            if (end === undefined)
                end = "...";

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            } else {
                return String(text).substring(0, length - end.length) + end;
            }
        };

    });

    app.filter('numberSign', function() {
        return function(data) {
            if (data > 0) {
                return '+' + data;
            } else if (data === 0) {
                return data;
            } else {
                return data;
            }
        };
    });

    app.filter('timeStamps', function() {
        return function(data) {
            return new Date(data).getTime();
        };
    });

    //通过文件名获取页面布局class
    app.filter('layoutFilter', function() {
        return function(data) {
            return data.split('.')[0];
        };
    });

    app.filter('genderRespect', function() {
        return function(data) {
            if (data === '男') {
                return '先生';
            } else if (data === '女') {
                return '女士';
            }
        };
    });

    app.filter('industryName', ['config', function(config) {
        return function(data) {
            var _industrys = config.CONTACTS.industrys;
            for (var i = _industrys.length - 1; i >= 0; i--) {
                if (data === _industrys[i].key) {
                    return _industrys[i].value;
                }
            }
            return null;
        };
    }]);
    app.filter('reportCategory', ['config',
        function(config) {
            return function(data) {
                var _reports = config.REPORT.categoryName,
                    categoryName = '';
                _.each(_reports, function(value, key) {
                    if (data == key) {
                        categoryName = value;
                    }
                });
                return categoryName || '其他';
            };
        }
    ]);
    app.filter('month', function() {
        return function(data) {
            return moment(data).format('MMMM');
        };
    });
    app.filter('week', function() {
        return function(data) {
            return moment(data).format('dddd');
        };
    });
    app.filter('year', function() {
        return function(data) {
            return moment(data).format('YYYY');
        };
    });

    app.filter('flyerTag', ['config', function(config) {
        var tags = config.TEMPLATES.tags;
        return function(data) {
            if (data instanceof Array) {
                var result = [];
                for (var i = 0; i < 1; i++) {
                    var obj = _.find(tags, {
                        tag: data[i]
                    });
                    result.push((obj && obj.name) || '其他行业');
                }
                return result.join(',');
            } else {
                var obj = _.find(tags, {
                    tag: data
                });
                return (obj && obj.name) || '其他行业';
            }

        };
    }]);

    app.filter('userInfo', function() {
        return function(data) {
            return data || '未填写';
        };
    });

    app.filter('userGender', function() {
        return function(data) {
            if (data != null) {
                return actSettingConfig.gender[data].label;
            }
            return '';
        };
    });

    app.filter('userEducation', function() {
        return function(data) {
            if (data != null) {
                return actSettingConfig.edu[data].label;
            }
            return '';
        };
    });

    app.filter('userHometown', function() {
        return function(data, place) {
            if (!place) {
                console.log('缺少参数');
                return '';
            }
            if (data[place + 'Province'] != null) {
                var province = actSettingConfig.province[data[place + 'Province']],
                    city = province.city[data[place + 'City']];
                return province.label + '-' + city.label;
            }
            return '';
        };
    });


});