var reporttypes = {551:"Periodic report", 38:"Alarm Report"};
var fixtypes = {0x00: "No Fix", 0x01: "2D Fix", 0x02: "3D Fix"};
function Decoder(bytes, fport) {
	var decoded = {};
	if (fport === 2){
		if 	(bytes[0] === 0x00) {} //protocol version
		    //decoded.protocolversion = bytes[1]; //protocol version
			decoded.commandid = reporttypes[(bytes[2]<<8 | bytes[1])]; //command id
			decoded.longitude = (((bytes[6]<<24) + (bytes[5]<<16) + (bytes[4]<<8) + bytes[3]) * 0.000001); //Longitude in degrees
			decoded.latitude = (((bytes[10]<<24) + (bytes[9]<<16) + (bytes[8]<<8) + bytes[7]) * 0.000001); //Latitute in degrees
			if ((bytes[11] & 0x1f) == 0x02)	decoded.reporttype = "Periodic Report";
			decoded.gpsstatus = fixtypes[bytes[11]>>5]; //GPS fix status
			decoded.calories = ((bytes[14]<<8) + bytes[13]); //callories
			decoded.battery = bytes[15]; // battery %
			decoded.datetime = ((bytes[19]<<24) + (bytes[18]<<16) + (bytes[17]<<8) + bytes[16]); //EPOCH Date and time
			// beacon id skipped 20 bytes//
			decoded.beacontype = bytes[40]; //Beacon type
			decoded.rssi = bytes[41]; //RSSI
			decoded.txpwr = bytes[42]; //TX power
			decoded.hr = bytes[43]; //heart rate
			decoded.temp = ((bytes[45]<<8) + bytes[44]) /100; //skin temperature in Celcius
			decoded.step = ((bytes[47]<<8) + bytes[46]); //step counts
			decoded.distance = ((bytes[49]<<8) + bytes[48]); //distance in meters
						
		}
		return decoded;
}

// this will allow the decoder to be used in NodeRed accepting data from Kerlink Wanesy
var tempPayload = Decoder(Buffer.from(msg.payload.payload, 'hex'), msg.payload.fPort);
tempPayload.devEUI = msg.payload.endDevice.devEui;
msg.payload = tempPayload;
return msg;