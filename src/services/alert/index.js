/**
 * 提示信息
 *
 */
define(['app'], function(app) {
    //modalService to show modal
    app.service('$alert', ['config', 'growl',
        function(config, growl) {

            this.success = function(msg) {
                growl.addSuccessMessage(msg);
            };
            this.error = function(msg) {
                growl.addErrorMessage(msg);
            };
            //对于hbs产生的alert绑定点击后消失事件
            this.init = function() {
                var self = this;
                $('.global-msg').each(function(index,item) {
                    var msg = $(item).val(),
                        type = $(item).data('type');
                    if (type === 'success') {
                        self.success(msg);
                        $(item).remove();
                    } else if (type === 'error') {
                        self.error(msg);
                        $(item).remove();
                    }
                });
            };
        }
    ]);
});