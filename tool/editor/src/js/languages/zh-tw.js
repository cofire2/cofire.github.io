(function(){
    var factory = function (exports) {
        var lang = {
            name : "zh-tw",
            description : "開源在線Markdown編輯器<br/>A simple markdown doucment online editor.",
            toolbar     : {
                undo             : "撤銷（Ctrl+Z）",
                redo             : "重做（Ctrl+Y）",
                bold             : "粗體",
                del              : "刪除線",
                italic           : "斜體",
                quote            : "引用",
                h1               : "標題1",
                h2               : "標題2",
                h3               : "標題3",
                h4               : "標題4",
                h5               : "標題5",
                h6               : "標題6",
                "list-ul"        : "無序列表",
                "list-ol"        : "有序列表",
                hr               : "横线",
                link             : "链接",
                anchor           : "錨點",
                image            : "圖片",
                code             : "行內代碼",
                "code-block-tab" : "預格式文本 / 代碼塊（縮進風格）",
                "code-block"     : "代碼塊（多語言風格）",
                datetime         : "日期時間",
                watch            : "關閉實時預覽",
                unwatch          : "開啟實時預覽",
                preview          : "全窗口預覽HTML（可按ESC還原）",
                fullscreen       : "全屏（可按ESC還原）",
                clear            : "清空",
                info             : "關於" + exports.title
            },
            buttons : {
                enter  : "確定",
                cancel : "取消"
            },
            dialog : {
                link   : {
                    title    : "添加鏈接",
                    url      : "鏈接地址",
                    urlTitle : "鏈接標題",
                    urlEmpty : "錯誤：請填寫鏈接地址。",
                    titleEmpty : "錯誤：請填寫鏈接標題。"
                },
                anchor : {
                    title    : "添加錨點鏈接",
                    name     : "錨點名稱",
                    url      : "鏈接地址",
                    urlTitle : "鏈接標題",
                    nameEmpty: "錯誤：錨點名稱不能為空。",
                    titleEmpty : "錯誤：請填寫錨點鏈接標題。",
                    urlEmpty : "錯誤：請填寫錨點鏈接地址。"
                },
                image  : {
                    title    : "添加圖片",
                    url      : "圖片地址",
                    link     : "圖片鏈接",
                    alt      : "圖片描述",
                    uploadButton     : "本地上傳",
                    imageURLEmpty    : "錯誤：圖片地址不能為空。",
                    uploadFileEmpty  : "錯誤：上傳的圖片不能為空！",
                    formatNotAllowed : "錯誤：只允許上傳圖片文件，允許上傳的圖片文件格式有："
                },
                tabCodeBlock : {
                    title             : "添加預格式文本或代碼塊", 
                    codeEmptyAlert    : "錯誤：請填寫預格式文本或代碼的內容。"
                },
                codeBlock : {
                    title             : "添加代碼塊",                    
                    selectLabel       : "代碼語言：",
                    selectDefaultText : "請語言代碼語言",
                    otherLanguage     : "其他語言",
                    unselectedLanguageAlert : "錯誤：請選擇代碼所屬的語言類型。",
                    codeEmptyAlert    : "錯誤：請填寫代碼內容。"
                }
            }
        };
        
        exports.defaults.lang = lang;
    };
    
	// CommonJS/Node.js
	if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
    { 
        module.exports = factory;
    }
	else if (typeof define === "function")  // AMD/CMD/Sea.js
    {
		if (define.amd) { // for Require.js

			define(["editormd"], function(editormd) {
                factory(editormd);
            });

		} else { // for Sea.js
			define(function(require) {
                var editormd = require("../editormd");
                factory(editormd);
            });
		}
	} 
	else
	{
        factory(window.editormd);
	}
    
})();