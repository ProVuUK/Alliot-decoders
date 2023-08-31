function decodeUplink(input) {
    var decoded = {
        absolute_flow_count: null,
        reverse_flow_count: null,
        index_k: null,
        medium: null,
        vif: null,
        alarm_magnetic: null,
        alarm_removal: null,
        alarm_fraud: null,
        alarm_leakage: null,
        alarm_reverse_flow: null,
        alarm_low_battery: null
    };
  
    const bytes = input.bytes;

    decoded.absolute_flow_count = bcdToStr(bytes.slice(1, 5).reverse());
    decoded.reverse_flow_count = bcdToStr(bytes.slice(5, 9).reverse());
    decoded.index_k = bytes[9];
    decoded.medium = bytes[10];
    decoded.vif = bytes[11];

    decoded.alarm_magnetic = bytes[12] & 0x01;
    decoded.alarm_removal = bytes[12] & 0x02;
    decoded.alarm_fraud = bytes[12] & 0x04;
    decoded.alarm_leakage = bytes[12] & 0x08;
    decoded.alarm_reverse_flow = bytes[12] & 0x10;
    decoded.alarm_low_battery = bytes[12] & 0x20;

    if (bytes.length == 15) {
      decoded.temperature = (bytes[13] << 8) | bytes[14];
    }

    return { data: decoded }
  }

  function bcdToStr(bytes) {
    var num = 0;
    var m = 1;
    var i;
    for (i = 0; i < bytes.length; i++) {
      num += (bytes[bytes.length - 1 - i] & 0x0F) * m;
      num += ((bytes[bytes.length - 1 - i] >> 4) & 0x0F) * m * 10;
      m *= 100;
    }
    return num;
  }
