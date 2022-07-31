var Share = function(options) {
    var share_url = options.flyerLink,
        dvcMark = options.hidePopularize ? '' : '—来自Davinci ',
        flyerTitle = '「' + (options.flyerTitle || document.title.split('|')[0]) + '」';
    share_text = flyerTitle + dvcMark + share_url,
        share_img = options.flyerCover,
        share_base_link = {
            sweibo: 'http://service.weibo.com/share/share.php?searchPic=false&',
            tweibo: 'http://share.v.t.qq.com/index.php?c=share&a=index&',
            qzone: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?',
            db: 'http://www.douban.com/share/service?',
            qq: 'http://connect.qq.com/widget/shareqq/index.html?'
        },
        share_link = {
            sweibo: makeQuery({
                url: share_url,
                title: flyerTitle + dvcMark,
                pic: share_img
            }),
            tweibo: makeQuery({
                url: share_url,
                title: flyerTitle + dvcMark,
                pic: share_img
            }),
            qzone: makeQuery({
                title: share_text,
                pics: share_img,
                url: share_url + '?type=1'
            }),
            db: makeQuery({
                href: share_url,
                text: share_text,
                image: share_img
            }),
            qq: makeQuery({
                url: share_url,
                // title: 'Davinci',
                summary: share_text,
                pics: share_img
            })
        };

    function makeQuery(options) {
        var temp = '';
        for (var key in options) {
            temp += '&' + key + '=' + options[key];
        }
        return temp.slice(1);
    }

    $().ready(function() {
        for (var key in share_link) {
            (function(key) {
                share_link[key] = share_base_link[key] + share_link[key];
                $('.share-' + key).on('click', function() {
                    window.open(share_link[key]);
                });
            })(key);
        }
        for (var key in share_link) {
            (function(key) {
                share_link[key] = share_base_link[key] + share_link[key]
                $ele.on('click', '.share-' + key, function() {
                    window.open(share_link[key])
                });
            })(key);
        }
        $('.share-output').qrcode({
            render: "canvas",
            width: 200,
            height: 200,
            text: share_url
        });

        if ($('.share-qr').length) {
            $('.share-qr').fancybox({
                padding: 5,
                title: '用手机扫描二维码，分享到朋友圈'
            });
        }


        $('.share-email').attr('href', 'mailto:?body=' + share_text);
        $('.share-sms').attr('href', 'sms:?body=' + share_text);

        // 显示微信分享
        $('.share-weixin').on('click', function() {
            $(".m-share-body").css('bottom', '-300px');
            $('.share-weixin-img').show();
        });
        // 隐藏微信分享
        $('.share-weixin-img').on('click', function() {
            $(".m-share-grid").animate({
                opacity: 0
            }, 300, 'swing', function() {
                $('.share-weixin-img').hide();
                $(".m-share").hide();
            });
        });

        $('.share-qr').on('click', function() {
            // 隐藏分享涂层
            $(".m-share-grid").css('opacity', 0);
            $(".m-share-body").css('bottom', '-300px');
            $(".m-share").hide();
        });

        // 显示分享涂层
        $('.m-share-icon').on('click', function() {
            $(".m-share-grid").css('opacity', 0);
            $(".m-share-body").css('bottom', '-300px');
            $(".m-share").show();
            $(".m-share-grid").animate({
                opacity: 0.4
            }, 500);
            $(".m-share-body").animate({
                bottom: 0
            }, 500, 'swing');
        });
        // 隐藏分享涂层
        $('.m-share-grid, .share-close').on('click', function() {
            $(".m-share-grid").animate({
                opacity: 0
            }, 300);
            $(".m-share-body").animate({
                bottom: '-300px'
            }, 300, 'swing', function() {
                $('.share-weixin-img').hide();
                $(".m-share").hide();
            });
        });
    });
}