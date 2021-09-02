function Decode(fPort, bytes, variables) {
  var decoded = {};
  decoded.version = bytes[0];
  decoded.device_id = (bytes[1] << 8) | bytes[2];
  if (((bytes[3] << 8) | bytes[4]) & 0x01) {
	decoded.target_temp = (((bytes[5] << 24 >> 16)|bytes[6]) - 1000)/10;
  	decoded.head_temp = (((bytes[7] << 24 >> 16)|bytes[8]) - 1000)/10;
  }
  if (((bytes[3] << 8) | bytes[4]) & 0x02) {
	decoded.battery_volt = ((bytes[9] << 8)|bytes[10])/1000;
  }
  return decoded;
}