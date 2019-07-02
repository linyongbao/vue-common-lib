import ByteArray from "./ByteArray"

//----------------------------------
//  write
//----------------------------------
var Pack = function() {
    this.arrayBuffer = new ByteArray();

    /**
     *  将buffer的内容打包返回一个字符串
     */
    this.toString = function() {
        var data = new Uint8Array(this.arrayBuffer.buffer());
        return String.fromCharCode.apply(null, data);
    };

    this.length = function() {
        return this.arrayBuffer.byteLength();
    };
    /**
     *  @param value 写入一个有符号的字节数据
     *  取值范围[-128,127]
     */
    this.writeByte = function(value) {
        this.arrayBuffer.writeByte(value);
    };
    /**
     * @param value 一个 arraybuffe或Array类型的字节数组
     */
    this.writeBytes = function(value) {
        this.arrayBuffer.writeBytes(value);
    };
    /**
     *  @param value 写入一个有符号的16位整形数据
     *  网络字节流使用小端序 LITTLE_ENDIAN
     */
    this.writeShort = function(value) {
        this.arrayBuffer.writeShort(value);
    };
    /**
     *  @param value 写入一个有符号的32位整形数据
     *  网络字节流使用小端序 LITTLE_ENDIAN
     */
    this.writeInt = function(value) {
        this.arrayBuffer.writeInt(value);
    };
    /**
     *  @param value 写入一个无符号的32位整形数据
     *  网络字节流使用小端序 LITTLE_ENDIAN
     */
    this.writeUint32 = function(value) {
        this.arrayBuffer.writeUint32(value);
    };
    /**
     *  @param value 写入一个无符号的32位整形数据
     *  网络字节流使用小端序 LITTLE_ENDIAN
     */
    this.writeUint64 = function(value) {
        this.arrayBuffer.writeUint64(value);
    };
    /**
     *  @param value 写入一个有符号的64位整形数据
     */
    this.writeLong = function(value) {
        this.arrayBuffer.writeLong(value);
    };
    /**
     *  @param value 写入一个有符号的64位浮点数
     */
    this.writeDouble = function(value) {
        this.arrayBuffer.writeDouble(value);
    };
    /**
     *  @param value 写入一个字符串
     */
    this.writeString = function(value) {
        this.arrayBuffer.writeString(value);
    };
    /**
     *  @param value 按照map<string, string>格式写入一个json对象
     */
    this.writeMapStringStringObj = function(jsonObj) {
        // 长度
        var size = 0;
        for (var temp in jsonObj) {
            if (jsonObj.hasOwnProperty(temp)) {
                size++;
            }
        }
        this.writeUint32(size);
        for (var key in jsonObj) {
            if (jsonObj.hasOwnProperty(key)) {
                var element = jsonObj[key];
                this.writeString(key);
                this.writeString(element);
            }
        }
    };
    /**
     *  @param value 按照map<string, uint>格式写入一个json对象
     */
    this.writeMapStringUintObj = function(jsonObj) {
        // 长度
        var size = 0;
        for (var temp in jsonObj) {
            if (jsonObj.hasOwnProperty(temp)) {
                size++;
            }
        }
        this.writeUint32(size);
        for (var key in jsonObj) {
            if (jsonObj.hasOwnProperty(key)) {
                var element = jsonObj[key];
                this.writeString(key);
                this.writeUint32(element);
            }
        }
    };
    /**
     *  @param value 按照map<uint16, string>格式写入一个json对象
     */
    this.writeMapUint16StringObj = function(jsonObj) {
        // 长度
        var size = 0;
        for (var temp in jsonObj) {
            if (jsonObj.hasOwnProperty(temp)) {
                size++;
            }
        }
        this.writeUint32(size);
        for (var key in jsonObj) {
            if (jsonObj.hasOwnProperty(key)) {
                var element = jsonObj[key];
                this.writeShort(key);
                this.writeString(element);
            }
        }
    };
    /**
     *  @param value 按照map<uint32_t>格式写入一个整型数据
     */
     this.writeMapUintObj = function(arrObj) {
        // 长度
        var size = 0;
        for (var temp in arrObj) {
            if (arrObj.hasOwnProperty(temp)) {
                size++;
            }
        }
        this.writeUint32(size);
        for (var item in arrObj) {
            if (arrObj.hasOwnProperty(item)) {
                var element = arrObj[item];
                this.writeUint32(item);
            }
        }
    };
};

export default Pack; 