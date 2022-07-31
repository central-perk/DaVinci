define(['app'], function(app) {
    app.directive('qrBlock', function() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/modules/qr-block/index.html',
            scope: {
                link: '@',
                color: '@',
                logo: '@',
                size: '@',
                hideLogo: '@',
                title: '@'
            },
            link: function($scope, $ele, $attrs) {
                var $qrCode = $ele.find('.qr-code'),
                    $qrLogo = $ele.find('.qr-logo'),
                    qrCodeSize = Number($scope.size) || 120,
                    qrLogoSize = qrCodeSize / 4,
                    qrCodeColor = $scope.color,
                    qrCodeLink = $scope.link;
                $ele.width(qrCodeSize)
                    .height(qrCodeSize);
                $qrLogo.width(qrLogoSize)
                    .height(qrLogoSize)
                    .css({
                        'margin-top': (-qrLogoSize / 2) + 'px',
                        'margin-left': (-qrLogoSize / 2) + 'px',
                    });

                $scope.$watchCollection('[link, color]', function(newValues, oldValues) {
                    if (!newValues) return;
                    var qrCodeLink = newValues[0],
                        qrCodeColor = newValues[1] || '#000';
                    if (qrCodeLink && qrCodeColor) {
                        $qrCode.empty();

                        $qrCode.qrcode({
                            render: "canvas",
                            width: qrCodeSize,
                            height: qrCodeSize,
                            foreground: qrCodeColor,
                            text: qrCodeLink
                        });
                    }
                });

                $scope.$on('$destroy', function() {
                    $qrCode.empty();
                    $qrLogo = null;
                });
            }
        };
    });
});
