// Paul Hayes, Alliot Technologies. 
// For testing purposes only!
function Decode(fPort, bytes, variables) {	
  var decoded = {};
  var p_status_byte = 0;
  if (fPort === 1) { // parking status message
    decoded.msg_type = "parking_status";
  } else if (fPort === 2) { // heartbeat
    decoded.msg_type = "heartbeat";
  } else if (fPort === 3) { // startup message
    decoded.msg_type = "startup";
    p_status_byte = 16;
    switch(bytes[15]) {
      case 0x01:
        decoded.reboot_cause = "Watchdog";
        break;
      case 0x02:
        decoded.reboot_cause = "Power On";
        break;
      case 0x03:
        decoded.reboot_cause = "System Request";
        break;
      case 0x04:
        decoded.reboot_cause = "Other";
        break;
      default:
        decoded.reboot_cause = "Unknown Case";
    }
  }
  if (bytes[p_status_byte] & 0x01) { 
    decoded.occupied = true;
  } else {
    decoded.occupied = false;
  }	
  return decoded;
}
