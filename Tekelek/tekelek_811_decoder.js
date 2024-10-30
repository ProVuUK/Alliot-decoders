/*

  Example of a decoder for Tekelek TEK811 NB-IoT level sensor

  Paul Hayes, Alliot Technologies Ltd.

  *** For testing purposes only ***

  */



/*
07 - product type tek811
21 - hardware rev. (0x21 & 0x20) >> 3 = 4, 0x21 & 0x07 = 1. 4 is BG96, 1 is rev 1. Not sure where to get bg96 from!?
02 - firmware rev. 0x02 & 0x1F = 2, (0x02 >> 5) & 0x07 = 0. FW is 2.0
01 - reason for contact, 0x01 = scheduled
8B - alarm status
06 - csq
34 - battery & rtc status. battery is ((0x34 & 0x1F) + 30)/10 = 5.0 volts. RTC status is (0x34 & 0x20) >> 5 = 1
0866425030672135 - IMEI
04 - message type. 0x04 & 0x3F = 4.
7B - length. Uses bits 7+8 of prev byte. ((0x04 & 0xC0) >> 6 << 8) + 0x7B = 123
0001 - message count = 1
8D - 0x8D & 0x1F = RTC_Hours, 13. (0x8D & 0xE0) >> 5 = 4 try tickets (???)
03DC - energy used for last contact?!? who cares...
3C - reserved
82 - logger speed (sampling time?). 0x82 & 0x7F = 2. x15 mins = 30 mins 
01 - time taken to connect to network (x10 seconds)....who cares....
0F - RTC_mins. 15. So full time is 13:15.
0A5B2877 - Data 0. Time is 13:15. Ullage is (0x28 & 0x03) << 8 | 0x77 = 119cm. SRC is (0x28 & 0x3C) >> 2 = 10. RSSI is 0x0A = 10. temp is (0x5B/2)-30 = 15.5
0A5B2877 - Data 1. Time is 30 mins forward = 13:45. Rest as above.
0A5B2876
0A5B2877
0A5B2877
0A5B2877
0A5B2877
0A5B2876
0A5B2876
0A5B2876
0A5B2877
0A5B2876
0A5B2876
0A5B2876
0A5D2877
0A5D2877
0A5D2877
0A5D2877
0A5D2877
0A5D2877
0A5D2877
0A5D2877
0A5D2877
0A5D2877
0A5F2877
00000000
00000000
00000000 - Data 27
EEBA - N/A (looks like a checksum)

number of messages is length bytes - 11 / 4. e.g. 123 - 11 = 112. 112/4 = 28.

*/

const productTypes = {0x07: 'TEK811'};
const contactReasons = {
    0x01: 'Scheduled', 
    0x02: 'Alarm', 
    0x04: 'Server Request',
    0x08: 'Manual',
    0x10: 'Reboot',
    0x20: 'TSP Requested',
    0x30: 'Dynamic Limit Status',
    0x40: 'Dynamic Limit 2 Status'
    };
const alarmStatus = {
    0x01: 'Limit 1',
    0x02: 'Limit 2',
    0x04: 'Limit 3',
    0x08: 'Bund'
}

function decodeTekelek(bytes) {
    var decoded = {};
    // common header
    decoded.product_type = productTypes[bytes[0]];
    decoded.hardware_rev = ((bytes[1] & 0x20) >> 3) + ((bytes[1] & 0x07)/10);
    decoded.firmware_rev = (bytes[2] & 0x1F) + (((bytes[2] >> 5) & 0x07)/10);
    decoded.contact_reason = contactReasons[bytes[3]];
    decoded.alarm_status = (bytes[4] & 0x80) ? 'Active: ' : 'Inactive: ' + alarmStatus[bytes[4] & 0x0F];
    decoded.csq = bytes[5];
    decoded.battery = ((bytes[5] & 0x1F) + 30)/10;
    decoded.rtc_status = (bytes[6] & 0x20) >> 5;
    decoded.imei = bytes.slice(7, 15).toString('hex');

    // message
    decoded.message_type = bytes[15] & 0x3F;
    decoded.message_length = ((bytes[15] & 0xC0) >> 6 << 8) + bytes[16];
    decoded.data = [];
    if ([4, 8, 9].includes(decoded.message_type)) {
        const data_count = (decoded.message_length - 11) / 4; // header data & crc on end is 11 bytes. Each data segment is 4 bytes
        console.log(data_count)
        decoded.message_count = (bytes[17] << 8) | bytes[18];
        const rtc_hours = bytes[19] & 0x1F;
        decoded.try_tickets = (bytes[19] & 0xE0) >> 5;
        decoded.energy_used = (bytes[20] << 8) | bytes[21];
        // 22 is reserved
        decoded.logger_speed = (bytes[23] & 0x7F) * 15;
        decoded.network_connect_time = bytes[24] * 10;
        const rtc_mins = bytes[25];

        // actual data
        var base_date = new Date()
        base_date.setUTCHours(rtc_hours, rtc_mins, 0);

        for (var i = 0; i < data_count; i++) {
            var this_data = {};
            this_data.timestamp = new Date(base_date);
            base_date.setMinutes(base_date.getMinutes() + decoded.logger_speed);
            this_data.ullage = (bytes[28 + (i * 4)] & 0x03) << 8 | bytes[29 + (i * 4)];
            this_data.src = (bytes[28 + (i * 4)] & 0x3C) >> 2;
            this_data.rssi = bytes[26 + (i * 4)];
            this_data.temperature = (bytes[27 + (i * 4)] / 2) - 30;
            decoded.data.push(this_data);
        }
    } else {
        // do other message types....
    }
    return decoded;
}


try {
    console.log(decodeTekelek(Buffer.from(process.argv[2], 'hex')));
    process.exit();
} catch(err) {
    console.log();
}

var temp_payload = decodeTekelek(Buffer.from(msg.payload, 'hex'));

var tags = { "IMEI":  temp_payload.imei };

var points = [];

const date_now = new Date();

if ('battery' in temp_payload) {
    points.push({
        timestamp: date_now,
        measurement: temp_payload.product_type,
        tags: tags,
        fields: { 'battery': temp_payload.battery }
    });
}

for (var data of temp_payload.data) {
    points.push({
        timestamp: data.timestamp,
        measurement: temp_payload.product_type,
        tags: tags,
        fields: { 
            'ullage': data.ullage,
            'src': data.src,
            'rssi': data.rssi,
            'temperature': data.temperature
         }
    });
}

msg.payload = points;

return msg;
