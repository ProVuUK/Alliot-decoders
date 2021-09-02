function Decode(port, bytes, variables) {
    var decoded = {};
    if (bytes[1] == 0x00) {
        decoded.device_type = "TEK766";
    } else {
        decoded.device_type = "Unknown";
    }
    if (bytes[0] == 0x10) {
        decoded.message_type = "Measurement";
        decoded.alarm1 = (bytes[2] & 0x01) ? 1 : 0;
        decoded.alarm2 = (bytes[2] & 0x02) ? 1 : 0;
        decoded.alarm3 = (bytes[2] & 0x04) ? 1 : 0;

        decoded.distance_1 = (bytes[4] << 8) | bytes[5];
        decoded.temperature_1 = (bytes[6] > 32) ? -(256 - bytes[6]) : bytes[6];
        decoded.src_1 = bytes[7] & 0x0F;
        decoded.srssi_1 = bytes[7] >> 4;

        decoded.distance_2 = (bytes[8] << 8) | bytes[9];
        decoded.temperature_2 = (bytes[10] > 32) ? -(256 - bytes[10]) : bytes[10];
        decoded.src_2 = bytes[11] & 0x0F;
        decoded.srssi_2 = bytes[11] >> 4;

        decoded.distance_3 = (bytes[12] << 8) | bytes[13];
        decoded.temperature_3 = (bytes[14] > 32) ? -(256 - bytes[14]) : bytes[14];
        decoded.src_3 = bytes[15] & 0x0F;
        decoded.srssi_3 = bytes[15] >> 4;

        decoded.distance_4 = (bytes[16] << 8) | bytes[17];
        decoded.temperature_4 = (bytes[18] > 32) ? -(256 - bytes[18]) : bytes[18];
        decoded.src_4 = bytes[19] & 0x0F;
        decoded.srssi_4 = bytes[19] >> 4;
    } else if (bytes[0] == 0x30) {
        contact_reasons = ["Reset", "Scheduled", "Manual", "Activation"];
        reset_reasons = ["Power On", "Brown Out", "External", "Watchdog", "CPU Lockup", "System Request", "EM4", "Backup Mode"];
        decoded.message_type = "Status";
        decoded.hardware_id = bytes[3];
        decoded.firmware_rev = bytes[4] + "." + bytes[5];
        var contact_raw = bytes[6] & 0x03;
        decoded.contact_reason = ((contact_reasons.length - 1) > contact_raw) ? contact_reasons[contact_raw] : "Unknown";
        var reset_raw = bytes[6] >> 2 & 0x07;
        decoded.reset_reason = ((reset_reasons.length - 1) > reset_raw) ? reset_reasons[reset_raw] : "Unknown";
        decoded.active_status = bytes[6] & 0x20 >> 5;
        decoded.rssi = -bytes[8];
        decoded.battery_percentage = bytes[10];
        decoded.measurement_sections_mins = (bytes[11] << 8) | bytes[12];
        decoded.transmit_period_mins = bytes[13] * 60;
        decoded.distance_1 = (bytes[14] << 8) | bytes[15];
        decoded.temperature_1 = (bytes[16] > 32) ? -(256 - bytes[16]) : bytes[16];
        decoded.src_1 = bytes[17] & 0x0F;
        decoded.srssi_1 = bytes[17] >> 4;
    }
    return decoded;
}

console.log(Decode(1, Buffer.from(process.argv[2], 'hex')));