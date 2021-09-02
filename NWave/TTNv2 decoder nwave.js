function Decoder(bytes, fport) {
  var data = {};
  switch (fport) {
    case 1: // Parking status
      data.type = "parking_status";
      data.occupied = (bytes[0] & 0x1) === 0x1;
      break;

    case 2: // Heartbeat
      data.type = "heartbeat";
      data.occupied = (bytes[0] & 0x1) === 0x1;
      break;

    case 3: // Startup
      data.type = "startup";
      data.firmware_version = bytes[0] + "." + bytes[1] + "." + bytes[2];
      data.reset_cause = [
        undefined,
        "watchdog",
        "power_on",
        "user_request",
        "brownout",
        "other",
      ][bytes[3]];
      data.occupied = (bytes[4] & 0x1) === 0x1;
      break;

    case 6: // Debug
      data.type = "debug";
      data.bytes = bytes
      break;
  }

  return data;
}
