  var pos = 0;
  function decodeFrame(type, target, bytes) {
    switch(type & 0x7f) {
      case 0:
        target.emptyFrame = "";
        break;
      case 1: // Battery 1byte 0-100%
        //target.battery = {};
        target.battery = bytes[pos++];
        break;
      case 2: // TempReport 2bytes 0.1degree C
        //target.temperature = {}; // celcius 0.1 precision
        target.temperature = ((bytes[pos] & 0x80 ? 0xFFFF<<16 : 0) | (bytes[pos++] << 8) | bytes[pos++]) / 10;
        break;
      case 3:
        // Temp alarm
        //target.tempAlarm = {};  // sends alarm after >x<
        target.tempHighAlarm = !!(bytes[pos] & 0x01); // boolean
        target.tempLowAlarm = !!(bytes[pos] & 0x02);  // boolean
        pos++;
        break;
      case 4: // AvgTempReport 2bytes 0.1degree C
        //target.averageTemperature = {};
        target.averageTemperature = ((bytes[pos] & 0x80 ? 0xFFFF<<16 : 0) | (bytes[pos++] << 8) | bytes[pos++]) / 10;
        break;
      case 5:
        // AvgTemp alarm
        //target.avgTempAlarm = {}; // sends alarm after >x<
        target.avgTempAlarmHigh = !!(bytes[pos] & 0x01); // boolean
        target.avgTempAlarmLow = !!(bytes[pos] & 0x02);  // boolean
        pos++;
        break;
      case 6: // Humidity 1byte 0-100% in 0.5%
        //target.humidity = {};
        target.humidity = bytes[pos++] / 2; // relativeHumidity percent 0,5
        break;
      case 7: // Lux 2bytes 0-65535lux
        //target.lux = {};
        target.lux = ((bytes[pos++] << 8) | bytes[pos++]); // you can  the lux range between two sets (lux1 and 2)
        break;
      case 8: // Lux 2bytes 0-65535lux
        //target.lux2 = {};
        target.lux2 = ((bytes[pos++] << 8) | bytes[pos++]);
        break;
      case 9: // DoorSwitch 1bytes binary
        //target.door = {};
        target.door = !!bytes[pos++]; // true = door open, false = door closed
        break;
      case 10: // DoorAlarm 1bytes binary
        //target.doorAlarm = {};
        target.doorAlarm = !!bytes[pos++]; // boolean true = alarm
        break;
      case 11: // TamperReport 1bytes binary
        //target.tamperReport = {};
        target.tamperReport = !!bytes[pos++]; // should never trigger anymore
        break;
      case 12: // TamperAlarm 1bytes binary
        //target.tamperAlarm = {};
        target.tamperAlarm = !!bytes[pos++]; // should never trigger anymore
        break;
      case 13: // Flood 1byte 0-100%
        //target.flood = {};
        target.flood = bytes[pos++]; // percentage, relative wetness
        break;
      case 14: // FloodAlarm 1bytes binary
        //target.floodAlarm = {};
        target.floodAlarm = !!bytes[pos++]; // boolean, after >x<
        break;
      case 15: // FoilAlarm 1bytes binary
        //target.foilAlarm = {};
        target.foilAlarm = !!bytes[pos++]; // should never trigger anymore
        break;
    case 16: // UserSwitch1Alarm, 1 byte digital
        //target.userSwitch1Alarm = {};
        target.userSwitch1Alarm = !!bytes[pos++];
        break;
    case 17: // DoorCountReport, 2 byte analog
        //target.doorCount = {};
        target.doorCount = ((bytes[pos++] << 8) | bytes[pos++]);
        break;
    case 18: // PresenceReport, 1 byte digital
        //target.presence = {};
        target.presence = !!bytes[pos++];
        break;
    case 19: // IRProximityReport
        //target.IRproximity = {};
        target.IRproximity = ((bytes[pos++] << 8) | bytes[pos++]);
        break;
    case 20: // IRCloseProximityReport, low power
        //target.IRcloseproximity = {};
        target.IRcloseproximity = ((bytes[pos++] << 8) | bytes[pos++]);
        break;
    case 21: // CloseProximityAlarm, something very close to presence sensor
        //target.closeProximityAlarm = {};
        target.closeProximityAlarm = !!bytes[pos++];
        break;
    case 22: // DisinfectAlarm
        //target.disinfectAlarm = {};
        target.disinfectAlarm = bytes[pos++];
        if (target.disinfectAlarm == 0) target.disinfectAlarmState='dirty';
        if (target.disinfectAlarm == 1) target.disinfectAlarmState='occupied';
        if (target.disinfectAlarm == 2) target.disinfectAlarmState='cleaning';
        if (target.disinfectAlarm == 3) target.disinfectAlarmState='clean';
        break;
    case 80:
        //target.humidity = {};
        target.humidity = bytes[pos++] / 2;
        //target.temperature = {};
        target.temperature = ((bytes[pos] & 0x80 ? 0xFFFF<<16 : 0) | (bytes[pos++] << 8) | bytes[pos++]) / 10;
        break;
      case 81:
        //target.humidity = {};
        target.humidity = bytes[pos++] / 2;
        //target.averageTemperature = {};
        target.averageTemperature = ((bytes[pos] & 0x80 ? 0xFFFF<<16 : 0) | (bytes[pos++] << 8) | bytes[pos++]) / 10;
        break;
      case 82:
        //target.door = {};
        target.door = !!bytes[pos++]; // true = door open, false = door closed
        //target.temperature = {};
        target.temperature = ((bytes[pos] & 0x80 ? 0xFFFF<<16 : 0) | (bytes[pos++] << 8) | bytes[pos++]) / 10;
        break;
      case 112: // Capacitance Raw Sensor Value 2bytes 0-65535
        //target.capacitanceFlood = {};
        target.capacitanceFlood = ((bytes[pos++] << 8) | bytes[pos++]); // should never trigger anymore
        break;
      case 113: // Capacitance Raw Sensor Value 2bytes 0-65535
        //target.capacitancePad = {};
        target.capacitancePad = ((bytes[pos++] << 8) | bytes[pos++]); // should never trigger anymore
        break;
      case 110:
        //target.swversion = {};
        var number = ((bytes[pos++] << 24) | (bytes[pos++] << 16) | (bytes[pos++] << 8) | bytes[pos++]) >>> 0;
        target.swversion = number.toString(16);
        //target.startUpCount = {};
        target.startUpCount = bytes[pos++];
        //target.watchdogCount = {};
        target.watchdogCount = bytes[pos++];
        //target.stackTxFailRebootCount = {};
        target.stackTxFailRebootCount = bytes[pos++];
        //target.badConditionsCounter = {};
        target.badConditionsCounter = bytes[pos++]
        break;
      case 114: // Capacitance Raw Sensor Value 2bytes 0-65535
        //target.capacitanceEnd = {};
        target.capacitanceEnd = ((bytes[pos++] << 8) | bytes[pos++]); // should never trigger anymore
        break;
    }
    return target;
  } 

function Decoder(bytes, port) {
 // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.

  var decoded = {};

  var type;
  switch(port) {
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
        decodeFrame(type, decoded, bytes);
      }
      break;
    case 2:
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
        var secondsAgo = (bytes[pos++] << 24) | (bytes[pos++] << 16) | (bytes[pos++] << 8) | bytes[pos++];
        decoded.history[seqNr].timeStamp = new Date(now.getTime() - secondsAgo*1000).toUTCString();
        type = bytes[pos++];
        decodeFrame(type, decoded.history[seqNr], bytes);
        seqNr++;
      }
  }
  return decoded;

}
var tempPayload = Decoder(Buffer.from(msg.payload.payload, 'hex'), msg.payload.fPort);
msg.payload = tempPayload;
return msg;
