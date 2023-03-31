/*
 * Example decoder for TraceMe sensor
 * FOR TESTING PURPOSES ONLY
 * Paul Hayes - paul@alliot.co.uk
 */

function Decoder(bytes, fport) {
    var decoded = {};
    decoded.lat = ((bytes[2] << 24) | (bytes[3] << 16) | (bytes[4] << 8) | bytes[5])/600000;
    decoded.lng = ((bytes[6] << 24) | (bytes[7] << 16) | (bytes[8] << 8) | bytes[9])/600000;
    return decoded;
}

// Chirpstack decoder wrapper
function Decode(fPort, bytes) {
    return Decoder(bytes, fPort);
}

// Direct node.js CLU wrapper (payload bytestring as argument)
try {
    console.log(Decoder(Buffer.from(process.argv[2], 'hex'), 6));
} catch (err) { }

try {
    var tempPayload = Decoder(Buffer.from(msg.payload.payload, 'hex'), msg.payload.fPort);
    msg.payload = [{
        measurement: "latlngdata",
        fields: tempPayload,
        tags: { "devEUI": msg.payload.endDevice.devEui, "devID": "TraceMe-" + msg.payload.endDevice.devEui.slice(-4)}
    }];
    return msg;
} catch (err) {
    msg.payload = err;
}
