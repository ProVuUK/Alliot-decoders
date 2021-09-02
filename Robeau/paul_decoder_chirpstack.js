// Decode decodes an array of bytes into an object.
//  - fPort contains the LoRaWAN fPort number
//  - bytes is an array of bytes, e.g. [225, 230, 255, 0]
//  - variables contains the device variables e.g. {"calibration": "3.5"} (both the key / value are of type string)
// The function must return an object, e.g. {"temperature": 22.5}
function Decode(fPort, bytes, variables) {
    var decoded = {};
    decoded.command_code = bytes[0] & 0x03;
    switch ((bytes[0] >> 6) & 0x03) {
      case 0x00:
        decoded.battery = 'empty';
        break;
      case 0x01:
        decoded.battery = 'low';
        break;
      case 0x02:
        decoded.battery = 'medium';
        break;
      case 0x03:
        decoded.battery = 'full';
        break;
    }
    var sensor_number = (bytes[0] >> 2) & 0x0f;
    decoded.keep_alive = (sensor_number === 0x00) ? 1 : 0;
    decoded.sensor_1 = (sensor_number & 0x01) ? (bytes[1] << 40) | (bytes[2] << 32) | (bytes[3] << 24) | (bytes[4] << 16) | (bytes[5] << 8) | bytes[6] : 0;
    decoded.sensor_2 = (sensor_number & 0x02) ? (bytes[7] << 40) | (bytes[8] << 32) | (bytes[9] << 24) | (bytes[10] << 16) | (bytes[11] << 8) | bytes[12] : 0;
    decoded.sensor_3 = (sensor_number & 0x04) ? (bytes[13] << 40) | (bytes[14] << 32) | (bytes[15] << 24) | (bytes[16] << 16) | (bytes[17] << 8) | bytes[18] : 0;
    decoded.sensor_4 = (sensor_number & 0x08) ? (bytes[19] << 40) | (bytes[20] << 32) | (bytes[21] << 24) | (bytes[22] << 16) | (bytes[23] << 8) | bytes[24] : 0;
    return decoded;
  }