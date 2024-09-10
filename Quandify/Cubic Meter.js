/*******************************************************************************
   ____                        _ _  __
  / __ \                      | (_)/ _|
 | |  | |_   _  __ _ _ __   __| |_| |_ _   _
 | |  | | | | |/ _` | '_ \ / _` | |  _| | | |
 | |__| | |_| | (_| | | | | (_| | | | | |_| |
  \___\_\\__,_|\__,_|_| |_|\__,_|_|_|  \__, |
                                        __/ |
                                       |___/
* QUANDIFY CONFIDENTIAL
* __________________
*
*  [2017] Quandify AB - https://quandify.com
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Quandify AB and its suppliers,
* if any. The intellectual and technical concepts contained
* herein are proprietary to Quandify AB
* and its suppliers and may be covered by U.S. and Foreign Patents,
* patents in process, and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Quandify AB.
*******************************************************************************/
/* CubicMeter LoRaWAN decoder /*

/* Uplink Messages 
- periodicReport: sent every 1h
- alarmReport: pushed periodicReport if urgent water leakage alarm occurs

Example periodicReport payload: 
bytes: 8fb90400a3013400000000000000c2a904008a181a0203e0e752554f
Decoded:
"ambient_temp": "19.5°C",
"battery_status": "OK",
"error_code": 419,
"leak_status": "Medium",
"total_volume": "52 L",
"water_temp_max": "22.5°C",
"water_temp_min": "21°C"

*******************************************************************************/
function decodeUplink(input) {
  var decoded;
  if (
    getPacketType(input.fPort) == "periodicReport" ||
    getPacketType(input.fPort) == "alarmReport"
  ) {
    decoded = periodicReportDecoder(input.bytes);
  }
  return {
    data: {
      type: getPacketType(input.fPort),
      decoded: decoded,
      hexBytes: toHexString(input.bytes),
      fport: input.fPort,
      length: input.bytes.length
    },
    warnings: [],
    errors: []
  };
}
var LSB = true;

var periodicReportDecoder = function(bytes) {
  const buffer = new ArrayBuffer(bytes.length);
  const data = new DataView(buffer);
  if (bytes.length < 28) {
    throw new Error("payload too short");
  }
  for (const index in bytes) {
    data.setUint8(index, bytes[index]);
  }

  return {
    error_code: data.getUint16(4, LSB) ? data.getUint16(4, LSB) : "No Error", // current error code
    total_volume: data.getUint32(6, LSB) + " L", // All-time aggregated water usage in litres
    leak_status: getLeakState(data.getUint8(22)), // current water leakage state
    battery_status: decodeBatteryStatus(data.getUint8(23), data.getUint8(24)), // current battery state
    water_temp_min: decodeTemperature_C(data.getUint8(25)), // min water temperature since last periodicReport
    water_temp_max: decodeTemperature_C(data.getUint8(26)), // max water temperature since last periodicReport
    ambient_temp: decodeTemperature_C(data.getUint8(27)) // current ambient temperature
  };
};

var decodeBatteryStatus = function(input1, input2) {
  var level = 1800 + (input2 << 3); // convert to status
  if (level <= 3100) return "LOW_BATTERY";
  else return "OK";
};

var decodeTemperature_C = function(input) {
  return input * 0.5 - 20 + "°C"; // to °C
};

// More packet types only available when using Quandify platform API
var getPacketType = function(type) {
  if (type == 0) {
    return "ping"; // empty ping message
  } else if (type == 1) {
    return "periodicReport"; // periodic message
  } else if (type == 2) {
    return "alarmReport"; // same as periodic but pushed due to an urgent alarm
  } else return "Unknown";
};

/* Smaller water leakages only availble when using Quandify platform API 
as it requires cloud analytics */
var getLeakState = function(input) {
  if (input <= 2) {
    return "NoLeak";
  } else if (input == 3) {
    return "Medium";
  } else if (input == 4) {
    return "Large";
  } else return "N/A";
};

function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2).toUpperCase();
  }).join("");
}
