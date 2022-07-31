//上下抖动
(function(DVC) {
    var transform = DVC.transform,
        animate = {},
        name, rotateZStr,
        scaleX, scale, y1, y2;

    $.extend(animate, DVC.animates.base);

    animate.run = function($elem, options) {
        var style = options.style,
            config = options.config,
            duration = config.duration,
            setStyle = {},
            scaleX = style.scaleX,
            scaleY = style.scaleY,
            x = style.x,
            y = style.y;
        if (duration === null) {
            duration = 1;
        }
        scaleX = scaleX != null ? scaleX : 1;
        scaleY = scaleY != null ? scaleY : 1;
        name = this.getAnimationName(scaleX, scaleY, x, y, 'shakeFromVertical');
        setStyle['-webkit-animation'] = name + ' ' + duration + 's backwards';
        setStyle['animation'] = name + ' ' + duration + 's backwards';
        transform.css($elem[0], setStyle);
        return setTimeout(function() {
            transform.rmKeyFrames($elem[0]);
            transform.disableAnimation($elem[0]);
            return animate.end($elem, options);
        }, duration * 1000);
    };
    animate.initKeyFrames = function($elem, options) {
        var style = options.style,
            x = style.x,
            y = style.y,
            scaleX = style.scaleX,
            scaleY = style.scaleY;

        scaleX = scaleX ? scaleX : 1,
            scaleY = scaleY ? scaleY : 1,

            name = this.getAnimationName(scaleX, scaleY, x, y, 'shakeFromVertical');
        if (this.dynamicNames[name]) {
            return;
        };
        this.dynamicNames[name] = 1;

        y1 = y - 10;
        y2 = y + 10;
        scaleStr = 'scaleX(' + scaleX + ') scaleY(' + scaleY + ')';
        rotateZStr = 'rotate(' + style.rotateZ + 'deg)';
        var keyFrames = '{' +
            '0%, 100% {' + animate.getCpbTransformStr('translate3d(' + x + 'px, ' + y + 'px, 0)' + ' ' + rotateZStr + ' ' + scaleStr) +
            '}' +
            '10%, 30%, 50%, 70%, 90% {' + animate.getCpbTransformStr('translate3d(' + x + 'px, ' + y1 + 'px, 0)' + ' ' + rotateZStr + ' ' + scaleStr) +
            '}' +
            '20%, 40%, 60%, 80% {' + animate.getCpbTransformStr('translate3d(' + x + 'px, ' + y2 + 'px, 0)' + ' ' + rotateZStr + ' ' + scaleStr) +
            '}}';
        return transform.setKeyFrames(name, keyFrames);
    }

    animate.init = function($elem, options) {
        this.initKeyFrames($elem, options);
        return transform.rmKeyFrames($elem[0]);
    };

    DVC.animates.shakeFromVertical = animate;
})(window.__DVC);