var unicodeCheck = {

    htmlStrProcessing: function (str,max,isTruncated = false){
        return this.changeSpecialString(this.strProcessing(str,max,isTruncated));
    },

    changeSpecialString: function (str){
        str = str || "";
        str = str.replace("<","&lt;");
        str = str.replace(">","&gt;");
        
        var re1 = new RegExp("<", "g"); 
        str=str.replace(re1,"&lt;");
        var re2 = new RegExp(">", "g");
        str = str.replace(re2,"&gt;");
        return str;
    },

    strProcessing: function (str,max,isTruncated = false){
        var lastStr = "";
        
        if(str)
        {
            if(this.getStrLen(str) < max){
                return str;
            }
            var len = 0;
            for(var i = 0;i < str.length;i++){
                len += this.searchUnicode(str.charAt(i));
                if(len <= max){
                    lastStr += str.charAt(i);
                }else {
                    if(isTruncated){
                        lastStr += "...";
                    }
                    break;
                }
            }
        }
        return lastStr;
    },

    getStrLen: function (str){
        if(!str){
            return 0;
        }
        var len = 0;
        for(var i = 0;i < str.length;i++){
            len += this.searchUnicode(str.charAt(i));
            
        }
        return len;
    },
    
    searchUnicode: function (str){
        var len = 0;
        if(str)
        {
            var unicode = str.charCodeAt();
            //0x21~0x7e  数字，字符，字母 0x41~0x5A 大写字母
            //if(unicode >= 0x21 && unicode <= 0x7e){
            if((unicode >= 0x21 && unicode < 0x41) || (unicode > 0x5A && unicode <= 0x7e)){
                len = 1;
            }else{
                len = 2;
            }
        }
        return len;
    }
}

export default unicodeCheck;