function Decode(port, bytes) {
  var decoded = {};
  decoded.ul_type = "unknown";
  if (bytes[5] === 0x23) {
    decoded.ul_type = "periodic";
  } else if (bytes[5] === 0x40) {
   decoded.ul_type = "ack";
  }
  decoded.power_source = (bytes[0] & 0x40) ? "ext" : "batt";
  decoded.class = (bytes[0] & 0x80) ? "C" : "A";
  decoded.battery_voltage = parseInt(String.fromCharCode.apply(null, bytes.slice(0, 4)))/1000;
  var status_byte = bytes[4] - 0x30;
  decoded.fraud = Boolean(status_byte & 0x40);
  decoded.leak = Boolean(status_byte & 0x20);
  decoded.digital_in_1 = Boolean(status_byte & 0x10);
  decoded.digital_in_0 = Boolean(status_byte & 0x08);
  decoded.cable_connected = Boolean(status_byte & 0x04);
  decoded.tamper = Boolean(status_byte & 0x02);
  decoded.valve_open = Boolean(status_byte & 0x01);
  
  if (decoded.ul_type === "periodic") {
    decoded.temperature =  Number((((((bytes[6] << 24 >> 16) + bytes[7])/65536) * 165) - 40).toFixed(2));
    decoded.humidity = Number(((((bytes[8] << 8) + bytes[9])/65536)*100).toFixed(2))
  }
  return decoded;
}

console.log(Decode(parseInt(process.argv[3]), Buffer.from(process.argv[2], 'hex')));
