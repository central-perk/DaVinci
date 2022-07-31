// 淡入
(function(DVC, $) {
    var transform = DVC.transform,
        animate = {};

    $.extend(animate, DVC.animates.base);

    animate.run = function($elem, options) {
        var style = options.style,
            config = options.config;
        transform.enableAnimation($elem[0], config.duration, "ease");
        transform.css($elem[0], {
            opacity: this.getOpacity(style),
            x: style.x,
            y: style.y
        });
        return setTimeout(function() {
            transform.disableAnimation($elem[0]);
            return animate.end($elem, options);
        }, config.duration * 1000);

    };

    animate.init = function($elem, options) {
        var style = options.style;
        var config = options.config;
        var distance = config.distance || 150;

        var transformOpt = {
            opacity: 0
        };
        switch (config.dir) {
            case 'fromCenter':
                break;
            case 'fromLeft':
                transformOpt.x = style.x - distance;
                break;
            case 'fromRight':
                transformOpt.x = style.x + distance;
                break;
            case 'fromTop':
                transformOpt.y = style.y - distance;
                break;
            case 'fromBottom':
                transformOpt.y = style.y + distance;
                break;
            case 'fromLeftTop':
                transformOpt.x = style.x - distance;
                transformOpt.y = style.y - distance;
                break;
            case 'fromLeftBottom':
                transformOpt.x = style.x - distance;
                transformOpt.y = style.y + distance;
                break;
            case 'fromRightTop':
                transformOpt.x = style.x + distance;
                transformOpt.y = style.y - distance;
                break;
            case 'fromRightBottom':
                transformOpt.x = style.x + distance;
                transformOpt.y = style.y + distance;
                break;
        }

        return transform.css($elem[0], transformOpt);
    };
    DVC.animates.fadeIn = animate;
}(window.__DVC, jQuery));