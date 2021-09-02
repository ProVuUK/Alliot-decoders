/*
 * Example decoder for Metos Lorain with The Things Network, Chirpstack and node.js CLI
 * FOR TESTING PURPOSES ONLY
 * Paul Hayes - paul@alliot.co.uk
 */

function Decoder(bytes, port) {
    var decoded = {};
  
    decoded.msg_number = bytes[2];
    if (bytes[3] === 0x80) {
        decoded.device = 'lorain';
    } else {
        decoded.device = 'unknown';
    }

    decoded.payload_version = bytes[4];
    decoded.hw_version = ((bytes[6] << 8) | bytes[5])/100;
    decoded.fw_version = ((bytes[8] << 8) | bytes[7])/100;
    decoded.dev_status = bytes[9];
    decoded.serial_num = bytetohexstr(bytes[13]) + bytetohexstr(bytes[12]) + bytetohexstr(bytes[11]) + bytetohexstr(bytes[10]);
    decoded.battery = ((bytes[15] << 8) | bytes[14])/1000;
    decoded.solar = ((bytes[17] << 8) | bytes[16])/1000;
    decoded.precipitation = ((bytes[19] << 8) | bytes[18])/10;
    decoded.air_temp_ave = ((bytes[21] << 8) | bytes[20])/100;
    decoded.air_temp_min = ((bytes[23] << 8) | bytes[22])/100;
    decoded.air_temp_max = ((bytes[25] << 8) | bytes[24])/100;
    decoded.humidity_ave = ((bytes[27] << 8) | bytes[26])/10;
    decoded.humidity_min = ((bytes[29] << 8) | bytes[28])/10;
    decoded.humidity_max = ((bytes[31] << 8) | bytes[30])/10;
    decoded.delta_t_ave = ((bytes[33] << 8) | bytes[32])/100;
    decoded.delta_t_min = ((bytes[35] << 8) | bytes[34])/100;
    decoded.delta_t_max = ((bytes[37] << 8) | bytes[36])/100;
    decoded.dew_point_ave = ((bytes[39] << 8) | bytes[38])/100;
    decoded.dew_point_min = ((bytes[41] << 8) | bytes[40])/100;
    decoded.vpd_ave = ((bytes[43] << 8) | bytes[42])/100;
    decoded.vpd_min = ((bytes[45] << 8) | bytes[44])/100;
    decoded.leaf_wetness = bytes[46];
    
    return decoded;
}

function bytetohexstr(byte) {
    if (byte < 16) {
      return '0' + byte.toString(16);
    } else {
      return byte.toString(16);
    }
  }

// Chirpstack decoder wrapper
function Decode(fPort, bytes) {
	return Decoder(bytes, fPort);
}

// Direct node.js CLU wrapper (payload bytestring as argument)
try {
    console.log(Decoder(Buffer.from(process.argv[2], 'hex'), process.argv[3]));
} catch(err) {}