
const  decodeOY1700Data = (dataEncodedString)=> {
    //This is reccommended way to do so first number gives the bytes second gives the string
    //Third argument gives encoding type.
    let dataBytes =  Buffer.from(dataEncodedString, 'base64'); 
    // dataBytes = Buffer.from('3e441d021b01340112','hex');
    // console.log(dataBytes.toString('base64'));
    let parsedValues = [];
   
    port = 2;
    if(port===1){
        //status
    }
    else if(port===2){
        if(dataBytes.length !== 9){
            return null
        }
        console.log("Databytes: - ",dataBytes);
        //console.log(dataBytes.toString('base64'))
        capacity = dataBytes.length / 9;
        for(index = 0;index<capacity;index++){
            let OY1700Data = {}
            //Converting the buffer value to hex string
            dataBytes = dataBytes.toString('hex');
            //Extracting hex string and converting to decimal
            OY1700Data.Temperature =  parseFloat(((parseInt(dataBytes.substring(0,2)+dataBytes.substring(4,5),16)/10)-80).toFixed(1));
            OY1700Data.RelativeHumidity    =  parseFloat(((parseInt(dataBytes.substring(2,4)+dataBytes.substring(5,6),16)/10)-25).toFixed(1))
            OY1700Data.PM1_0       =  parseInt(dataBytes.substring(6,10),16)
            OY1700Data.PM2_5       =  parseInt(dataBytes.substring(10,14),16)
            OY1700Data.PM_10       =  parseInt(dataBytes.substring(14,dataBytes.length),16)
            OY1700Data.Time        = new Date().toISOString()
            parsedValues.push(OY1700Data)
        }

    }
    else if (port == 3){
        if (dataBytes.length %9 !== 1) {
			return null;
		}
        console.log("Databytes: - ",dataBytes);
        capacity = dataBytes.length / 7;
        for(index = 0;index<capacity;index++){
            let OY1700Data = {}
            //Converting the buffer value to hex string
            dataBytes = dataBytes.toString('hex');
            dataBytes = dataBytes.substring(1,dataBytes.length);
            console.log(dataBytes)
            //Extracting hex string and converting to decimal
            OY1700Data.Temperature         =  parseFloat(((parseInt(dataBytes.substring(0,2)+dataBytes.substring(4,5),16)/10)-80).toFixed(1));
            OY1700Data.RelativeHumidity    =  parseFloat(((parseInt(dataBytes.substring(2,4)+dataBytes.substring(5,6),16)/10)-25).toFixed(1))
            OY1700Data.PM1_0               =  parseInt(dataBytes.substring(6,10),16)
            OY1700Data.PM2_5               =  parseInt(dataBytes.substring(10,14),16)
            OY1700Data.PM_10               =  parseInt(dataBytes.substring(14,dataBytes.length),16)
            OY1700Data.Time                = new Date().toISOString()
            parsedValues.push(OY1700Data)
        }
    }
    else{
        return null;
    }
    return parsedValues
}

// const test = decodeOY1700Data('PkQdAhsBNAES');
const test = decodeOY1700Data('PSWqAAAAAAAC');
console.log(test);