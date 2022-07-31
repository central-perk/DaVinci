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
            name = this.getAnimationName(scaleX, scaleY, x, y, 'rollIn' + dir, distance);

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
            name = this.getAnimationName(scaleX, scaleY, x, y, 'rollIn' + dir, distance);

        if (this.dynamicNames[name]) return;
        this.dynamicNames[name] = 1;


        var scaleStr = 'scaleX(' + scaleX + ') scaleY(' + scaleY + ')',
            rotateZStr = 'rotate(' + style.rotateZ + 'deg)',
            rotateDegNum = 160,
            x1 = x,
            y1 = y;

        switch (dir) {
            case 'fromLeft':
                x1 = x - 200;
                rotateDeg = '-160deg';
                break;
            case 'fromRight':
                x1 = x + 200;
                rotateDeg = '160deg';
                break;
            case 'fromTop':
                y1 = y - 300;
                rotateDeg = '-160deg';
                break;
            case 'fromBottom':
                y1 = y + 300;
                rotateDeg = '160deg';
                break;
        }

        var keyFrames = '{';
        keyFrames += '0% {';
        keyFrames += 'opacity: 0;';
        keyFrames += animate.getCpbTransformStr('translate3d(' + x1 + 'px,' + y1 + 'px,0) rotate3d(0,0,1,' + rotateDeg + ') ' + rotateZStr + ' ' + scaleStr);
        keyFrames += '}';
        keyFrames += '100% {';
        keyFrames += 'opacity: ' + animate.getOpacity(style) + ';';
        keyFrames += animate.getCpbTransformStr('translate3d(' + x + 'px,' + y + 'px,0) ' + rotateZStr + ' ' + scaleStr);
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

    DVC.animates.rollIn = animate;
}(window.__DVC));