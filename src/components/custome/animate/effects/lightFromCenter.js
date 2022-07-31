//从左飞入
(function(DVC) {
    var transform = DVC.transform,
        animate = {};

    $.extend(animate, DVC.animates.base);
    animate.run = function($elem, options) {
        var style = options.style,
            config = options.config,
            count = config.count,
            duration = config.duration;
        var setStyle = {};
        setStyle['-webkit-animation'] = 'lightFromCenter ' + duration + 's' + " linear " + count + " both";
        setStyle['animation'] = 'lightFromCenter ' + duration + 's' + " linear " + count + " both";

        transform.css($elem[0], setStyle);
        if (count !== 'infinite' && Number(count) >= 1) {
            if (Number(config.disappear) === 0) { //显示
                setTimeout(function() {
                    transform.disableAnimation($elem[0]);
                }, duration * 1000 * Number(count) + 100);
            }
        }

    };
    animate.initKeyFrames = function() {
        transform.setKeyFrames('lightFromCenter', '{ 0% {opacity: 0;} 50% {opacity: 1;} 100%{opacity: 0;} }');
    }
    animate.init = function($elem, options) {
        var style = options.style;
        transform.disableAnimation($elem[0]);
        this.initKeyFrames();
        return transform.rmKeyFrames($elem[0]);
    };

    DVC.animates.lightFromCenter = animate;
}(window.__DVC));