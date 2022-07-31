define([
    'app'
], function(app) {
    var config = {
        ftFamilyMap: {
            'ft-wryh': {
                val: 'Microsoft YaHei',
                key: 'ft-wryh'
            },
            'ft-st': {
                val: '宋体, SimSun',
                key: 'ft-st'
            },
            'ft-fs': {
                val: '仿宋, 仿宋_gb2312, fangsong_gb2312',
                key: 'ft-fs'
            },
            'ft-kt': {
                val: '楷体, 楷体_GB2312, SimKai',
                key: 'ft-kt'
            },
            'ft-ht': {
                val: '黑体, SimHei',
                key: 'ft-ht'
            },
            'ft-cuisive': {
                val: 'cuisive',
                key: 'ft-cuisive'
            },
            'ft-fantasy': {
                val: 'fantasy',
                key: 'ft-fantasy'
            },
            'ft-helvetica': {
                val: 'helvetica',
                key: 'ft-helvetica'
            },
            'ft-monospace': {
                val: 'monospace',
                key: 'ft-monospace'
            },
            'ft-serif': {
                val: 'serif',
                key: 'ft-serif'
            },
            'ft-sans-serif': {
                val: 'sans-serif',
                key: 'ft-sans-serif'
            }
        },
        ftFamilyList: [{
            value: 'ft-wryh',
            label: '雅黑'
        }, {
            value: 'ft-st',
            label: '宋体'
        }, {
            value: 'ft-fs',
            label: '仿宋'
        }, {
            value: 'ft-kt',
            label: '楷体'
        }, {
            value: 'ft-ht',
            label: '黑体'
        }, {
            value: 'ft-cuisive',
            label: 'cuisive'
        }, {
            value: 'ft-fantasy',
            label: 'fantasy'
        }, {
            value: 'ft-helvetica',
            label: 'helvetica'
        }, {
            value: 'ft-monospace',
            label: 'monospace'
        }, {
            value: 'ft-serif',
            label: 'serif'
        }, {
            value: 'ft-sans-serif',
            label: 'sans-serif'
        }],
        //根据字体数值获取字体关键字
        getFamily: function(font) {
            for (var key in this.ftFamilyMap) {
                if (this.ftFamilyMap[key].val.indexOf(font) > -1) {
                    return this.ftFamilyMap[key].key;
                }
            }
            return 'ft-wryh';
        },
        ftSizeList: [{
            label: '9px',
            value: 1
        }, {
            label: '10px',
            value: 2
        }, {
            label: '11px',
            value: 3
        }, {
            label: '12px',
            value: 4
        }, {
            label: '14px',
            value: 5
        }, {
            label: '16px',
            value: 6
        }, {
            label: '18px',
            value: 7
        }, {
            label: '20px',
            value: 8
        }, {
            label: '24px',
            value: 9
        }, {
            label: '28px',
            value: 10
        }, {
            label: '32px',
            value: 11
        }, {
            label: '36px',
            value: 12
        }, {
            label: '40px',
            value: 13
        }, {
            label: '44px',
            value: 14
        }, {
            label: '48px',
            value: 15
        }, {
            label: '54px',
            value: 16
        }, {
            label: '60px',
            value: 17
        }, {
            label: '66px',
            value: 18
        }, {
            label: '72px',
            value: 19
        }, {
            label: '80px',
            value: 20
        }, {
            label: '88px',
            value: 21
        }, {
            label: '96px',
            value: 22
        }, {
            label: '108px',
            value: 23
        }, {
            label: '120px',
            value: 24
        }, {
            label: '136px',
            value: 25
        }, {
            label: '150px',
            value: 26
        }]
    };

    return config;
});