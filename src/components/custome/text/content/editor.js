define([
    'app'
], function(app) {
    var doc = document,
        editor = {
            excute: function(key, val) {
                try {
                    return doc.execCommand(key, false, val);
                } catch (error) {
                    console.log("command excute error or broswer not support: " + error.message);
                }
            },
            valueCommands: ["fontName", "fontSize", "foreColor", "backColor", "createLink"],
            statCommands: ["bold", "italic", "underline", "justifyCenter", "justifyFull", "justifyLeft", "justifyRight", "strikeThrough"],
            commandCoverter: function(key) {
                var _key = key;
                if ("fontColor" === key) {
                    _key = 'foreColor';
                }
                return _key;
            },
            commandState: function(key) {
                var commandActionName,
                    key = this.commandCoverter(key);
                if (this.valueCommands.indexOf(key)) {
                    commandActionName = "queryCommandValue";
                } else if (this.statCommands.indexOf(key)) {
                    commandActionName = "queryCommandState";
                }
                return document[commandActionName](key);
            },
            getFontSize: function() {
                var range = this.getRange();
                if (range.startContainer && range.startContainer.parentElement) {
                    var $prtElem = $(range.startContainer.parentElement);
                    if ($prtElem.attr('size')) {
                        return $prtElem.attr('size');
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            },
            getRange: function() {
                var range, selection;
                selection = this.getSelection();
                if (selection && selection.getRangeAt) {
                    range = selection.getRangeAt(0);
                } else {
                    range = document.createRange();
                    range.setStart(selection.anchorNode, selection.anchorOffset);
                    range.setEnd(selection.focusNode, selection.focusOffset);
                }
                return range;
            },
            getSelectionString: function() {
                var selectionStr,
                    selection = this.getSelection();
                if (window.getSelection) {
                    return selection.toString();
                } else {
                    return selection.text;
                }
            },
            getRangeNode: function() {
                var endContainer, range, startContainer,
                    range = this.getRange();
                if (range) {
                    startContainer = range.startContainer;
                    endContainer = range.endContainer;
                    return (startContainer, endContainer);
                } else {
                    return null;
                }
            },
            getSelection: function() {
                var selection;
                if (window.getSelection) {
                    selection = window.getSelection();
                } else if (document.selection) {
                    selection = document.selection.createRange();
                }
                return selection;
            },
            moveStart: function() {
                var range = this.getRange();
                return range.setStart ? range.setStart() : range.moveStart ? range.moveStart() : void 0
            },
            moveEnd: function() {
                var range = this.getRange();
                return range.setEnd ? range.setEnd() : range.moveEnd ? range.moveEnd() : void 0
            },
            selectAll: function() {
                return this.excute("selectAll");
            },
            fontName: function(val) {
                return this.excute("fontName", val);
            },
            fontSize: function(val) {
                return this.excute("fontSize", val);
            },
            bold: function() {
                return this.excute("bold");
            },
            italic: function() {
                return this.excute("italic");
            },
            underline: function() {
                return this.excute("underline");
            },
            fontColor: function(val) {
                var key;
                return key = this.commandCoverter("fontColor"), this.excute(key, val);
            },
            backColor: function(val) {
                var key;
                return key = this.commandCoverter("backColor"), this.excute(key, val);
            },
            justifyCenter: function() {
                return this.excute("justifyCenter");
            },
            justifyFull: function() {
                return this.excute("justifyFull");
            },
            justifyLeft: function() {
                return this.excute("justifyLeft");
            },
            justifyRight: function() {
                return this.excute("justifyRight");
            },
            createLink: function(val) {
                return this.excute("createLink", val);
            },
            unlink: function() {
                return this.excute("unlink");
            },
            removeFormat: function() {
                return this.excute("removeFormat");
            },
            strikeThrough: function() {
                return this.excute("strikeThrough");
            },
            // function foo() {
            // 	var textbox = document.getElementById('target');
            // 	selectText(textbox, 0, 14); //选择前 14 个字符
            // }

        };
    return editor;
});