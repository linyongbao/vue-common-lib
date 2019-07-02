/*
 *  DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *  Version 2, December 2004
 *
 *  Copyright (C) 2013-2015 sbxfc http://rungame.me
 *
 *  Everyone is permitted to copy and distribute verbatim or modified
 *  copies of this license document, and changing it is allowed as long
 *  as the name is changed.
 *
 *  DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *  0. You just DO WHAT THE FUCK YOU WANT TO.
 */


/**
 *  @param bytes ArrayBuffer类型的字节数据
 */
"use strict";

var ByteArray = function (source) {
    var _bytes;
    var _bytesLength = 0;
    var _offset = 0;
    if (source instanceof Int8Array ||
        source instanceof Uint8Array ||
        source instanceof Int16Array ||
        source instanceof Uint16Array ||
        source instanceof Int32Array ||
        source instanceof Uint32Array ||
        source instanceof Float32Array ||
        source instanceof Float64Array
    ) {
        _offset = source.byteOffset;
        _bytes = source.buffer;
    } else if (source instanceof ArrayBuffer) {
        _bytes = source;
    } else if (source === undefined) {
        _bytes = new ArrayBuffer(0);
    } else if (!(source instanceof ArrayBuffer)) {
        throw Error('ByteArray参数应当是一个ArrayBuffer类型的数据!');
    }

    _bytesLength = _bytes.byteLength;

    var LITTLE_ENDIAN = true;
    var HIGHT_WORD_MULTIPLIER = 0x100000000;
    var _dv = new DataView(_bytes);
    var _position = _offset;
    var self = this;

    /**
     *  @param length 扩充的容器长度,单位 byte
     *  扩充容器
     */
    self.plusCapacity = function (length) {
        var plusLength = _bytesLength;
        while (plusLength < length) {
            plusLength *= 2;
            var PLUS_VALUE_MIN = 16;
            plusLength = plusLength <= PLUS_VALUE_MIN ? PLUS_VALUE_MIN : plusLength;
        }

        // 扩充容器
        var bytesNew = new ArrayBuffer(_bytes.byteLength + length);
        var dvNew = new Uint8Array(bytesNew);

        // 创建容器副本
        var dvCopy = new Uint8Array(_bytes);
        dvNew.set(dvCopy, 0);
        _bytes = dvNew.buffer;

        // 构建新的DataView
        _dv = new DataView(_bytes);
    };

    //----------------------------------
    //  write
    //----------------------------------


    /**
     *  @param value 写入一个有符号的字节数据
     *  取值范围[-128,127]
     */
    self.writeByte = function (value) {
        _position++;
        _bytesLength++;
        if (_position >= _bytes.byteLength) {
            self.plusCapacity(1);
        }
        _dv.setInt8(_position - 1, value);
    };

    /**
     * @param value 一个 arraybuffe或Array类型的字节数组
     */
    self.writeBytes = function (data) {
        if (data === undefined) {
            throw Error('parameter value is undefined.');
        }

        var length = 0;
        var dataDV = null;
        if (data instanceof Array) {
            length = data.length;
            dataDV = new Uint8Array(data);
        } else if (data instanceof ArrayBuffer) {
            length = data.byteLength;
            dataDV = new Uint8Array(data);
        } else if (data instanceof Uint8Array) {
            length = data.length;
            dataDV = data;
        } else if (data instanceof Int8Array ||
            data instanceof Int16Array ||
            data instanceof Uint16Array ||
            data instanceof Int32Array ||
            data instanceof Uint32Array ||
            data instanceof Float32Array ||
            data instanceof Float64Array
        ) {
            length = data.length;
            dataDV = new Uint8Array(data.buffer());
        }

        if (length > 0 && dataDV) {
            if ((_position + length) >= _bytes.byteLength) {
                self.plusCapacity(length);
            }

            var bytesDV = new Uint8Array(_bytes);
            bytesDV.set(dataDV, _position);
            _position += dataDV.byteLength;
            _bytesLength += dataDV.byteLength;
        }
    };


    /**
     *  @param value 写入一个有符号的32位整形数据
     *  网络字节流使用小端序 LITTLE_ENDIAN
     */
    self.writeInt = function (value) {
        _position += 4;
        _bytesLength += 4;
        if (_position >= _bytes.byteLength) {
            self.plusCapacity(4);
        }
        _dv.setInt32(_position - 4, value, LITTLE_ENDIAN);
    };

    /**
     *  @param value 写入一个无符号的32位整形数据
     *  网络字节流使用小端序 LITTLE_ENDIAN
     */
    self.writeUint32 = function (value) {
        _position += 4;
        _bytesLength += 4;
        if (_position >= _bytes.byteLength) {
            self.plusCapacity(4);
        }
        _dv.setUint32(_position - 4, value, LITTLE_ENDIAN);
    };

    /**
     *  @param value 写入一个有符号的16位整形数据
     *  网络字节流使用小端序 LITTLE_ENDIAN
     */
    self.writeShort = function (value) {
        _position += 2;
        _bytesLength += 2;
        if (_position >= _bytes.byteLength) {
            self.plusCapacity(2);
        }
        _dv.setInt16(_position - 2, value, LITTLE_ENDIAN);
    };

    /**
     *  @param value 写入一个有符号的64位整形数据
     */
    self.writeLong = function (value) {
        _position += 8;
        _bytesLength += 8;
        if (_position >= _bytes.byteLength) {
            self.plusCapacity(8);
        }

        var hi = Math.floor(value / HIGHT_WORD_MULTIPLIER);
        _dv.setUint32(_position - 8, value, LITTLE_ENDIAN);
        _dv.setInt32(_position - 4, hi, LITTLE_ENDIAN);
    };

    self.writeUint64 = function (value) {
        _position += 8;
        _bytesLength += 8;
        if (_position >= _bytes.byteLength) {
            self.plusCapacity(8);
        }

        var hi = Math.floor(value / HIGHT_WORD_MULTIPLIER);
        _dv.setUint32(_position - 8, value, LITTLE_ENDIAN);
        _dv.setUint32(_position - 4, hi, LITTLE_ENDIAN);
    };

    /**
     *  @param value 写入一个有符号的64位浮点数
     */
    self.writeDouble = function (value) {
        _position += 8;
        _bytesLength += 8;
        if (_position >= _bytes.byteLength) {
            self.plusCapacity(8);
        }

        _dv.setFloat64(_position - 8, value, LITTLE_ENDIAN);
    };

    /**
     *  @param value 写入一个UTF-8格式的字符串
     */
    self.writeString = function (value) {
        value = value === undefined || typeof value !== 'string' ? '' : value;
        var bytes = new Array();
        var str = value;
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            var s = parseInt(c).toString(2);
            if (c >= parseInt("000080", 16) && c <= parseInt("0007FF", 16)) {
                var af = "";
                for (var j = 0; j < (11 - s.length); j++) {
                    af += "0";
                }
                af += s;
                var n1 = parseInt("110" + af.substring(0, 5), 2);
                var n2 = parseInt("110" + af.substring(5), 2);
                if (n1 > 127) n1 -= 256;
                if (n2 > 127) n2 -= 256;
                bytes.push(n1);
                bytes.push(n2);
            } else if (c >= parseInt("000800", 16) && c <= parseInt("00FFFF", 16)) {
                var af = "";
                for (var j = 0; j < (16 - s.length); j++) {
                    af += "0";
                }
                af += s;
                var n1 = parseInt("1110" + af.substring(0, 4), 2);
                var n2 = parseInt("10" + af.substring(4, 10), 2);
                var n3 = parseInt("10" + af.substring(10), 2);
                if (n1 > 127) n1 -= 256;
                if (n2 > 127) n2 -= 256;
                if (n3 > 127) n3 -= 256;
                bytes.push(n1);
                bytes.push(n2);
                bytes.push(n3);
            } else if (c >= parseInt("010000", 16) && c <= parseInt("10FFFF", 16)) {
                var af = "";
                for (var j = 0; j < (21 - s.length); j++) {
                    af += "0";
                }
                af += s;
                var n1 = parseInt("11110" + af.substring(0, 3), 2);
                var n2 = parseInt("10" + af.substring(3, 9), 2);
                var n3 = parseInt("10" + af.substring(9, 15), 2);
                var n4 = parseInt("10" + af.substring(15), 2);
                if (n1 > 127) n1 -= 256;
                if (n2 > 127) n2 -= 256;
                if (n3 > 127) n3 -= 256;
                if (n4 > 127) n4 -= 256;
                bytes.push(n1);
                bytes.push(n2);
                bytes.push(n3);
                bytes.push(n4);
            } else {
                bytes.push(c & 0xff);
            }
        }
        self.writeShort(bytes.length);
        self.writeBytes(bytes);
    };

    self.setPosition = function (value) {
        _position = _offset + value;
    };

    //----------------------------------
    //  read
    //----------------------------------


    /**
     *  读取一个字节(有符号的字节)
     */
    self.readByte = function () {
        _position++;
        return _dv.getInt8(_position - 1, LITTLE_ENDIAN);
    };

    /**
     *  读取一个16位整数
     */
    self.readShort = function () {
        _position += 2;
        return _dv.getInt16(_position - 2, LITTLE_ENDIAN);
    };

    /**
     *  读取一个32位整数
     */
    self.readInt = function () {
        _position += 4;
        return _dv.getInt32(_position - 4, LITTLE_ENDIAN);
    };

    /**
     *  读取一个无符号32位整数
     */
    self.readUint32 = function () {
        _position += 4;
        return _dv.getUint32(_position - 4, LITTLE_ENDIAN);
    };

    /**
     *  读取一个64位浮点数
     */
    self.readDouble = function () {
        _position += 8;
        return _dv.getFloat64(_position - 8, LITTLE_ENDIAN);
    };

    /**
     *  读取一个64位整数
     */
    self.readLong = function () {
        _position += 8;

        var lo,
            hi;
        hi = _dv.getInt32(_position - 4, LITTLE_ENDIAN);
        lo = _dv.getUint32(_position - 8, LITTLE_ENDIAN);
        return lo + hi * HIGHT_WORD_MULTIPLIER;
    };
    /**
     *  读取一个无符号64位整数
     */
    self.readULong = function () {
        return self.readUint64();
    };

    /**
     *  读取一个64位无符号整数
     */
    self.readUint64 = function () {
        _position += 8;

        var lo,
            hi;
        hi = _dv.getUint32(_position - 4, LITTLE_ENDIAN);
        lo = _dv.getUint32(_position - 8, LITTLE_ENDIAN);
        return lo + hi * HIGHT_WORD_MULTIPLIER;
    };

    /**
     *  读取指定长度的字节数据
     *  @param length 读取长度为length的字节数据
     */
    self.readBytes = function (length) {
        var byteLength = (typeof length === 'number') ? length : 0;

        if (byteLength === 0) {
            byteLength = _bytesLength - _position;
        }

        if ((_bytesLength - _position) < byteLength) {
            throw Error(' Error : Unable to read the data of length . [readBytes byteLength=' + byteLength + ']');
        }

        _position += byteLength;
        return new Uint8Array(_bytes, _position - byteLength, byteLength);
    };
    /**
     *  读取一个String字符串
     */
    self.readString = function () {
        var readLength = self.readShort();
        if (readLength === 0) {
            return "";
        }
        var bytes = self.readBytes(readLength);
        return String.fromCharCode.apply(null, bytes);
    };
    self.readStringUtf8 = function () {
        var readLength = self.readShort();
        if (readLength === 0) {
            return "";
        }
        var bytes = self.readBytes(readLength);

        var str = '';
        if ('TextDecoder' in window) {
            var enc = new TextDecoder("utf-8");
            str = enc.decode(bytes);
        }
        else {
            var _arr = bytes;
            for (var i = 0; i < _arr.length; i++) {
                var one = _arr[i].toString(2),
                    v = one.match(/^1+?(?=0)/);
                if (v && one.length == 8) {
                    var bytesLength = v[0].length;
                    var store = _arr[i].toString(2).slice(7 - bytesLength);
                    for (var st = 1; st < bytesLength; st++) {
                        store += _arr[st + i].toString(2).slice(2);
                    }
                    str += String.fromCharCode(parseInt(store, 2));
                    i += bytesLength - 1;
                } else {
                    str += String.fromCharCode(_arr[i]);
                }
            }
        }
        return str;
    },
        /**
         * 获取ByteArray里的字节数据
         */
        self.buffer = function () {
            return self.slice(0, _bytesLength);
        };
    /**
     * 以Copy的形式从 begin 到 end 之间的字节数据
     * @param begin
     * @param end
     * @return ArrayBuffer
     */
    self.slice = function (begin, end) {
        end = end === undefined ? _bytesLength : end;
        return _bytes.slice(begin, end);
    };
    /**
     * 返回字节长度
     */
    self.byteLength = function () {
        return _bytesLength;
    };
    self.getPosition = function () {
        return _position - _offset;
    };
};

// 检测大小端设备
var isLittleEndianDevice = (function () {
    var buffer = new ArrayBuffer(2);
    new DataView(buffer).setInt16(0, 256, true);
    return new Int16Array(buffer)[0] === 256;
}());


export default ByteArray;