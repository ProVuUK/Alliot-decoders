function uintToInt(uint, nbit) {
    nbit = +nbit || 32;
    if (nbit > 32) throw new Error('uintToInt only supports ints up to 32 bits');
    uint <<= 32 - nbit;
    uint >>= 32 - nbit;
    return uint;
}

function Decoder(bytes, port) {
    var decoded = {};
    
    decoded.msg_version = bytes[1];
    decoded.seq_num = bytes[2];
    decoded.device_time = (bytes[3] << 24) | (bytes[4] << 16 ) | (bytes[5] << 8) | bytes[6];

    if (bytes[0] === 0x00) {
        decoded.msg_type = 'install request';
        decoded.nonce = (bytes[7] << 24) | (bytes[8] << 16 ) | (bytes[9] << 8) | bytes[10];
        decoded.battery_voltage = (bytes[11] << 8) | bytes[12];
        decoded.sensor1_temp = (((bytes[13] << 8) | bytes[14]) - 270) / 10;
        decoded.sensor2_temp = (((bytes[15] << 8) | bytes[16]) - 270) / 10;
        decoded.sensor3_temp = (((bytes[17] << 8) | bytes[18]) - 270) / 10;
        decoded.fw_version = bytes[19].toString() + '.' + bytes[20].toString() + '.' + bytes[21].toString();
        decoded.reset_reason = (bytes[22] << 8) | bytes[23];
    } else if (bytes[0] == 0x02) {
        decoded.msg_type = 'install response';
        decoded.error = bytes[7];
    } else if (bytes[0] == 0x03) {
        decoded.msg_type = 'temperature report';
        // doesn't handle historical data!!!
        decoded.sensor1_min_temp = uintToInt(bytes[7], 8);
        decoded.sensor1_max_temp = uintToInt(bytes[8], 8);
        decoded.sensor1_flow_count = bytes[9];
        decoded.sensor1_compliant = bytes[10];
        
        decoded.sensor2_min_temp = uintToInt(bytes[11], 8);
        decoded.sensor2_max_temp = uintToInt(bytes[12], 8);
        decoded.sensor2_flow_count = bytes[13];
        decoded.sensor2_compliant = bytes[14];
        
        decoded.sensor3_min_temp = uintToInt(bytes[15], 8);
        decoded.sensor3_max_temp = uintToInt(bytes[16], 8);
        decoded.sensor3_flow_count = bytes[17];
        decoded.sensor3_compliant = bytes[18];
    } else if (bytes[0] == 0x05) {
        decoded.msg_type = 'scald message';
        decoded.sensor = bytes[7];
        decoded.temperature = uintToInt(bytes[8], 8);
    } else if (bytes[0] == 0x06) {
        decoded.msg_type = 'freeze message';
        decoded.sensor = bytes[7];
        decoded.temperature = uintToInt(bytes[8], 8);
    } else if (bytes[0] == 0x08) {
        decoded.msg_type = 'sensor error';
        decoded.sensor1_error = bytes[7];
        decoded.sensor2_error = bytes[8];
        decoded.sensor3_error = bytes[9];
    } else if (bytes[0] == 0x09) {
        decoded.msg_type = 'internal error';
        decoded.error_number = (bytes[7] << 8) || bytes[8];
        decoded.file_name = bytes.slice(9, 41).toString();
        decoded.line_num = (bytes[41] << 8) || bytes[42];
    }

    return decoded;
}

// this will allow the decoder to be used in NodeRed accepting data from Kerlink Wanesy
var tempPayload = Decoder(Buffer.from(msg.payload.payload, 'hex'), msg.payload.fPort);
tempPayload.devEUI = msg.payload.endDevice.devEui;
msg.payload = tempPayload;
if (msg.payload.msg_type == 'install request') {
    // create downlink header
    var downlink = "0102" + ('0'+msg.payload.seq_num.toString(16)).substr(-2);
    // add epoch
    downlink += Math.round((new Date()).getTime() / 1000).toString(16);
    // add nonce
    downlink += ('0'+msg.payload.nonce.toString(16)).substr(-8);
    downlink += "07"; // days to resend install request
    downlink += "03"; // flags, scald and freeze on. History off.
    downlink += "3C"; // scald threshold, 60deg
    downlink += "FB"; // freeze temp, -5deg
    downlink += "000F"; // report period, 15 mins
    downlink += "01"; // sensor 1 config - hot outlet
    downlink += "03"; // sensor 2 config - cold outlet
    downlink += "00"; // sensor 1 config - disabled
    msg.downlink = downlink.toUpperCase(); // used in the API call for a downlink
    msg.deveui = msg.payload.devEUI; // used in the API call for a downlink
    return [ null, msg ];
} else {
    return [ msg, null ];
}