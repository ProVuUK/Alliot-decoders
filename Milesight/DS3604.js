/**
 * Payload Decoder for The Things Network
 * 
 * Paul Hayes Alliot Technologies Ltd
 * 
 * @product DS3604
 */
 function Decoder(bytes, port) {
    var decoded = {};

    for (var i = 0; i < bytes.length;) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];
        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery_percent = bytes[i];
            i += 1;
        }
        // TEMPLATE
        else if (channel_id === 0xFF && channel_type === 0x73) {
            decoded.template = bytes[i] + 1;
            i += 1;
        }
        // POWER ON
        else if (channel_id === 0xFF && channel_type === 0x0B) {
            decoded.poweron = 1;
            i += 1;
        }
        // PROTOCOL VERSION
        else if (channel_id === 0xFF && channel_type === 0x01) {
            decoded.protocol_version = bytes[i];
            i += 1;
        }
        // DEVICE SERIAL
        else if (channel_id === 0xFF && channel_type === 0x16) {
            decoded.serial_number = bcdToNumber(bytes.slice(i, i + 8));
            i += 8;
        }
        // HARDWARE VERSION
        else if (channel_id === 0xFF && channel_type === 0x09) {
            decoded.hardware_version = bcdToNumber(bytes.slice(i++, i)) + "." + bcdToNumber(bytes.slice(i++, i));
        }
        // SOFTWARE VERSION
        else if (channel_id === 0xFF && channel_type === 0x0A) {
            decoded.software_version = bcdToNumber(bytes.slice(i++, i)) + "." + bcdToNumber(bytes.slice(i++, i));
        }
        // DEVICE TYPE
        else if (channel_id === 0xFF && channel_type === 0x0F) {
            if (bytes[i] == 0x00) {
                decoded.type = "Class A";
            } else if (bytes[i] == 0x01) {
                decoded.type = "Class B";
            } else {
                decoded.type = "Unknown";
            }
            i += 1;
        }
    }

    return decoded;
}

/* ******************************************
 * bytes to number
 ********************************************/
function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}

function bcdToNumber(bytes) {
	var num = 0;
	var m = 1;
	var i;
	for (i = 0; i < bytes.length; i++) {
		num += (bytes[bytes.length - 1 - i] & 0x0F) * m;
		num += ((bytes[bytes.length - 1 - i] >> 4) & 0x0F) * m * 10;
		m *= 100;
	}
	return num;
}

// Direct node.js CLU wrapper (payload bytestring as argument)
try {
    console.log(Decoder(Buffer.from(process.argv[2], 'hex'), 85));
} catch(err) {}