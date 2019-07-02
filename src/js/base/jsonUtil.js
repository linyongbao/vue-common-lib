var jsonUtil = {
    decode:function(str){
        if(str){
         str = str.replace(/\n/g, "").replace(/\r/g, "");//去掉字符串中的换行符
         //str = str.replace(/\n/g, "").replace(/\s|\xA0/g, "");//去掉字符串中的所有空格
        }
        var obj;
        try{
            obj = JSON.parse(str);
        }
        catch(e){
            obj = eval('(' + str + ')');
        }
        return obj;
    }
};
export default jsonUtil;