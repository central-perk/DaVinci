//逆时针旋转
(function(DVC) {
    var transform = DVC.transform,
        animate,
        rotateStart,
        rotateEnd,
        name,
        stdScale,
        scaleStr,
        translateStr;

    animate = {};
    $.extend(animate, DVC.animates.base);
    animate.run = function($elem, options) {
        var style = options.style,
            config = options.config,
            duration = config.duration,
            count = config.count,
            setStyle = {},
            scaleX = style.scaleX,
            scaleY = style.scaleY,
            x = style.x,
            y = style.y;
        scaleX = scaleX ? scaleX : 1,
            scaleY = scaleY ? scaleY : 1,
            x = x ? x : transform.getX($elem[0]),
            y = y ? y : transform.getY($elem[0]),
            name = this.getAnimationName(scaleX, scaleY, x, y, 'rotateFromAntiClockwise');

        if (duration === null) {
            duration = 10;
        }


        setStyle['-webkit-transform-origin'] = '50% 50%';
        setStyle['-webkit-animation'] = name + ' ' + duration + 's' + " linear " + count;
        setStyle['animation'] = name + ' ' + duration + 's' + " linear " + count;

        transform.css($elem[0], setStyle);
        if (count !== 'infinite' && Number(count) >= 1) {
            if (Number(config.disappear) === 1) {
                setTimeout(function() {
                    return animate.end($elem, options);
                }, duration * 1000 * Number(count) + 100);
            }
        }
        return;
    };

    animate.initKeyFrames = function($elem, options) {
        var style = options.style,
            scaleX = style.scaleX,
            scaleY = style.scaleY,
            x = style.x,
            y = style.y;
        scaleX = scaleX ? scaleX : 1;
        scaleY = scaleY ? scaleY : 1;

        x = x ? x : transform.getX($elem[0]);
        y = y ? y : transform.getY($elem[0]);
        name = this.getAnimationName(scaleX, scaleY, x, y, 'rotateFromAntiClockwise');
        if (this.dynamicNames[name]) {
            return;
        };
        this.dynamicNames[name] = 1;

        translateStr = 'translate(' + x + 'px, ' + y + 'px)';
        //起始弧度
        rotateStart = style.rotateZ || 0;
        rotateEnd = rotateStart - 360;
        stdScale = Math.min(scaleX, scaleY);
        scaleStr = 'scaleX(' + stdScale + ') scaleY(' + stdScale + ')';

        var keyFrames = '{ 0% {' + animate.getCpbTransformStr(translateStr +
                ' rotate(' + rotateStart + 'deg) ' + scaleStr) + '}' +
            ' 100% {' + animate.getCpbTransformStr(translateStr +
                ' rotate(' + rotateEnd + 'deg) ' + scaleStr) + '}}';
        return transform.setKeyFrames(name, keyFrames);
    };

    animate.init = function($elem, options) {
        var style = options.style,
            sx = style.scaleX,
            sy = style.scaleY,
            s = Math.min(sx, sy);

        transform.css($elem[0], {
            scaleX: s,
            scaleY: s
        });
        transform.disableAnimation($elem[0]);
        this.initKeyFrames($elem, options);
        return transform.rmKeyFrames($elem[0]);
    };

    DVC.animates.rotateFromAntiClockwise = animate;
}(window.__DVC || {}));