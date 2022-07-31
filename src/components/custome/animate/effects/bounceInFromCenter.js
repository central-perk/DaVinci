//缩放从大到小
(function(DVC) {
    var transform = DVC.transform,
        animate = {},
        name,
        rotateZStr,
        scale0,
        scale10,
        scale5,
        scale7,
        translateStr;

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
        scaleX = scaleX ? scaleX : 1,
            scaleY = scaleY ? scaleY : 1,
            x = x ? x : transform.getX($elem[0]),
            y = y ? y : transform.getY($elem[0]),
            name = this.getAnimationName(scaleX, scaleY, x, y, 'bounceInFromCenter');
        setStyle.opacity = this.getOpacity(style);
        setStyle['-webkit-animation'] = name + ' ' + duration + 's' + " backwards";
        setStyle['animation'] = name + ' ' + duration + 's' + " backwards";
        transform.css($elem[0], setStyle);

        return setTimeout(function() {
            transform.disableAnimation($elem[0]);
            transform.rmKeyFrames($elem[0]);
            return animate.end($elem, options);
        }, duration * 1000);
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

        name = this.getAnimationName(scaleX, scaleY, x, y, 'bounceInFromCenter');
        if (this.dynamicNames[name]) {
            return;
        };
        this.dynamicNames[name] = 1;

        scale0 = 'scaleX(' + (scaleX * 0.3) + ') scaleY(' + (scaleY * 0.3) + ')';
        scale5 = 'scaleX(' + (scaleX * 1.05) + ') scaleY(' + (scaleY * 1.05) + ')';
        scale7 = 'scaleX(' + (scaleX * 0.9) + ') scaleY(' + (scaleY * 0.9) + ')';
        scale10 = 'scaleX(' + (scaleX * 1) + ') scaleY(' + (scaleY * 1) + ')';
        translateStr = 'translateX(' + x + 'px) translateY(' + y + 'px)';
        rotateZStr = 'rotate(' + style.rotateZ + 'deg)';
        var keyFrames = '{ 0%{opacity:0; ' + animate.getCpbTransformStr(translateStr + ' ' + rotateZStr + ' ' +
                scale0) +
            ';} 50%{opacity:1;' + animate.getCpbTransformStr(translateStr + ' ' + rotateZStr + ' ' + scale5) +
            ';} 70%{' + animate.getCpbTransformStr(translateStr + ' ' + rotateZStr + ' ' + scale7) +
            ';} 100%{' + animate.getCpbTransformStr(translateStr + ' ' + rotateZStr + ' ' + scale10) + ';} }';
        return transform.setKeyFrames(name, keyFrames);
    };
    animate.init = function($elem, options) {

        transform.css($elem[0], {
            opacity: 0
        });
        this.initKeyFrames($elem, options);
    };

    DVC.animates.bounceInFromCenter = animate;
})(window.__DVC);