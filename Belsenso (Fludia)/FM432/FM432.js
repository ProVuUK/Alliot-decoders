function Decoder(payload, fport, timestamp) {
	var decoded = {};
    hexPayload = toHexString(payload);
    var totalPulses = DecodeIndex(hexPayload);

    var header = parseInt(hexPayload.substring(0,2), 16);
    var step = null;
    var t1 = true;
    var meterVersion = "FM432e";
    
    if(header == 0x20){step = 10}
    if(header == 0x21){step = 15}
    if(header == 0x22){step = 60}
    if(header == 0x1D){step = 10}
    if(header == 0x1E){step = 15}
    if(header == 0x1F){step = 60}
    if(header == 0x0e){t1 = false}
    if(header == 0x10){t1 = false}

    if(t1) {
        var listIncrement = DecodeIncrement(hexPayload);
        if(listIncrement !== null && totalPulses !== null){
                var n = 60 / step;
                if(header === 0x1D || header === 0x1E || header === 0x1F){n = 1; meterVersion = "FM432g";}
                var listPower = [];
                var increment;
                var currentTime = 0;
                var stepInMillis = step * 60 * 1000;
                for(var i = 0; i < listIncrement.length; i++) {
                    increment = listIncrement[i];
                    currentTime = new Date((timestamp.getTime() + stepInMillis * (i + 1)) - 3600000);
                    listPower[i] = {"Timestamp": currentTime, "Pulses": Math.round(increment*n).toFixed(2), "Meter": meterVersion};
                }
                decoded = listPower;
        return decoded;
        } else {
         return null;
        }
    } else {
        return {
            "Number of Startups": parseInt(ByteToBinConverter(payload[1]), 2),
            "Time Sync": DecodeTimeSync(payload[2]),
            "Param ID": parseInt(ByteToBinConverter(payload[3]), 2),
            "Sensor Info": DecodeSensorInfo(payload[4], header),
            "Index": DecodeLongIndex(payload),
            "Max Power Value": DecodeMaxPower(payload),
            "Time Step": DecodeTimeStep(payload[11]),
            "Meter": meterVersion
        };
    }
}

function ByteToBinConverter(byte) {
    var binValue = (byte & 0xFF).toString(2);
    var lengthTooShort = 8 - binValue.length;
    var i = 0;
    while(i < lengthTooShort) {
        binValue = "0"+binValue;
        i++;
    }
    return binValue;
}

function toHexString(byteArray) {
    var arr = [];
    for (var i = 0; i < byteArray.length; ++i) {
        arr.push(('0' + (byteArray[i] & 0xFF).toString(16)).slice(-2));
    }
    return arr.join('');
}

function DecodeMaxPower(payload){
    var byte10 = parseInt(ByteToBinConverter(payload[9]), 2);
    var byte11 = parseInt(ByteToBinConverter(payload[10]), 2);
    return (byte10 * 2^8) + byte11;
}

function DecodeLongIndex(payload) {
    var byte6 = parseInt(ByteToBinConverter(payload[5]), 2);
    var byte7 = parseInt(ByteToBinConverter(payload[6]), 2);
    var byte8 = parseInt(ByteToBinConverter(payload[7]), 2);
    var byte9 = parseInt(ByteToBinConverter(payload[8]), 2);
    var index = (byte6*2^24) + (byte7*2^16) + (byte8*2^8) + byte9;
    return index;
}

function DecodeTimeStep(timeStepByte) {
    var timeStepBin = parseInt(ByteToBinConverter(timeStepByte), 2);
    var timeStepText = "";
    switch(timeStepBin){
        case 0: timeStepText = "10-minutes time step";
            break;
        case 1: timeStepText = "1-hour time step";
            break;
        case 3: timeStepText = "15-minutes time step";
            break;
        default:
            timeStepText = "Error: cannot retriece time step;"
    }
    return timeStepText;
}

function DecodeSensorInfo(sensorInfoByte, header) {
    var sensorInfoBin = ByteToBinConverter(sensorInfoByte);
    var firmwareVersion = parseInt(sensorInfoBin.substring(0,6), 2);
    var meterType = parseInt(sensorInfoBin.substring(6,7), 2);
    var batteryStatus = parseInt(sensorInfoBin.substring(7), 2);

    if(meterType === 0 & header == 0x0e) {
        meterType ="Electromechanical meter";
    } else if(meterType == 1) {
        if(header == 0x0e) {
            meterType = "Electronic meter";
        } else if (header == 0x10) {
            meterType = "Gas meter";
        }
    }
    if(batteryStatus === 0) {
        batteryStatus ="Battery okay";
    } else if(batteryStatus == 1) {
        batteryStatus = "Battery NOT okay!";
    }
    return {"Firmware Version": firmwareVersion,"Meter Type": meterType,"Battery Status": batteryStatus};
}

function DecodeTimeSync(timeSyncByte) {
    var timeSyncBin = ByteToBinConverter(timeSyncByte);
    var jitter = parseInt(timeSyncBin.substring(0,7), 2);
    var synchro = parseInt(timeSyncBin.substring(7), 2);

    if(synchro === 0) {
        synchro ="No synchro querying";
    } else if(synchro == 1) {
        synchro = "Synchro querying";
    }

    return {"Jitter": jitter, "Synchro": synchro};
}

function DecodeIndex(payload) {
    var index = null;
    if(payload.length == 40) {
        index = payload.substring(2, 8);
    }
    return parseInt(index, 16);
}

function payloadToHex(payload) {
    var incrementHex = [];
    if(payload.length == 40) {
        for(var i = 0; i < 16; i++){
            incrementHex[i] = payload.substring(8+2 * i, ((8+2)+2*i));
        }
    }
    return incrementHex;
}

function DecodeIncrement(payload) {
    if(payload.length == 40) {
        var incrementHex = payloadToHex(payload);
        var listIncrement = [];
        for(var i = 0; i < 8; i++) {
            listIncrement[i] = parseInt("" + incrementHex[i * 2] + incrementHex[i * 2 + 1], 16);
        }
        return listIncrement;
    }
    return null;  
}

try {
    console.log(Decoder(Buffer.from(process.payload.payload, 'hex'), 3, new Date()));
} catch(err) {}
try {
        var tempPayload = Decoder(Buffer.from(msg.payload.payload, 'hex'), msg.payload.fPort, msg.payload.recvTime);
        console.log(tempPayload);
        var messages = [];
        tempPayload.forEach(function(value, index) {
            var values = {};
            var tags = {};
            values.pulses = value["Pulses"];
            var timestamp = value["Timestamp"];
            tags.devEUI = msg.payload.endDevice.devEui;
            
            messages.push({"measurement": value["Meter"], "fields": values, "tags": tags, "timestamp": timestamp});
        })
        msg.payload = messages;
}
catch(err) {
    msg.payload = err;
}
return msg;
