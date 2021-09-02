function Decoder(bytes, port) {
  // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.  function decodeFrame(type, target)
  {
	switch(type & 0x7f) {
	  case 0:
		target.emptyFrame = {};
		break;
	  case 1: // Battery 1byte 0-100%
		target.battery = {};
		target.battery = bytes[pos++];
		break;
	  case 2: // TempReport 2bytes 0.1degree C
		target.temperature = {};
		target.temperature.value = ((bytes[pos] & 0x80 ? 0xFFFF<<16 : 0) | (bytes[pos++] << 8) | bytes[pos++]) / 10;
		break;
	  case 3:
		// Temp alarm
		target.tempAlarm = {};
		target.tempAlarm.highAlarm = !!(bytes[pos] & 0x01);
		target.tempAlarm.lowAlarm = !!(bytes[pos] & 0x02);
		pos++;
		break;
	  case 4: // AvgTempReport 2bytes 0.1degree C
		target.averageTemperature = {};
		target.averageTemperature.value = ((bytes[pos] & 0x80 ? 0xFFFF<<16 : 0) | (bytes[pos++] << 8) | bytes[pos++]) / 10;
		break;
	  case 5:
		// AvgTemp alarm
		target.avgTempAlarm = {};
		target.avgTempAlarm.highAlarm = !!(bytes[pos] & 0x01);
		target.avgTempAlarm.lowAlarm = !!(bytes[pos] & 0x02);
		pos++;
		break;
	  case 6: // Humidity 1byte 0-100% in 0.5%
		target.humidity = {};
		target.humidity.value = bytes[pos++] / 2;
		break;
	  case 7: // Lux 2bytes 0-65535lux
		target.lux = {};
		target.lux.value = ((bytes[pos++] << 8) | bytes[pos++]);
		break;
	  case 8: // Lux 2bytes 0-65535lux
		target.lux2 = {};
		target.lux2.value = ((bytes[pos++] << 8) | bytes[pos++]);
		break;
	  case 9: // DoorSwitch 1bytes binary
		target.door = {};
		target.door.value = !!bytes[pos++];
		break;
	  case 10: // DoorAlarm 1bytes binary
		target.doorAlarm = {};
		target.doorAlarm.value = !!bytes[pos++];
		break;
	  case 11: // TamperSwitch 1bytes binary
		target.tamperSwitch = {};
		target.tamperSwitch.value = !!bytes[pos++];
		break;
	  case 12: // TamperAlarm 1bytes binary
		target.tamperAlarm = {};
		target.tamperAlarm.value = !!bytes[pos++];
		break;
	  case 13: // Flood 1byte 0-100%
		target.flood = {};
		target.flood.value = bytes[pos++];
		break;
	  case 14: // FloodAlarm 1bytes binary
		target.floodAlarm = {};
		target.floodAlarm.value = !!bytes[pos++];
		break;
	  case 15: // FoilAlarm 1bytes binary
		target.foilAlarm = {};
		target.foilAlarm.value = !!bytes[pos++];
		break;
	  case 80:
		target.combined = {};
		target.combined.hum =  bytes[pos++] / 2;
		target.combined.temp = ((bytes[pos] & 0x80 ? 0xFFFF<<16 : 0) | (bytes[pos++] << 8) | bytes[pos++]) / 10;
		break;
	  case 81:
		target.combined = {};
		target.combined.hum =  bytes[pos++] / 2;
		target.combined.avgTemp = ((bytes[pos] & 0x80 ? 0xFFFF<<16 : 0) | (bytes[pos++] << 8) | bytes[pos++]) / 10;
		break;
	  case 82:
		target.combined = {};
		target.combined.door =  !!bytes[pos++];
		target.combined.temp = ((bytes[pos] & 0x80 ? 0xFFFF<<16 : 0) | (bytes[pos++] << 8) | bytes[pos++]) / 10;
		break;
	  case 112: // Capacitance Raw Sensor Value 2bytes 0-65535
		target.capacitanceFlood = {};
		target.capacitanceFlood.value = ((bytes[pos++] << 8) | bytes[pos++]);		
		break;
	  case 113: // Capacitance Raw Sensor Value 2bytes 0-65535
		target.capacitancePad = {};
		target.capacitancePad.value = ((bytes[pos++] << 8) | bytes[pos++]);
		break;
	  case 114: // Capacitance Raw Sensor Value 2bytes 0-65535
		target.capacitanceEnd = {};
		target.capacitanceEnd.value = ((bytes[pos++] << 8) | bytes[pos++]);
		break;
	}
  }  var decoded = {};
  var pos = 0;
  var type;  switch(port) {
    case 1:
      if(bytes.length < 2) {
        decoded.error = 'Wrong length of RX package';
        break;
      }
      decoded.historySeqNr = (bytes[pos++] << 8) | bytes[pos++];
      decoded.prevHistSeqNr = decoded.historySeqNr;
      while(pos < bytes.length) {
        type = bytes[pos++];
        if(type & 0x80)
            decoded.prevHistSeqNr--;
		decodeFrame(type, decoded);
      }
      break;	case 2:
	  var now = new Date();
	  decoded.history = {};
      if(bytes.length < 2) {
        decoded.history.error = 'Wrong length of RX package';
        break;
      }	 
      var seqNr = (bytes[pos++] << 8) | bytes[pos++];
      while(pos < bytes.length) {
		decoded.history[seqNr] = {};
		decoded.history.now = now.toUTCString();
		secondsAgo = (bytes[pos++] << 24) | (bytes[pos++] << 16) | (bytes[pos++] << 8) | bytes[pos++];
		decoded.history[seqNr].timeStamp = new Date(now.getTime() - secondsAgo*1000).toUTCString();
        type = bytes[pos++];
		decodeFrame(type, decoded.history[seqNr]);
		seqNr++;
	  }
  }
  return decoded;
}
