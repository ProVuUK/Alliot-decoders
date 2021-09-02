function Decoder(bytes, port) {
  // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.
  var decoded = {};
  
  // decode common header
  decoded.battery_voltage = bytes[2]*0.0055+2.8;
  decoded.battery_percentage = parseInt((bytes[2]/255)*100);
  decoded.temperature = (bytes[3]*0.5)-44;
  decoded.ack_token = bytes[4] >> 4;
  // decode status
  if (bytes[1] & 0x10) decoded.sos_mode = true;
  if (bytes[1] & 0x08) decoded.tracking_state = true;
  if (bytes[1] & 0x04) decoded.moving = true;
  if (bytes[1] & 0x02) decoded.periodic_pos = true;
  if (bytes[1] & 0x01) decoded.pos_on_demand = true;
  decoded.operating_mode = bytes[1] >> 5;
  
  // decode rest of message
  if ((bytes[0] === 0x03) && ((bytes[4] & 0x0F) === 0x00)) { // position message & GPS type
    var lat_raw = ((bytes[6] << 16) | (bytes[7] << 8) | bytes[8]);
    lat_raw = lat_raw << 8;
    if (lat_raw > 0x7FFFFFFF) {
      lat_raw = lat_raw - 0x100000000;
    }
    decoded.latitude = lat_raw/10000000;
    var lng_raw = ((bytes[9] << 16) | (bytes[10] << 8) | bytes[11]);
    lng_raw = lng_raw << 8;
    if (lng_raw > 0x7FFFFFFF) {
      lng_raw = lng_raw - 0x100000000;
    }
    decoded.longitude = lng_raw/10000000;
    decoded.accuracy = bytes[12]*3.9;
    decoded.age = bytes[5]*8;
  } else if ((bytes[0] === 0x03) && ((bytes[4] & 0x0F) === 0x09)) { // position message & wifi bssid type
    decoded.bssid0 = bytes.slice(6, 12).map(function(b) { return ("0" + b.toString(16)).substr(-2); }).join(":");
    decoded.bssid1 = bytes.slice(13, 19).map(function(b) { return ("0" + b.toString(16)).substr(-2); }).join(":");
    decoded.bssid2 = bytes.slice(20, 26).map(function(b) { return ("0" + b.toString(16)).substr(-2); }).join(":");
    decoded.bssid3 = bytes.slice(27, 33).map(function(b) { return ("0" + b.toString(16)).substr(-2); }).join(":");
    
    decoded.rssi0 = (bytes[12] > 127 ? bytes[12] -256 : bytes[12]);
    decoded.rssi1 = (bytes[19] > 127 ? bytes[19] -256 : bytes[19]);
    decoded.rssi2 = (bytes[26] > 127 ? bytes[26] -256 : bytes[26]);
    decoded.rssi3 = (bytes[33] > 127 ? bytes[33] -256 : bytes[33]);
  } else if ((bytes[0] === 0x03) && ((bytes[4] & 0x0F) === 0x07)) { // position message & BLE macaddr type
    decoded.macadr0 = bytes.slice(6, 12).map(function(b) { return ("0" + b.toString(16)).substr(-2); }).join(":");
    decoded.macadr1 = bytes.slice(13, 19).map(function(b) { return ("0" + b.toString(16)).substr(-2); }).join(":");
    decoded.macadr2 = bytes.slice(20, 26).map(function(b) { return ("0" + b.toString(16)).substr(-2); }).join(":");
    decoded.macadr3 = bytes.slice(27, 33).map(function(b) { return ("0" + b.toString(16)).substr(-2); }).join(":");
    decoded.rssi0 = (bytes[12] > 127 ? bytes[12] -256 : bytes[12]);
    decoded.rssi1 = (bytes[19] > 127 ? bytes[19] -256 : bytes[19]);
    decoded.rssi2 = (bytes[26] > 127 ? bytes[26] -256 : bytes[26]);
    decoded.rssi3 = (bytes[33] > 127 ? bytes[33] -256 : bytes[33]);
  } else if ((bytes[0] === 0x03) && ((bytes[4] & 0x0F) === 0x01)) { // position message & GPS timeout (failure)
    decoded.gpstimeout = true;
  } else if (bytes[0] === 0x09) { // shutdown message
    decoded.shutdown = true;
  } else if (bytes[0] === 0x0A) {
    decoded.geoloc_start = true; 
  } else if (bytes[0] === 0x05) {
    decoded.heartbeat = true;
    decoded.reset_cause = bytes[5];
    decoded.firmware_ver = bytes.slice(6, 9);
  }
  return decoded;
}