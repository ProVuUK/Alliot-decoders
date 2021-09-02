//convert unsigned int to int - useful for 2's complement qwantum temperature
function uintToInt(uint, nbit) {
    nbit = +nbit || 32;
    if (nbit > 32) throw new Error('uintToInt only supports ints up to 32 bits');
    uint <<= 32 - nbit;
    uint >>= 32 - nbit;
    return uint;
}






function Decoder(bytes, port) {
  // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.
  var decoded = {};

  // Decode Reading History or History Extract
  if (bytes[0] == 0x01 || bytes[0] == 0x02 || bytes[0] == 0x04 ) {
    if (bytes[0] == 0x01 ) {
      decoded.type = "live reading" 
      }
    else
      if( bytes[0] == 0x02 ) {
        decoded.type = "History" 
      }
    else
        decoded.type = "History Extract" 
    decoded.timestamp = (bytes[1] << 24) | (bytes[2] << 16) | (bytes[3] << 8) | (bytes[4] << 0)
    decoded.flags = bytes[5]
    bp = 6
    if (decoded.flags & 0x80) {
      //decoded.internal = ((bytes[bp+0] << 8) | (bytes[bp+1] << 0)) / 10
      //var hex = "0x" + bytes[bp+0].toString(16) + bytes[bp+1].toString(16);
      //decoded.internal = uintToInt(hex, 16) / 10;
      decoded.internal = ((bytes[bp] << 24 >> 16) | bytes[bp+1])/10
      bp += 2
    }
    if (decoded.flags & 0x40) {
      decoded.external = ((bytes[bp+0] << 8) | (bytes[bp+1] << 0)) / 10
      bp += 2
    }
    if (decoded.flags & 0x20) {
      decoded.analogue = (bytes[bp+0] << 8) | (bytes[bp+1] << 0)
      bp += 2
    }
    if (decoded.flags & 0x18) {
      if (decoded.flags & 0x10)
        decoded.digital_a = (bytes[bp] & 0x01) >> 0
      if (decoded.flags & 0x08)
        decoded.digital_b = (bytes[bp] & 0x02) >> 1
      bp += 1
    }
    if (decoded.flags & 0x04) {
      decoded.light = bytes[bp]
      bp += 1
    }
    if (decoded.flags & 0x01) {
      decoded.battery = (bytes[bp+0] << 8) | (bytes[bp+1] << 0)
      bp += 2
    }
    
  } else if (bytes[0] == 0x0f) {
    decoded.type = "CONFIG SUCCESS"
  } else if (bytes[0] == 0x0e) {
    decoded.type = "CONFIG FAILURE"
  } else {
    decoded.type = "unrecognised payload " + bytes[0].toString(16) + " (" + bytes[0] + ")"
    decoded.data=bytes.map(function(b) { return ("0" + b.toString(16)).substr(-2); }).join(" ")

  }

  return decoded;
}

//var eui = msg.payload.hardware_serial;
//msg.rawHex = Buffer.from(new Buffer(msg.payload.payload_raw, 'base64').toString('hex'), "hex");
//msg.payload = Decoder(msg.rawHex, 0);
//msg.payload.hardware_serial = eui; 
// this will allow the decoder to be used in NodeRed accepting data from Kerlink Wanesy
var tempPayload = Decoder(Buffer.from(process.argv[2], 'hex'), process.argv[3]);
//tempPayload.devEUI = msg.payload.endDevice.devEui;
console.log(tempPayload);