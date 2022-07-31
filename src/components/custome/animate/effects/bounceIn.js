(function(DVC) {
    var transform = DVC.transform,
        animate = {};
    $.extend(animate, DVC.animates.base);

    animate.run = function($elem, options) {
        var style = options.style,
            config = options.config,
            distance = options.config.distance || 1000,
            duration = config.duration,
            dir = options.config.dir,
            setStyle = {},
            scaleX = style.scaleX || 1,
            scaleY = style.scaleY || 1,
            x = style.x || transform.getX($elem[0]),
            y = style.y || transform.getY($elem[0]),
            name = this.getAnimationName(scaleX, scaleY, x, y, 'bounceIn' + dir, distance);

        setStyle.opacity = this.getOpacity(style);
        setStyle['-webkit-animation'] = name + ' ' + duration + 's' + " both";
        setStyle.animation = name + ' ' + duration + 's' + " both";
        transform.css($elem[0], setStyle);

        return setTimeout(function() {
            transform.disableAnimation($elem[0]);
            transform.rmKeyFrames($elem[0]);
            return animate.end($elem, options);
        }, duration * 1000);
    };

    animate.initKeyFrames = function($elem, options) {
        var style = options.style,
            distance = options.config.distance || 1000,
            dir = options.config.dir,
            scaleX = style.scaleX || 1,
            scaleY = style.scaleY || 1,
            x = style.x || transform.getX($elem[0]),
            y = style.y || transform.getY($elem[0]),
            name = this.getAnimationName(scaleX, scaleY, x, y, 'bounceIn' + dir, distance);

        if (this.dynamicNames[name]) return;
        this.dynamicNames[name] = 1;

        var scaleStr = 'scaleX(' + scaleX + ') scaleY(' + scaleY + ')',
            rotateZStr = 'rotate(' + style.rotateZ + 'deg)',
            y0 = y,
            y1 = y,
            y2 = y,
            y3 = y,
            x0 = x,
            x1 = x,
            x2 = x,
            x3 = x;

        switch (dir) {
            case 'fromCenter':
                break;
            case 'fromLeft':
                x0 = x - distance;
                x1 = x + 0.0083 * distance;
                x2 = x - 0.005 * distance;
                x3 = x + 0.0017 * distance;
                break;
            case 'fromRight':
                x0 = x + distance;
                x1 = x - 0.0083 * distance;
                x2 = x + 0.005 * distance;
                x3 = x - 0.0017 * distance;
                break;
            case 'fromTop':
                y0 = y - distance;
                y1 = y + 0.0083 * distance;
                y2 = y - 0.005 * distance;
                y3 = y + 0.0017 * distance;
                break;
            case 'fromBottom':
                y0 = y + distance;
                y1 = y - 0.0083 * distance;
                y2 = y + 0.005 * distance;
                y3 = y - 0.0017 * distance;
                break;
            case 'fromLeftTop':
                x0 = x - distance;
                x1 = x + 0.0083 * distance;
                x2 = x - 0.005 * distance;
                x3 = x + 0.0017 * distance;
                y0 = y - distance;
                y1 = y + 0.0083 * distance;
                y2 = y - 0.005 * distance;
                y3 = y + 0.0017 * distance;
                break;
            case 'fromLeftBottom':
                x0 = x - distance;
                x1 = x + 0.0083 * distance;
                x2 = x - 0.005 * distance;
                x3 = x + 0.0017 * distance;
                y0 = y + distance;
                y1 = y - 0.0083 * distance;
                y2 = y + 0.005 * distance;
                y3 = y - 0.0017 * distance;
                break;
            case 'fromRightTop':
                x0 = x + distance;
                x1 = x - 0.0083 * distance;
                x2 = x + 0.005 * distance;
                x3 = x - 0.0017 * distance;
                y0 = y - distance;
                y1 = y + 0.0083 * distance;
                y2 = y - 0.005 * distance;
                y3 = y + 0.0017 * distance;
                break;
            case 'fromRightBottom':
                x0 = x + distance;
                x1 = x - 0.0083 * distance;
                x2 = x + 0.005 * distance;
                x3 = x - 0.0017 * distance;
                y0 = y + distance;
                y1 = y - 0.0083 * distance;
                y2 = y + 0.005 * distance;
                y3 = y - 0.0017 * distance;
                break;
        }

        var keyFrames = '{';
        keyFrames += '0%, 60%, 75%, 90%, 100% {';
        keyFrames += 'transition-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);';
        keyFrames += '}';
        keyFrames += '0% {';
        keyFrames += 'opacity: 0;';
        keyFrames += animate.getCpbTransformStr('translate3d(' + x0 + 'px,' + y0 + 'px,0)');
        keyFrames += '}';
        keyFrames += '60% {';
        keyFrames += 'opacity: 1;';
        keyFrames += animate.getCpbTransformStr('translate3d(' + x1 + 'px,' + y1 + 'px,0)' + ' ' + rotateZStr + ' ' + scaleStr);
        keyFrames += '}';
        keyFrames += '75% {';
        keyFrames += animate.getCpbTransformStr('translate3d(' + x2 + 'px,' + y2 + 'px,0)' + ' ' + rotateZStr + ' ' + scaleStr);
        keyFrames += '}';
        keyFrames += '90% {';
        keyFrames += animate.getCpbTransformStr('translate3d(' + x3 + 'px,' + y3 + 'px,0)' + ' ' + rotateZStr + ' ' + scaleStr);
        keyFrames += '}';
        keyFrames += '100% {';
        keyFrames += animate.getCpbTransformStr('translate3d(' + x + 'px,' + y + 'px,0)' + ' ' + rotateZStr + ' ' + scaleStr);
        keyFrames += '}';
        keyFrames += '}';

        transform.setKeyFrames(name, keyFrames);
        return;
    };

    animate.init = function($elem, options) {
        transform.css($elem[0], {
            opacity: 0
        });
        this.initKeyFrames($elem, options);
    };

    DVC.animates.bounceIn = animate;
}(window.__DVC));