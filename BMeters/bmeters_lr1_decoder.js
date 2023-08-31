function decodeUplink(input) {
    var decoded = {
        cpu_voltage: null,
        cpu_temperature: null,
        alarm_leakage: null,
        alarm_removal: null,
        alarm_magnetic: null,
        alarm_excess_flow: null,
        volume: null,
        backflow_volume: null
    };
  
    const bytes = input.bytes;

    var idx = 0;
    
    // loop through message getting any data
    while (idx < bytes.length) {
        if (bytes[idx++] == 0x01) {
            // then it's some data
            var data_type = bytes[idx++];
            switch (data_type) {
                case 0x03:
                    idx += 6;
                    break;
                case 0x05:
                    break;
                case 0x06:
                    // cpu voltage
                    decoded.cpu_voltage = bytes[idx++] / 40; // 25mV per bit
                    break;
                case 0x0A:
                    // cpu temperature
                    decoded.cpu_temperature = (((bytes[idx++] << 8) | bytes[idx++]) / 100) - 50; // 0.01c per bit offset of 50
                    break;
                case 0x20:
                    // alarms
                    decoded.alarm_leakage = bytes[idx] & 0x01;
                    decoded.alarm_removal = bytes[idx] & 0x08;
                    decoded.alarm_magnetic = bytes[idx] & 0x20;
                    decoded.alarm_excess_flow = bytes[idx] & 0x80;
                    idx++;
                    break;
                case 0x21:
                    // volume
                    decoded.volume = ((bytes[idx++] << 24) | (bytes[idx++] << 16) | (bytes[idx++] << 8) | bytes[idx++]) * 0.001;
                    break;
                case 0x27:
                    // back flow volume
                    decoded.backflow_volume = ((bytes[idx++] << 24) | (bytes[idx++] << 16) | (bytes[idx++] << 8) | bytes[idx++]) * 0.001;
                    break;
                case 0x22:
                case 0x2B:
                    idx += 2;
                    break;
                case 0x25:
                    idx += 4;
                    break;
                case 0x2C:
                case 0x2D:
                    idx++;
                    break;
                default:
                    break;
            }
        }
    }

    return { data: decoded };

}

