(function(DVC) {
    var transform = DVC.transform,
        animate = {};
    $.extend(animate, DVC.animates.base);

    animate.run = function($elem, options) {
        var style = options.style,
            config = options.config,
            duration = config.duration,
            dir = options.config.dir,
            setStyle = {},
            scaleX = style.scaleX || 1,
            scaleY = style.scaleY || 1,
            x = style.x || transform.getX($elem[0]),
            y = style.y || transform.getY($elem[0]),
            name = this.getAnimationName(scaleX, scaleY, x, y, 'pull' + dir);

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
            dir = options.config.dir,
            w = style.width,
            h = style.height,
            scaleX = style.scaleX || 1,
            scaleY = style.scaleY || 1,
            x = style.x || transform.getX($elem[0]),
            y = style.y || transform.getY($elem[0]),
            name = this.getAnimationName(scaleX, scaleY, x, y, 'pull' + dir);

        if (this.dynamicNames[name]) return;
        this.dynamicNames[name] = 1;

        var scaleStr = 'scaleX(' + scaleX + ') scaleY(' + scaleY + ')',
            rotateZStr = 'rotate(' + style.rotateZ + 'deg)',
            origin = 'top left',
            pfX = parseFloat((1 - scaleX) / 2 * w), // 无负号
            pfY = parseFloat((1 - scaleY) / 2 * h), // 无负号
            scaleX1 = scaleX,
            scaleX2 = scaleX,
            scaleX3 = scaleX,
            scaleX4 = scaleX,
            scaleX5 = scaleX,
            scaleX6 = scaleX,
            scaleY1 = scaleY,
            scaleY2 = scaleY,
            scaleY3 = scaleY,
            scaleY4 = scaleY,
            scaleY5 = scaleY,
            scaleY6 = scaleY;

        switch (dir) {
            case 'toRight':
                scaleX1 = 0.1;
                scaleX2 = scaleX + 0.2;
                scaleX3 = scaleX - 0.2;
                scaleX4 = scaleX + 0.1;
                scaleX5 = scaleX - 0.1;
                scaleX6 = scaleX + 0.1;
                origin = 'center left';
                x = x + pfX;
                break;
            case 'toLeft':
                scaleX1 = 0.1;
                scaleX2 = scaleX + 0.2;
                scaleX3 = scaleX - 0.2;
                scaleX4 = scaleX + 0.1;
                scaleX5 = scaleX - 0.1;
                scaleX6 = scaleX + 0.1;
                origin = 'center right';
                x = x - pfX;
                break;
            case 'toTop':
                scaleY1 = 0.1;
                scaleY2 = scaleY + 0.2;
                scaleY3 = scaleY - 0.2;
                scaleY4 = scaleY + 0.1;
                scaleY5 = scaleY - 0.1;
                scaleY6 = scaleY + 0.1;
                origin = 'bottom center';
                y = y - pfY;
                break;
            case 'toBottom':
                scaleY1 = 0.1;
                scaleY2 = scaleY + 0.2;
                scaleY3 = scaleY - 0.2;
                scaleY4 = scaleY + 0.1;
                scaleY5 = scaleY - 0.1;
                scaleY6 = scaleY + 0.1;
                origin = 'top center';
                y = y + pfY;
                break;
        }

        var keyFrames = '{';
        keyFrames += '0% {';
        keyFrames += 'opacity: ' + animate.getOpacity(style) + ';';
        keyFrames += '-webkit-transform-origin: ' + origin + ';';
        keyFrames += 'transform-origin: ' + origin + ';';
        keyFrames += animate.getCpbTransformStr('translate3d(' + x + 'px,' + y + 'px,0) ' + rotateZStr + ' scaleX(' + scaleX1 + ') scaleY(' + scaleY1 + ')');
        keyFrames += '}';
        keyFrames += '40% {';
        keyFrames += '-webkit-transform-origin: ' + origin + ';';
        keyFrames += 'transform-origin: ' + origin + ';';
        keyFrames += animate.getCpbTransformStr('translate3d(' + x + 'px,' + y + 'px,0) ' + rotateZStr + ' scaleX(' + scaleX2 + ') scaleY(' + scaleY2 + ')');
        keyFrames += '}';
        keyFrames += '60% {';
        keyFrames += '-webkit-transform-origin: ' + origin + ';';
        keyFrames += 'transform-origin: ' + origin + ';';
        keyFrames += animate.getCpbTransformStr('translate3d(' + x + 'px,' + y + 'px,0) ' + rotateZStr + ' scaleX(' + scaleX3 + ') scaleY(' + scaleY3 + ')');
        keyFrames += '}';
        keyFrames += '80% {';
        keyFrames += '-webkit-transform-origin: ' + origin + ';';
        keyFrames += 'transform-origin: ' + origin + ';';
        keyFrames += animate.getCpbTransformStr('translate3d(' + x + 'px,' + y + 'px,0) ' + rotateZStr + ' scaleX(' + scaleX4 + ') scaleY(' + scaleY4 + ')');
        keyFrames += '}';
        keyFrames += '100% {';
        keyFrames += '-webkit-transform-origin: ' + origin + ';';
        keyFrames += 'transform-origin: ' + origin + ';';
        keyFrames += animate.getCpbTransformStr('translate3d(' + x + 'px,' + y + 'px,0) ' + rotateZStr + ' scaleX(' + scaleX5 + ') scaleY(' + scaleY5 + ')');
        keyFrames += '}';
        keyFrames += '80% {';
        keyFrames += '-webkit-transform-origin: ' + origin + ';';
        keyFrames += 'transform-origin: ' + origin + ';';
        keyFrames += animate.getCpbTransformStr('translate3d(' + x + 'px,' + y + 'px,0) ' + rotateZStr + ' scaleX(' + scaleX6 + ') scaleY(' + scaleY6 + ')');
        keyFrames += '}';
        keyFrames += '100% {';
        keyFrames += '-webkit-transform-origin: ' + origin + ';';
        keyFrames += 'transform-origin: ' + origin + ';';
        keyFrames += animate.getCpbTransformStr('translate3d(' + x + 'px,' + y + 'px,0) ' + rotateZStr + ' scaleX(' + scaleX + ') scaleY(' + scaleY + ')');
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

    DVC.animates.pull = animate;
}(window.__DVC));