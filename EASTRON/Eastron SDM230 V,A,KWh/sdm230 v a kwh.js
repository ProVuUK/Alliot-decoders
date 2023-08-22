 /*
 * Example decoder for testing Eastron LoRa (e.g. SDM230) Modbus data
 * Will work with the active upload messages
 * Use with nodejs CLI or NodeRed, data in correct format to send to Influxdb
 * FOR TESTING PURPOSES ONLY
 * Paul Hayes - paul@alliot.co.uk
 */

const datavalues = [["voltage","current","total_KWh"]];

function bytes2float(byte0, byte1, byte2, byte3) {
    var bits = (byte0 << 24) | (byte1 << 16) | (byte2 << 8) | (byte3);
    var sign = ((bits >>> 31) === 0) ? 1.0 : -1.0;
    var e = ((bits >>> 23) & 0xff);
    var m = (e === 0) ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    var f = sign * m * Math.pow(2, e - 150);
    return f;
}

// TTNv2
function Decoder(bytes, port) {
    var measurement_array = [];
    var tags = {};
    var measurement = "";
    var pos = 0;
    tags.serial_number = (bytes[pos++]<<24)|(bytes[pos++]<<16)|(bytes[pos++]<<8)|bytes[pos++];
    try {
        tags.devEUI = msg.payload.endDevice.devEui;
    } catch(err) {}
    var batch_number = bytes[pos++] - 1;
    var num_of_values = bytes[pos++] / 4;
    for (var i = 0; i<num_of_values; i++) {
       // measurement = `eastron_batch_${batch_number}_count_${i+1}`;
       measurement = datavalues[batch_number][i];
        var float_val = bytes2float(bytes[pos++],bytes[pos++],bytes[pos++],bytes[pos++]);
        measurement_array.push({measurement: measurement, fields: {'value': float_val}, tags: tags});
    }
    
    return measurement_array;
}

// Chirpstack V3                                                                                                                                                                                                  function Decode(fPort, bytes) {
    return Decoder(bytes, fPort);
}

// Chirpstack V4 or TTNv3                                                                                                                                                                                         
function decodeUplink(input) {
    return {
        data: Decoder(input.bytes, input.fPort)
    };
}

// NodeJS CLI
try {
    console.log(Decoder(Buffer.from(process.argv[2], 'hex'), 1));
    process.exit();
} catch(err) {
    console.log(err);
}

// NodeRed
try {
    var tempPayload = Decoder(Buffer.from(msg.payload.payload, 'hex'), msg.payload.fPort);
    //tempPayload[0].tags.devEUI = msg.payload.endDevice.devEui;
    msg.payload = tempPayload;
} catch(err) {
    msg.payload = err;
}
return msg;
