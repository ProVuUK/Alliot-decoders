/*
 * Example decoder for some Netvox sensors with The Things Network, Chirpstack and node.js CLI
 * FOR TESTING PURPOSES ONLY
 * Paul Hayes - paul@alliot.co.uk
 */

function Decoder(bytes, fport) {
	var decoded = {};
	if (fport === 6) { // then its ReportDataCmd
		if (bytes[2] === 0x00) { // version report
			decoded.devicetype = "ALL";
			decoded.softwareversion = bytes[3];
			decoded.hardwareversion = bytes[4];
			decoded.datecode = bcdtonumber(bytes.slice(5, 9));
			return decoded;
		}
		if ((bytes[1] === 0x01) && (bytes[2] === 0x01)) { // device type 01 (R711/712) and report type 01
			decoded.devicetype = "R711";
			decoded.battery = bytes[3] / 10;
			decoded.temperature = ((bytes[4] << 24 >> 16) + bytes[5]) / 100;
			decoded.humidity = ((bytes[6] << 8) + bytes[7]) / 100;
		} else if ((bytes[1] === 0x02) && (bytes[2] === 0x01)) { // device type 02 (R311A), report type 01
			decoded.devicetype = "R311A";
			decoded.battery = bytes[3] / 10;
			decoded.contact = bytes[4];
		} else if ((bytes[1] === 0x06) && (bytes[2] === 0x01)) { // device type 06 (R311W)
			decoded.devicetype = "R311W";
			decoded.battery = bytes[3] / 10;
			decoded.leakone = bytes[4];
			decoded.leaktwo = bytes[5];
		} else if ((bytes[1] === 0x13) && (bytes[2] === 0x01)) { // device type 13 (R718AB)
			decoded.devicetype = "R718AB";
			decoded.battery = bytes[3] / 10;
			decoded.temperature = ((bytes[4] << 24 >> 16) + bytes[5]) / 100;
			decoded.humidity = ((bytes[6] << 8) + bytes[7]) / 100;
		} else if ((bytes[1] === 0x16) && (bytes[2] === 0x01)) { // device type 13 (R718CK2)
			decoded.devicetype = "R718CK2";
			decoded.battery = bytes[3] / 10;
			decoded.temperature1 = ((bytes[4] << 24 >> 16) + bytes[5]) / 10;
			decoded.temperature2 = ((bytes[6] << 24 >> 16) + bytes[7]) / 10;
		} else if ((bytes[1] === 0x0E) && (bytes[2] === 0x01)) { // device type 0E (R809A) and report type 01
			decoded.devicetype = "R809A-1";
			decoded.state = bytes[3];
			decoded.kwhused = ((bytes[4] << 24) + (bytes[5] << 16) + (bytes[6] << 8) + bytes[7]) / 1000;
		} else if ((bytes[1] === 0x0E) && (bytes[2] === 0x02)) { // device type 0E (R809A), report type 02
			decoded.devicetype = "R809A-2";
			decoded.volts = ((bytes[3] << 8) + bytes[4]);
			decoded.amps = ((bytes[5] << 8) + bytes[6]) / 1000;
			decoded.watts = ((bytes[7] << 8) + bytes[8]);
		} else if ((bytes[1] === 0x03) && (bytes[2] === 0x01)) { // device type 0E (RB11E), report type 01
			decoded.devicetype = "RB11E";
			decoded.battery = bytes[3] / 10;
			decoded.temperature = ((bytes[4] << 24 >> 16) + bytes[5]) / 100;
			decoded.illuminance = ((bytes[6] << 8) + bytes[7]);
			decoded.occupied = bytes[8];
		} else if (((bytes[1] === 0x05) || (bytes[1] === 0x09)) && (bytes[2] === 0x07)) {  // device R72615A, CO2 report type
			decoded.devicetype = "R72615A-1";
			decoded.battery = bytes[3] / 10;
			if ((bytes[4] != 0xff) || (bytes[5] != 0xff)) { // sometimes see ffff as co2 data?!?
				decoded.co2 = ((bytes[4] << 8) + bytes[5]) / 10;
			}
			// the rest of the message is 0xff for other sensor types
		} else if (((bytes[1] === 0x05) || (bytes[1] === 0x09)) && (bytes[2] === 0x0C)) { // device R72615A, temp & humidity report
			decoded.devicetype = "R72615A-2";
			decoded.battery = bytes[3] / 10;
			decoded.temperature = ((bytes[4] << 24 >> 16) + bytes[5]) / 100;
			decoded.humidity = ((bytes[6] << 8) + bytes[7]) / 100;
			// the rest of the message is 0xff for other sensor types
		} else if ((bytes[1] === 0x1B) && (bytes[2] === 0x01)) { // device R718DB and report 01
			decoded.devicetype = "R718DB";
			decoded.battery = bytes[3] / 10;
			decoded.vibration = bytes[4];
		} else if ((bytes[1] === 0x49) && (bytes[2] === 0x01)) { // device type 49 (R718N1) and report type 01
			decoded.devicetype = "R718N1";
			decoded.battery = bytes[3] / 10;
			decoded.currentma = ((bytes[4] << 8) + bytes[5]);
			decoded.multiplier = bytes[6];
			decoded.realcurrentma = decoded.currentma * decoded.multiplier;
		} else if ((bytes[1] === 0x4A) && (bytes[2] === 0x01)) { // device type 4A (R718N3) and report type 01
			decoded.devicetype = "R718N3-1";
			// full data is split over two separate uplink messages
			decoded.battery = bytes[3] / 10;
			decoded.currentma1 = ((bytes[4] << 8) + bytes[5]);
			decoded.currentma2 = ((bytes[6] << 8) + bytes[7]);
			decoded.currentma3 = ((bytes[8] << 8) + bytes[9]);
			decoded.multiplier1 = bytes[10];
		} else if ((bytes[1] === 0x4A) && (bytes[2] === 0x02)) { // device type 4A (R718N3) and report type 02
			decoded.devicetype = "R718N3-2";
			// full data is split over two separate uplink messages
			decoded.battery = bytes[3] / 10;
			decoded.multiplier2 = bytes[4];
			decoded.multiplier3 = bytes[5];
		} else if ((bytes[1] === 0x1C) && (bytes[2] === 0x01)) { // device type 1C (R718E) and report type 01
			decoded.devicetype = "R718E-1";
			// full data is split over two separate uplink messages
			decoded.battery = bytes[3] / 10;
			decoded.accelerationx = bytestofloat16((bytes[5] << 8) + bytes[4]);
			decoded.accelerationy = bytestofloat16((bytes[7] << 8) + bytes[6]);
			decoded.accelerationz = bytestofloat16((bytes[9] << 8) + bytes[8]);
		} else if ((bytes[1] === 0x1C) && (bytes[2] === 0x02)) { // device type 1C (R718E) and report type 02
			decoded.devicetype = "R718E-2";
			// full data is split over two separate uplink messages
			decoded.velocityx = bytestofloat16((bytes[4] << 8) + bytes[3]);
			decoded.velocityy = bytestofloat16((bytes[6] << 8) + bytes[5]);
			decoded.velocityz = bytestofloat16((bytes[8] << 8) + bytes[7]);
			decoded.temperature = ((bytes[9] << 24 >> 16) + bytes[10]);
		} else if ((bytes[1] === 0x32) && (bytes[2] === 0x01)) { // device type 32 (R718WA), report type 01
			decoded.devicetype = "R718WA";
			decoded.battery = bytes[3] / 10;
			decoded.waterleak = bytes[4];
		} else if ((bytes[1] === 0x4D) && (bytes[2] === 0x01)) { // device type 4D (R312A), report type 01
			decoded.devicetype = "R312A";
			decoded.battery = bytes[3] / 10;
			decoded.alarm = bytes[4];
		} else if ((bytes[1] === 0x04) && (bytes[2] === 0x01)) { // device type 04 (R311G), report type 01
			decoded.devicetype = "R311G";
			decoded.battery = bytes[3] / 10;
			decoded.illuminance = (bytes[4] << 8) | bytes[5];
		} else if ((bytes[1] === 0x1D) && (bytes[2] === 0x01)) { // device type 1D (R718F), report type 01
			decoded.devicetype = "R718F";
			decoded.battery = bytes[3] / 10;
			decoded.contact = bytes[4];
		} else if ((bytes[1] === 0x4F) && (bytes[2] === 0x01)) { // device type 4F (R311FA), report type 01
			decoded.devicetype = "R311FA";
			decoded.battery = bytes[3] / 10;
			decoded.activity = bytes[4];
		} else if ((bytes[1] === 0x12) && (bytes[2] === 0x01)) { // device type 12 (R718WB), report type 01
			decoded.devicetype = "R718WB";
			decoded.battery = bytes[3] / 10;
			decoded.leak = bytes[4];
		} else if ((bytes[1] === 0x9F) && (bytes[2] === 0x01)) { // device type 9F (R718VA/VB), report type 01
			decoded.devicetype = "R718VAVB";
			decoded.battery = bytes[3] / 10;
			decoded.status = bytes[4];
		} else if ((bytes[1] === 0x20) && (bytes[2] === 0x01)) { // device type 20 (R718IA), report type 01
			decoded.devicetype = "R718IA";
			decoded.battery = bytes[3] / 10;
			decoded.adcrawvalue = (bytes[4] << 8) | bytes[5];
		} else if ((bytes[1] === 0x41) && (bytes[2] === 0x01)) { // device type 41 (R718IA2), report type 01
			decoded.devicetype = "R718IA2";
			decoded.battery = bytes[3] / 10;
			decoded.adcrawvalue1 = (bytes[4] << 8) | bytes[5];
			decoded.adcrawvalue2 = (bytes[6] << 8) | bytes[7];
		} else if ((bytes[1] === 0x05) && (bytes[2] === 0x0A)) { // device type 05 (RA07 series), water level/soil moisture
			decoded.devicetype = "RA07";
			decoded.battery = bytes[3] / 10;
			if (bytes[4] != 0xFF && bytes[5] != 0xFF) {
				decoded.soilvwc = (bytes[4] << 8) | bytes[5];
			}
			if (bytes[6] != 0xFF && bytes[7] != 0xFF) {
				decoded.soiltemperature = (bytes[6] << 8) | bytes[7];
			}
			if (bytes[8] != 0xFF && bytes[9] != 0xFF) {
				decoded.waterlevel = (bytes[8] << 8) | bytes[9];
			}
			if (bytes[10] != 0xFF) {
				decoded.ec = bytes[10];
			}
		} else if ((bytes[1] === 0x05) && (bytes[2] === 0x08)) { // device type 05 (RA07 series), ph sensor
			decoded.devicetype = "RA0708";
			decoded.battery = bytes[3] / 10;
			if (bytes[4] != 0xFF && bytes[5] != 0xFF) {
				decoded.ph = ((bytes[4] << 8) | bytes[5])/100;
			}
			if (bytes[6] != 0xFF && bytes[7] != 0xFF) {
				decoded.temperature = ((bytes[6] << 8) | bytes[7])/100;
			}
			if (bytes[8] != 0xFF && bytes[9] != 0xFF) {
				decoded.orp = (bytes[8] << 8) | bytes[9];
			}
		} else if ((bytes[1] === 0x05) && (bytes[2] === 0x09)) { // device type 05 (RA07 series), turbidity sensor
			decoded.devicetype = "RA0710";
			decoded.battery = bytes[3] / 10;
			if (bytes[4] != 0xFF && bytes[5] != 0xFF) {
				decoded.ntu = ((bytes[4] << 8) | bytes[5])/10;
			}
			if (bytes[6] != 0xFF && bytes[7] != 0xFF) {
				decoded.temperature = ((bytes[6] << 8) | bytes[7])/100;
			}
			if (bytes[8] != 0xFF && bytes[9] != 0xFF) {
				decoded.soilhumidity = ((bytes[8] << 8) | bytes[9])/100;
			}
		} else if ((bytes[1] === 0x5A) && (bytes[2] === 0x01)) { // device type 5A (R311WA/R313WA)
			decoded.devicetype = "R311WA";
			decoded.battery = bytes[3] / 10;
			decoded.status1 = bytes[4];
			decoded.status2 = bytes[5];
	  	} else if ((bytes[1] === 0x22) && (bytes[2] === 0x01)) { // device type 22 (R718KA)
			decoded.devicetype = "R718KA";
			decoded.battery = bytes[3] / 10;
			decoded.current = bytes[4];
			decoded.finecurrent = bytes[5];
		} else if ((bytes[1] === 0x25) && (bytes[2] === 0x01)) { // device type 25 (R718LB)
			decoded.devicetype = "R718LB";
			decoded.battery = bytes[3] / 10;
			decoded.status = bytes[4];
		} else if ((bytes[1] === 0x95) && (bytes[2] === 0x01)) { // device type 95 (R718B)
			decoded.devicetype = "R718B";
			decoded.battery = bytes[3] / 10;
			decoded.temperature = ((bytes[4] << 24 >> 16) + bytes[5]) / 10;
		} else if ((bytes[1] === 0xB1) && (bytes[2] === 0x01)) { // device type 177 (R718PE)
			decoded.devicetype = "R718PE";
			decoded.battery = bytes[3] / 10;
			decoded.status1 = bytes[4];
			decoded.distance = (bytes[5] << 8) + bytes[6];
			decoded.filllevel = bytes[7];
		} else if ((bytes[1] === 0xBB) && (bytes[2] === 0x01)) { // device type BB (R718UBB)
            decoded.devicetype = "R718UBB";
            decoded.battery = bytes[3] / 10;
            decoded.temperature = ((bytes[4] << 8) | bytes[5]) / 100;
            decoded.humidity = ((bytes[6] << 8) | bytes[7]) / 100;
            decoded.co2 = ((bytes[8] << 8) | bytes[9]);
        } 
	} else if (fport === 7) { // then its a ConfigureCmd response
		if ((bytes[0] === 0x82) && (bytes[1] === 0x01)) { // R711 or R712
			decoded.mintime = ((bytes[2] << 8) + bytes[3]);
			decoded.maxtime = ((bytes[4] << 8) + bytes[5]);
			decoded.battchange = bytes[6] / 10;
			decoded.tempchange = ((bytes[7] << 8) + bytes[8]) / 100;
			decoded.humidchange = ((bytes[9] << 8) + bytes[10]) / 100;
		} else if ((bytes[0] === 0x81) && (bytes[1] === 0x01)) { // R711 or R712
			decoded.success = bytes[2];
		}
	}
	return decoded;
}

function bcdtonumber(bytes) {
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

function bytestofloat16(bytes) {
    var sign = (bytes & 0x8000) ? -1 : 1;
    var exponent = ((bytes >> 7) & 0xFF) - 127;
    var significand = (bytes & ~(-1 << 7));

    if (exponent == 128) 
        return 0.0;

    if (exponent == -127) {
        if (significand == 0) return sign * 0.0;
        exponent = -126;
        significand /= (1 << 6);
    } else significand = (significand | (1 << 7)) / (1 << 7);

    return sign * significand * Math.pow(2, exponent);
}

// Chirpstack decoder wrapper
function Decode(fPort, bytes) {
	return Decoder(bytes, fPort);
}

// Direct node.js CLU wrapper (payload bytestring as argument)
try {
    console.log(Decoder(Buffer.from(process.argv[2], 'hex'), 6));
} catch(err) {}

try {
    var tempPayload = Decoder(Buffer.from(msg.payload.payload, 'hex'), msg.payload.fPort);
    msg.payload = [{
        measurement: tempPayload.devicetype,
        fields: tempPayload,
        tags: {"devEUI": msg.payload.endDevice.devEui}
    }];
    return msg;
} catch(err) {
    msg.payload = err;
}
