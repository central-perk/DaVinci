//缩放从大到小
(function(DVC) {
    var transform = DVC.transform,
        animate = {};

    $.extend(animate, DVC.animates.base);
    animate.run = function($elem, options) {
        var style = options.style,
            config = options.config,
            duration = config.duration;

        transform.enableAnimation($elem[0], duration, "ease-in");
        transform.css($elem[0], {
            scaleX: style.scaleX || 1,
            scaleY: style.scaleY || 1,
            opacity: this.getOpacity(style)
        });
        return setTimeout(function() {
            transform.disableAnimation($elem[0]);
            return animate.end($elem, options);
        }, duration * 1000);
    };

    animate.init = function($elem, options) {
        var style = options.style;
        return transform.css($elem[0], {
            opacity: 0,
            scaleX: Number(style.scaleX || 1) / 2,
            scaleY: Number(style.scaleY || 1) / 2
        });
    };
    DVC.animates.scaleInFromSm = animate;
}(window.__DVC));