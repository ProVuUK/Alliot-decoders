/*
 * Example decoder for Utopi Multisensor suitable for NodeRed and node,js CLI
 * FOR TESTING PURPOSES ONLY
 * Paul Hayes - paul@alliot.co.uk
 */

function Decoder(bytes, port) {
  var decoded = {};
  var tags = {};
  var measurement = "";
  
  if (port === 5) {
      // data message
      measurement = "sensor_data";
      decoded.temperature = ((bytes[0] << 8) | bytes[1])/100;
      decoded.pressure = ((bytes[2] << 8) | bytes[3])/10;
      decoded.humidity = ((bytes[4] << 8) | bytes[5])/100;
      decoded.pir_count = (bytes[6] << 8) | bytes[7];
      decoded.noise = ((bytes[8] << 8) | bytes[9])/100;
      decoded.light = (bytes[10] << 8) | bytes[11];
      decoded.e_co2 = (bytes[12] << 8) | bytes[13];
      decoded.tvoc = (bytes[14] << 8) | bytes[15];
      decoded.battery_volt = ((bytes[16] << 8) | bytes[17])/1000;
      decoded.e_co2_diag_data = bytes.slice(18,25).toString('hex');
  } else if (port === 4) {
      // config message
      measurement = "sensor_config";
      decoded.non_active_interval = (bytes[0] << 8) | bytes[1];
      decoded.active_interval = (bytes[2] << 8) | bytes[3];
      decoded.active_reports_count = bytes[4];
      decoded.pir_window_slices = bytes[5];
      decoded.pir_slice_duration = (bytes[6] << 8) | bytes[7];
      decoded.pir_threshold = bytes[8];
      decoded.sw_git_hash = bytes.slice(9,13).toString('hex');
      decoded.power_source = (bytes[13] == 0x01) ? 'usb' : 'battery';
  }

  return [{
      measurement: measurement,
      fields: decoded,
      tags: tags
  }];
}

try {
    console.log(Decoder(Buffer.from(process.argv[2], 'hex'), parseInt(process.argv[3])));
    process.exit();
} catch(err) {}

try {
    var tempPayload = Decoder(Buffer.from(msg.payload.payload, 'hex'), msg.payload.fPort);
    tempPayload[0].tags.devEUI = msg.payload.endDevice.devEui;
    msg.payload = tempPayload;
    return msg;
} catch(err) {
    msg.payload = err;
}
