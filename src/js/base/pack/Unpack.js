import ByteArray from "./ByteArray"
//----------------------------------
//  read
//----------------------------------
var Unpack = function(binary_string) {

    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    this.arrayBuffer = new ByteArray(bytes.buffer);
    var self = this;

    /**
     *  读取一个字节(有符号的字节)
     */
    self.readByte = function() {
        return this.arrayBuffer.readByte();
    };
    /**
     *  读取指定长度的字节数据
     *  @param length 读取长度为length的字节数据
     */
    self.readBytes = function(length) {
        return this.arrayBuffer.readBytes(length);
    };
    /**
     *  读取一个16位整数
     */
    self.readShort = function() {
        return this.arrayBuffer.readShort();
    };
    /**
     *  读取一个32位整数
     */
    self.readInt = function() {
        return this.arrayBuffer.readInt();
    };
    /**
     *  读取一个无符号32位整数
     */
    self.readUint32 = function() {
        return this.arrayBuffer.readUint32();
    };
    /**
     *  读取一个64位浮点数
     */
    self.readDouble = function() {
        return this.arrayBuffer.readDouble();
    };

    self.readUint64 = function() {
        return this.arrayBuffer.readUint64();
    };
    /**
     *  读取一个64位整数
     */
    self.readLong = function() {
        return this.arrayBuffer.readLong();
    };
    self.readULong = function() {
        return this.arrayBuffer.readULong();
    };
    /**
     *  读取一个UTF-8格式的字符串
     */
    self.readString = function() {
        return this.arrayBuffer.readString();
    };
    /**
     *  读取一个UTF-8格式的字符串
     */
    self.readStringUtf8 = function() {
        return this.arrayBuffer.readStringUtf8();
    };

    
    /**
     *  读取一个按照map<string, string>格式的json对象
     */
    self.readMapStringStringObj = function() {
        var jsonObj = {};
        var length = self.readUint32();
        for (var index = 0; index < length; index++) {
            var key = self.readStringUtf8();
            var value = self.readStringUtf8();
            jsonObj[key] = value;
        }
        return jsonObj;
    };
    /**
     *  读取一个按照map<string, uint>格式的json对象
     */
    self.readMapStringUintObj = function() {
        var jsonObj = {};
        var length = self.readUint32();
        for (var index = 0; index < length; index++) {
            var key = self.readStringUtf8();
            var value = self.readUint32();
            jsonObj[key] = value;
        }
        return jsonObj;
    };
       /**
     *  读取一个按照map<uint, string>格式的json对象
     */
    self.readMapUintStringObj = function() {
        var jsonObj = {};
        var length = self.readUint32();
        for (var index = 0; index < length; index++) {
            var key = self.readUint32();
            var value = self.readStringUtf8();
            jsonObj[key] = value;
        }
        return jsonObj;
    };
    /**
     *  读取一个按照map<uint, uint>格式的json对象
     */
    self.readMapUintUintObj = function() {
        var jsonObj = {};
        var length = self.readUint32();
        for (var index = 0; index < length; index++) {
            var key = self.readUint32();
            var value = self.readUint32();
            jsonObj[key] = value;
        }
        return jsonObj;
    };
    /**
     *  读取一个按照list<map<string, string>>格式的json对象
     */
    self.readListMapStringString = function() {
        var jsonObj = [];
        var length = self.readUint32();
        for(var index = 0; index < length; index++) {
            jsonObj.push(self.readMapStringStringObj());
        }
        return jsonObj;
    };

     /**
     *  读取一个按照list<uid>格式的json对象
     */
    self.readLisUint = function() {
        var jsonObj = [];
        var length = self.readUint32();
        for(var index = 0; index < length; index++) {
            jsonObj.push(self.readUint32());
        }
        return jsonObj;
    };
    /**
     *  @param value 按照map<uint16, string>格式写入一个json对象
     */
    this.readMapUint16StringObj = function() {
        var jsonObj = [];
        var length = self.readUint32();
        for(var index = 0; index < length; index++) {
            var key = self.readShort();
            var value = self.readString();
            jsonObj[key] = value;
        }
        return jsonObj; 
    };

    /**
     *  @ 读取一个按照list<marshalClz>格式的json对象
     */
    this.readListObj = function(marshalClz) {
        var jsonObj = [];
        var length = self.readUint32();
        for(var index = 0; index < length; index++) {
            var objMar = new marshalClz();
            objMar.read(self);
            jsonObj.push(objMar);
        }
        return jsonObj; 
    };

 	/**
     *  @param value 按照map<uint32_t>格式读取
     */
     this.readMapUintObj = function() {
        var jsonObj = [];
        var length = self.readUint32();
        for (var index = 0; index < length; index++) {
            jsonObj.push(self.readUint32());
        }
        return jsonObj;
    };
};

export default Unpack;