/**
 * 提示信息
 *
 */
define(['app'], function(app) {
    //modalService to show modal
    app.service('$alert', ['config',
        function(config) {
            var events = config.events,
                idSelecterPrefix = '#',
                blank = ' ',
                classSelecterPrefix = '.',
                errorIcon = '<i class="fa fa-times-circle"></i>',
                successIcon = '<i class="fa fa-check-circle icon-check"></i>',
                alertID = 'alert-snippet',
                closeClass = 'close',
                alerts = {
                    success: {
                        className: 'alert-success',
                        type: 'success'
                    },
                    error: {
                        className: 'alert-danger',
                        type: 'error'
                    },
                    warning: {
                        className: 'alert-warning',
                        type: 'warning'
                    }
                };

            var AlertService = function(options) {
                this.initial(options);
            }
            AlertService.prototype.initial = function(options) {
                var self = this;
                var content = options.content;
                self.setting = options.setting;
                //删除已存在的alert
                $(idSelecterPrefix + alertID).remove();

                self.type = options.type || alerts.success.type;
                var className = alerts.success.className;

                if (options.type === alerts.error.type) {
                    className = alerts.error.className;
                    content = errorIcon + content;
                } else if (options.type === alerts.warning.type) {
                    className = alerts.warning.className;
                } else {
                    content = successIcon + content
                }

                $("body").append('<div class="svs-alert alert ' + className + '" id="' + alertID + '"><button type="button" class="' + closeClass + '" >&times;</button>' + content + '</div>');
                $(idSelecterPrefix + alertID + blank + classSelecterPrefix + closeClass).on('click', function() {
                    self.disappear();
                });

                //成功消息会自动消失
                if (self.type === alerts.success.type || self.type === alerts.warning.type) {
                    setTimeout(function() {
                        if (self.setting && !self.setting.disappear) {

                        } else {
                            self.disappear();
                        }
                        self.removeWarningAndErrorWhenSuccess();
                    }, 2000);
                }
            };

            AlertService.prototype.disappear = function() {
                $(idSelecterPrefix + alertID).fadeOut('normal', function() {
                    $(idSelecterPrefix + alertID).remove();
                });
            };

            AlertService.prototype.removeWarningAndErrorWhenSuccess = function() {

                $(classSelecterPrefix + alerts.warning.className).each(function(item) {
                    $(item).remove();
                })
                $(classSelecterPrefix + alerts.error.className).each(function(item) {
                    $(item).remove();
                })
            };

            this.success = function(msg, options) {
                var alert = new AlertService({
                    type: alerts.success.type,
                    content: msg,
                    setting: options
                });
            };
            this.error = function(msg) {
                var alert = new AlertService({
                    type: alerts.error.type,
                    content: msg
                });
            };
            this.warning = function(msg) {
                var alert = new AlertService({
                    type: alerts.warning.type,
                    content: msg
                });
            };
            //对于hbs产生的alert绑定点击后消失事件
            this.init = function() {
                var $alertSuccess = $(classSelecterPrefix + alerts.success.className),
                    $alertError = $(classSelecterPrefix + alerts.error.className),
                    $alertClose = $(idSelecterPrefix + alertID + blank + classSelecterPrefix + closeClass);
                $alertClose.click(function() {
                    $alertError.fadeOut('normal', function() {
                        $alertError.remove();
                    });
                })
                setTimeout(function() {
                    $alertSuccess.fadeOut('normal', function() {
                        $alertSuccess.remove();
                    });
                }, 2000);
            }
        }
    ]);
});
