(function(DVC) {
    var animates = {};
    var defaults = {
        fadeIn: {
            fromCenter: 'fadeIn',
            fromLeft: 'fadeIn',
            fromRight: 'fadeIn',
            fromTop: 'fadeIn',
            fromBottom: 'fadeIn',
            fromLeftTop: 'fadeIn',
            fromLeftBottom: 'fadeIn',
            fromRightTop: 'fadeIn',
            fromRightBottom: 'fadeIn',
        },
        moveIn: {
            fromCenter: 'moveIn',
            fromLeft: 'moveIn',
            fromRight: 'moveIn',
            fromTop: 'moveIn',
            fromBottom: 'moveIn',
            fromLeftTop: 'moveIn',
            fromLeftBottom: 'moveIn',
            fromRightTop: 'moveIn',
            fromRightBottom: 'moveIn',
        },
        bounceIn: {
            fromCenter: 'bounceInFromCenter',
            fromLeft: 'bounceIn',
            fromRight: 'bounceIn',
            fromTop: 'bounceIn',
            fromBottom: 'bounceIn',
            fromLeftTop: 'bounceIn',
            fromLeftBottom: 'bounceIn',
            fromRightTop: 'bounceIn',
            fromRightBottom: 'bounceIn',
        },
        rollIn: {
            fromLeft: 'rollIn',
            fromRight: 'rollIn',
            fromTop: 'rollIn',
            fromBottom: 'rollIn'
        },
        pull: {
            toLeft: 'pull',
            toRight: 'pull',
            toTop: 'pull',
            toBottom: 'pull'
        },
        rotate: {
            fromClockwise: 'rotateFromClockwise',
            fromAntiClockwise: 'rotateFromAntiClockwise',
            fromHorizontal: 'rotateFromHorizontal'
        },
        scaleIn: {
            fromBig: 'scaleInFromBig',
            fromSm: 'scaleInFromSm'
        },
        shake: {
            fromHorizontal: 'shakeFromHorizontal',
            fromVertical: 'shakeFromVertical'
        },
        light: {
            fromCenter: 'lightFromCenter'
        },
        particle: {
            fromCenter: 'particle'
        }

    };
    animates.getAnimateType = function(type, dir) {
        if (type && dir && defaults[type] && defaults[type][dir]) {
            return defaults[type][dir];
        } else {
            return null;
        }
    };
    DVC.animates = animates || {};

}(window.__DVC));


(function(DVC) {
    var base = {
            fadeOutTime: 1500,
            dynamicNames: {}
        },
        transform = DVC.transform;

    base.getOpacity = function(style) {
        if (style && style.opacity) {
            return (style.opacity / 100 || 1);
        } else {
            return 1;
        }
    };


    base.getAnimationName = function(scaleX, scaleY, x, y, type, distance) {
        var name;
        if (scaleX === null) {
            scaleX = 1;
        }
        if (scaleY === null) {
            scaleY = 1;
        }
        name = type + '-scaleX-' + parseInt(scaleX) + '-scaleY' + parseInt(scaleY) + '-translateX' + parseInt(x) + '-translateY' + parseInt(y);
        if (distance) {
            name += ('distance' + distance);
        }
        return name;
    };

    //结束
    base.end = function($elem, options) {
        var config = options.config;
        if (config.disappear === 1) {
            if (DVC.env === 'dt') {
                $elem.fadeOut(base.fadeOutTime, function() {
                    $(this)
                        .css({
                            'display': 'initial'
                        });
                });
            } else {
                $elem.addClass('fadeOut animated');
            }
        }
    };
    base.getCpbTransformStr = function(str) {
        return 'transform:' + str + ';' + '-webkit-transform:' + str;
    }
    DVC.animates.base = base;
}(window.__DVC));