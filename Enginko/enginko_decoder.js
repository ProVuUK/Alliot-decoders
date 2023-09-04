
/*                         	  _       _         
 *                 	         (_)     | |        
 *            ___ _ __   __ _ _ _ __ | | _____  
 *           / _ \ '_ \ / _` | | '_ \| |/ / _ \ 
 *          |  __/ | | | (_| | | | | |   < (_) |
 *           \___|_| |_|\__, |_|_| |_|_|\_\___/ 
 *                       __/ |                  
 *                      |___/                   
 *
 *
 *          WEB:    https://www.enginko.com
 *          E-MAIL: info@enginko.com
 */

/*
 *
 * Modified by Paul Hayes Alliot Technologies Sept 2023 for internal testing.
 *
 */

/*
 * VERSION: 1.0.0
 * 
 * INPUT:
 * payload              -> MCF-LW12KIO / MCF-LW12PLG / MCF-LW12MET / MCF-LW13IO / MCF-LW13MIO payload
 * 
 * OUTPUT:
 * date                 -> date of measurement. See @parseDate
 * inputStatus8_1       -> first input byte status | 0 off - 1 on
 * inputStatus9_16      -> second input byte status | 0 off - 1 on
 * inputStatus17_24     -> third input byte status | 0 off - 1 on
 * inputStatus25_32     -> fourth input byte status | 0 off - 1 on
 * outputStatus8_1      -> first output byte status | 0 off - 1 on
 * outputStatus9_16     -> second output byte status | 0 off - 1 on
 * outputStatus17_24    -> third output byte status | 0 off - 1 on
 * outputStatus25_32    -> fourth output byte status | 0 off - 1 on
 * inputTrigger8_1      -> first input byte event | 0 not triggered - 1 triggered
 * inputTrigger9_16     -> second input byte event | 0 not triggered - 1 triggered
 * inputTrigger17_24    -> third input byte event | 0 not triggered - 1 triggered
 * inputTrigger25_32    -> fourth input byte event | 0 not triggered - 1 triggered
 */
function parseIO(payload) {
    const uplinkId = payload.substring(0, 2);
    if (uplinkId.toUpperCase() === '0A') {
        var firstByte = [];
        var secondByte = [];
        var thirdByte = [];
        var fourthByte = [];

        var k = 0;
        for (var i = 0; i < 3; i++) {
            firstByte[i] = parseInt(payload.substring(k + 10, k + 10 + 2), 16);
            secondByte[i] = parseInt(payload.substring(k + 10 + 2, k + 10 + 4), 16);
            thirdByte[i] = parseInt(payload.substring(k + 10 + 4, k + 10 + 6), 16);
            fourthByte[i] = parseInt(payload.substring(k + 10 + 6, k + 10 + 8), 16);

            k = k + 8;
        }

	return {
	    "date": parseDate(payload.substring(2, 10)),
        "inputStatus1_8": firstByte[0].toString(2),
        "inputStatus9_16": secondByte[0].toString(2),
	    "inputStatus17_24": thirdByte[0].toString(2),
	    "inputStatus25_32": fourthByte[0].toString(2),
	    "outputStatus1_8": firstByte[1].toString(2),
	    "outputStatus9_16": secondByte[1].toString(2),
	    "outputStatus17_24": thirdByte[1].toString(2),
	    "outputStatus25_32": fourthByte[1].toString(2),
	    "inputTrigger1_8": firstByte[2].toString(2),
	    "inputTrigger9_16": secondByte[2].toString(2),
	    "inputTrigger17_24": thirdByte[2].toString(2),
	    "inputTrigger25_32": fourthByte[2].toString(2)
	}
    } else {
        return null;
    }
}

/*
 * VERSION: 1.0.0
 * 
 * INPUT:
 * payload  -> payload substring to decode
 * 
 * OUTPUT:
 * date     -> date decoded from payload
 */
function parseDate(payload) {
    var date = new Date();

    var binary = Number(parseInt(reverseBytes(payload), 16)).toString(2).padStart(32, '0');
    var year = parseInt(binary.substring(0, 7), 2) + 2000;
    var month = parseInt(binary.substring(7, 11), 2);
    var day = parseInt(binary.substring(11, 16), 2);
    var hour = parseInt(binary.substring(16, 21), 2);
    var minute = parseInt(binary.substring(21, 27), 2);
    var second = parseInt(binary.substring(27, 32), 2) * 2;

    date = new Date(year, month - 1, day, hour, minute, second, 0).toLocaleString();
    return date;
}

/*
 * VERSION: 1.0.0
 * 
 * INPUT:
 * bytes    -> string of bytes to invert for LSB
 * 
 * OUTPUT:
 * reversed -> reversed string of bytes in LSB
 */
function reverseBytes(bytes) {
    var reversed = bytes;
    if (bytes.length % 2 === 0) {
        reversed = "";
        for (var starting = 0; starting + 2 <= bytes.length; starting += 2) {
            reversed = bytes.substring(starting, starting + 2) + reversed;
        }
    }
    return reversed;
}

try {
    var tempPayload = parseIO(msg.payload.payload);
    msg.payload = [{
        measurement: "LW13IO",
        fields: tempPayload,
        tags: { "devEUI": msg.payload.endDevice.devEui }
    }];
    return msg;
} catch (err) {
    msg.payload = err;
}
