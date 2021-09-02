function Decoder(bytes, port) {
  // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.
  var decoded = { 'heartbeat': false, 'alarm': false, 'silenced': false, 'low_pressure': false, 'low_pressure_clear': false, 
  'sensor_fault': false, 'sensor_fault_clear': false, 'key_test': false, 'remote_test': false, 'normal_status': false };
  
  if (port === 8) {
    if (bytes[0] == 0x0f) { // state change
      if (bytes[5] == 0x40) decoded.alarm = true;
      if (bytes[5] == 0x20) decoded.silenced = true;
      if (bytes[3] == 0x01) decoded.heartbeat = true;
      if (bytes[3] == 0x10) decoded.low_pressure = true;
      if (bytes[3] == 0x18) decoded.low_pressure_clear = true;
      if (bytes[5] == 0x10) decoded.sensor_fault = true;
      if (bytes[5] == 0x18) decoded.sensor_fault_clear= true;
      if (bytes[3] == 0x02) decoded.key_test = true;
      if (bytes[3] == 0x04) decoded.remote_test = true;
      if ((bytes[3] === 0x00) && (bytes[5] === 0x00)) decoded.normal_status = true;
    }
    if (bytes[6] == 0x11) { // power state
      if (bytes[7] == 0x02) decoded.power_type = 'CR17450'
      var vad = ((bytes[8] << 8) + bytes[9]);
      decoded.battery = (1.2*4096/vad).toFixed(2);
    }
    if (bytes[10] == 0x13) { // sensor signal strength
      if (bytes[12] == 0x01) decoded.sensor_type = 'smoke'
      vad = ((bytes[13] << 8) + bytes[14]);
      decoded.sensor_voltage = (1.2*4096/vad).toFixed(2);
    }
  }

  return decoded;
}