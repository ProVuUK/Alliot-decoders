function Decode(port, bytes, variables) {

    for (var i = 0; i < bytes.length; i++){
        if (bytes[i] === 0)
            bytes[i] = "00";
     }
 
    function hexToBinary(hex) {
        return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
    }

    function hexToDec(hex) {
        return parseInt(hex, 16);
    }

    function binToDecimal(bstr) {
        return parseInt((bstr + '')
            .replace(/[^01]/gi, ''), 2);
    }

    function DecTohex(str) {
        return str.toString(16);
    }
    var params = {
        "message_type": null,
        "unit_info": {},
        "unit_setup": {},
        "diagnostic_info": {},
        "contact_reason": {},
        "alarm_status": {},
        "signal_strength": {},
        "battery_status": {},
        "unique_identifier": {},
        "last_reset": {},
        "measurement_data": {},
        "errorhandling": {}
    };

    function measurement_data() {}


    if (bytes !== null && bytes.length > 0) {
        if (bytes.length > 0) {

            //product_type
            if (DecTohex(bytes[1]) == "00") {
                params.unit_info.product_type = "TEK 766";
            } else {
                params.unit_info.product_type = "";
            }

            //message_type
            if (DecTohex(bytes[0]) == "10") {
                params.message_type = "Measurement";

                //decode_msg_measurement
                var alarm_bin = hexToBinary(DecTohex(bytes[2]));
                //S23_bin = (pad.substring(0, pad.length - S23_bin.length)) + S23_bin;
                var alarm_rev_str = alarm_bin.toString().split("").reverse();
                var activeinactive = "";
                //params._defines_the_alarms = "";
                for (var i = 0; i <= alarm_rev_str.length - 1; i++) {

                    if (alarm_rev_str[i] == "1")
                        activeinactive = true;
                    else
                        activeinactive = false;


                    if (i === 0) {
                        params.alarm_status.static1 = activeinactive;
                    }
                    if (i === 1) {
                        params.alarm_status.static2 = activeinactive;
                    }
                    if (i === 2) {
                        params.alarm_status.static3 = activeinactive;
                    }
                    if (i === 3) {
                        params.alarm_status.bund = activeinactive;
                    }

                }



                var measurement_datacls_Arr = [];
                var mearsuredata = null;
                mearsuredata = new measurement_data();

                var reading_cms = parseInt(hexToDec(DecTohex(bytes[4])) * 256) + parseInt(hexToDec(DecTohex(bytes[5])));
                mearsuredata.distance_cm = reading_cms;

                var temperature_htod = hexToDec(DecTohex(bytes[6]));
                var temperature = 0;
                if (parseInt(hexToDec("32")) > parseInt(temperature_htod))
                    temperature = (-(0 - temperature_htod));
                else
                    temperature = (-(256 - temperature_htod));

                mearsuredata.temperature_c = temperature;
                //F temperature
                mearsuredata.temperature_f = ((parseFloat(mearsuredata.temperature_c) * 1.8) + 32).toFixed(2);

                var majornibble8 = hexToDec(DecTohex(bytes[7]).toString().split('')[0]);
                mearsuredata.sonic_src = majornibble8;

                var minornibble8 = hexToDec(DecTohex(bytes[7]).toString().split('')[1]);
                mearsuredata.sonic_rssi = minornibble8;

                measurement_datacls_Arr.push(mearsuredata);

                mearsuredata = new measurement_data();

                var reading_cms1 = (parseInt(hexToDec(DecTohex(bytes[8]))) * 256) + parseInt(hexToDec(DecTohex(bytes[9])));
                mearsuredata.distance_cm = reading_cms1;

                var temperature_htod1 = hexToDec(DecTohex(bytes[10]));
                var temperature1 = 0;
                if (parseInt(hexToDec("32")) > parseInt(temperature_htod1))
                    temperature1 = (-(0 - temperature_htod1));
                else
                    temperature1 = (-(256 - temperature_htod1));
                mearsuredata.temperature_c = temperature1;
                //F temperature
                mearsuredata.temperature_f = ((parseFloat(mearsuredata.temperature_c) * 1.8) + 32).toFixed(2);


                var majornibble12 = hexToDec(DecTohex(bytes[11]).toString().split('')[0]);
                mearsuredata.sonic_src = majornibble12;

                var minornibble12 = hexToDec(DecTohex(bytes[11]).toString().split('')[1]);
                mearsuredata.sonic_rssi = minornibble12;

                measurement_datacls_Arr.push(mearsuredata);
                mearsuredata = new measurement_data();

                var reading_cms2 = (parseInt(hexToDec(DecTohex(bytes[12]))) * 256) + parseInt(hexToDec(DecTohex(bytes[13])));
                mearsuredata.distance_cm = reading_cms2;


                var temperature_htod2 = hexToDec(DecTohex(bytes[14]));
                var temperature2 = 0;
                if (parseInt(hexToDec("32")) > parseInt(temperature_htod2))
                    temperature2 = (-(0 - temperature_htod2));
                else
                    temperature2 = (-(256 - temperature_htod2));
                mearsuredata.temperature_c = temperature2;
                //F temperature
                mearsuredata.temperature_f = ((parseFloat(mearsuredata.temperature_c) * 1.8) + 32).toFixed(2);

                var majornibble16 = hexToDec(DecTohex(bytes[15]).toString().split('')[0]);
                mearsuredata.sonic_src = majornibble16;

                var minornibble16 = hexToDec(DecTohex(bytes[15]).toString().split('')[1]);
                mearsuredata.sonic_rssi = minornibble16;

                measurement_datacls_Arr.push(mearsuredata);
                mearsuredata = new measurement_data();

                var reading_cms3 = (parseInt(hexToDec(DecTohex(bytes[16]))) * 256) + parseInt(hexToDec(DecTohex(bytes[17])));
                mearsuredata.distance_cm = reading_cms3;

                var temperature_htod3 = hexToDec(DecTohex(bytes[18]));
                var temperature3 = 0;
                if (parseInt(hexToDec("32")) > parseInt(temperature_htod3))
                    temperature3 = (-(0 - temperature_htod3));
                else
                    temperature3 = (-(256 - temperature_htod3));
                mearsuredata.temperature_c = temperature3;
                //F temperature
                mearsuredata.temperature_f = ((parseFloat(mearsuredata.temperature_c) * 1.8) + 32).toFixed(2);

                var majornibble20 = hexToDec(DecTohex(bytes[19]).toString().split('')[0]);
                mearsuredata.sonic_src = majornibble20;

                var minornibble20 = hexToDec(DecTohex(bytes[19]).toString().split('')[1]);
                mearsuredata.sonic_rssi = minornibble20;

                measurement_datacls_Arr.push(mearsuredata);
                params.measurement_data = measurement_datacls_Arr;
            } else if (DecTohex(bytes[0]) == "30") {

                params.message_type = "Status";

                var hardwareid_bin = hexToDec(DecTohex(bytes[3]));
                params.unit_info.hardware_revision = hardwareid_bin;

                var firmware_revision1 = hexToDec(DecTohex(bytes[4]));
                var firmware_revision2 = hexToDec(DecTohex(bytes[5]));
                params.unit_info.firmware_revision = firmware_revision1 + "." + firmware_revision2;




                var reason_bin = hexToBinary(DecTohex(bytes[6]));

                var reason_contact_dec = binToDecimal(reason_bin.substr(6, 2));
                if (reason_contact_dec === 0) {
                    params.contact_reason.reboot = true;
                } else if (reason_contact_dec === 1) {
                    params.contact_reason.scheduled = true;
                } else if (reason_contact_dec === 2) {
                    params.contact_reason.manual = true;
                } else if (reason_contact_dec === 3) {
                    params.contact_reason.activation = true;
                }

                var reason_reset_dec = binToDecimal(reason_bin.substr(3, 3));
                if (reason_reset_dec == 0) {
                    params.last_reset.poweron = true;
                } else if (reason_reset_dec == 1) {
                    params.last_reset.brownout = true;
                } else if (reason_reset_dec == 2) {
                    params.last_reset.external = true;
                } else if (reason_reset_dec == 3) {
                    params.last_reset.watchdog = true;
                } else if (reason_reset_dec == 4) {
                    params.last_reset.lockup_reset = true;
                } else if (reason_reset_dec == 5) {
                    params.last_reset.instructed_reset = true;
                }

                var sensor_rssi = hexToDec(DecTohex(bytes[8]));
                params.signal_strength.rssi = "-" + sensor_rssi;

                var remaining_battery = hexToDec(DecTohex(bytes[10]));
                params.battery_status.battery_remaining_percentage = remaining_battery;

                var transmit_period = hexToDec(DecTohex(bytes[13]));
                params.unit_setup.scheduled_transmit_period_minutes = transmit_period * 60; 

                var mearsuredatacls_Arr = [];
                var mearsuredata = null;
                mearsuredata = new measurement_data();

                var ullage_reading = parseInt(hexToDec(DecTohex(bytes[14]))) * 256 + parseInt(hexToDec(DecTohex(bytes[15])));
                mearsuredata.distance_cm = ullage_reading;

                var temperature = hexToDec(DecTohex(bytes[16]));
                var tempresult = 0;
                if (parseInt(hexToDec("32")) > parseInt(temperature))
                    tempresult = (-(0 - temperature))
                else
                    tempresult = (-(256 - temperature))
                mearsuredata.temperature_c = tempresult;
                //F temperature
                mearsuredata.temperature_f = ((parseFloat(mearsuredata.temperature_c) * 1.8) + 32).toFixed(2);

                var majornibble18 = hexToDec(DecTohex(bytes[17]).charAt(0));
                mearsuredata.sonic_src = majornibble18;

                var minornibble18 = hexToDec(DecTohex(bytes[17]).charAt(1));
                mearsuredata.sonic_rssi = minornibble18;
                mearsuredatacls_Arr.push(mearsuredata);
                params.measurement_data = mearsuredatacls_Arr;


            } else if (DecTohex(DecTohex(bytes[0])) == "43") {
                params.message_type = "Parameter Read Response";
            } else if (DecTohex(DecTohex(bytes[0])) == "45") {
                params.message_type = "Alarm Notification";

                var alarm_bin = hexToBinary(DecTohex(bytes[2]));
                var alarm_rev_str = alarm_bin.toString().split("").reverse();
                var activeinactive = "";
                for (var i = 0; i <= alarm_rev_str.length - 1; i++) {

                    if (alarm_rev_str[i] == "1")
                        activeinactive = true;
                    else
                        activeinactive = false;

                    if (i == 0) {
                        params.alarm_status.static1 = activeinactive;
                    }
                    if (i == 1) {
                        params.alarm_status.static2 = activeinactive;
                    }
                    if (i == 2) {
                        params.alarm_status.static3 = activeinactive;
                    }
                    if (i == 3) {
                        params.alarm_status.bund = activeinactive;
                    }
                }

                var mearsuredatacls_Arr = [];
                var mearsuredata = null;
                mearsuredata = new measurement_data();
                var ullage_reading = parseInt(hexToDec(DecTohex(bytes[4]))) * 256 + parseInt(hexToDec(DecTohex(bytes[5])));
                mearsuredata.distance_cm = ullage_reading;

                var temperature_htod = hexToDec(DecTohex(bytes[6]));
                var temperature = 0;
                if (parseInt(hexToDec("32")) > parseInt(temperature_htod))
                    temperature = (-(0 - temperature_htod))
                else
                    temperature = (-(256 - temperature_htod))
                mearsuredata.temperature_c = temperature;
                //F temperature
                mearsuredata.temperature_f = ((parseFloat(mearsuredata.temperature_c) * 1.8) + 32).toFixed(2);

                var majornibble8 = hexToDec(DecTohex(bytes[7]).toString().split('')[0]);
                mearsuredata.sonic_src = majornibble8;

                var minornibble8 = hexToDec(DecTohex(bytes[7]).toString().split('')[1]);
                mearsuredata.sonic_rssi = minornibble8;

                mearsuredatacls_Arr.push(mearsuredata);

                mearsuredata = new measurement_data();
                var ullage_reading1 = parseInt(hexToDec(DecTohex(bytes[8]))) * 256 + parseInt(hexToDec(DecTohex(bytes[9])));
                mearsuredata.distance_cm = ullage_reading1;

                var temperature_htod1 = hexToDec(DecTohex(bytes[10]));
                var temperature1 = 0;
                if (parseInt(hexToDec("32")) > parseInt(temperature_htod1))
                    temperature1 = (-(0 - temperature_htod1))
                else
                    temperature1 = (-(256 - temperature_htod1))
                mearsuredata.temperature_c = temperature1;
                //F temperature
                mearsuredata.temperature_f = ((parseFloat(mearsuredata.temperature_c) * 1.8) + 32).toFixed(2);

                var majornibble12 = hexToDec(DecTohex(bytes[11]).toString().split('')[0]);
                mearsuredata.sonic_src = majornibble12;

                var minornibble12 = hexToDec(DecTohex(bytes[11]).toString().split('')[1]);
                mearsuredata.sonic_rssi = minornibble12;

                mearsuredatacls_Arr.push(mearsuredata);

                params.measurement_data = mearsuredatacls_Arr;
                //return objmsg_alarm_notification;
            } else if (DecTohex(DecTohex(DecTohex(bytes[0]))) == "47") {
                params.message_type = "Diagnostic Read Response";
            } else if (DecTohex(DecTohex(DecTohex(bytes[0]))) == "40") {
                params.message_type = "Response Ack";
            } else if (DecTohex(DecTohex(DecTohex(bytes[0]))) == "41") {
                params.message_type = "Parameter Read Request";
            } else if (DecTohex(DecTohex(DecTohex(bytes[0]))) == "42") {
                params.message_type = "Parameter Write Request";
            } else if (DecTohex(DecTohex(DecTohex(bytes[0]))) == "46") {
                params.message_type = "Diagnostic Read Request";
            } else {
                params.message_type = "";
            }
        }
    }
	
	
     if(!Object.keys(params.unit_info).length){
      delete params.unit_info;
    }
      if(!Object.keys(params.unit_setup).length){
      delete params.unit_setup;
    }
     if(!Object.keys(params.diagnostic_info).length){
      delete params.diagnostic_info;
    }
     if(!Object.keys(params.contact_reason).length){
      delete params.contact_reason;
    }
     if(!Object.keys(params.alarm_status).length){
      delete params.alarm_status;
    }
      if(!Object.keys(params.signal_strength).length){
      delete params.signal_strength;
    }
     if(!Object.keys(params.battery_status).length){
      delete params.battery_status;
    }
     if(!Object.keys(params.unique_identifier).length){
      delete params.unique_identifier;
    }
    if(!Object.keys(params.last_reset).length){
      delete params.last_reset;
    }
     if(!Object.keys(params.measurement_data).length){
      delete params.measurement_data;
    }
      if(!Object.keys(params.errorhandling).length){
      delete params.errorhandling;
    }
    
    return params;
 }

console.log(Decode(1, Buffer.from(process.argv[2], 'hex')));