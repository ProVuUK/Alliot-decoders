
const  decodeOY1210Data = (dataEncodedString)=> {

    
    //This is reccommended way to do so first number gives the bytes second gives the string
    //Third argument gives encoding type.
    let dataBytes =  Buffer.from(dataEncodedString, 'base64');
    //dataBytes = Buffer.from('3e441d021b','hex');
    
    
    let parsedValues = [];
   
    port = 2;
    if(port===1){
        //status
    }
    else if(port===2){
        if(dataBytes.length !== 5){
            return null
        }
        console.log("Databytes: - ",dataBytes);
        //console.log(dataBytes.toString('base64'))
        capacity = dataBytes.length / 5;
        for(index = 0;index<capacity;index++){
            let OY1210Data = {}
            //Converting the buffer value to hex string
            dataBytes = dataBytes.toString('hex');
            //Extracting hex string and converting to decimal
            OY1210Data.Temperature =  parseFloat(((parseInt(dataBytes.substring(0,2)+dataBytes.substring(4,5),16)/10)-80).toFixed(1));
            OY1210Data.Humidity    =  parseFloat(((parseInt(dataBytes.substring(2,4)+dataBytes.substring(5,6),16)/10)-25).toFixed(1))
            OY1210Data.CO2         =  parseInt(dataBytes.substring(6,10),16)
            OY1210Data.Time        = new Date().toISOString()
            parsedValues.push(OY1210Data)
        }

    }
    else if (port == 3){
        if (dataBytes.length %5 !== 1) {
			return null
		}
        console.log("Databytes: - ",dataBytes);
        capacity = dataBytes.length / 5;
        // const number = dataBytes[2].toString(16) + dataBytes[3].toString(16)
        // console.log(parseInt(number,16));
        console.log();
        for(index = 0;index<capacity;index++){
            let OY1210Data = {}
            //Converting the buffer value to hex string
            dataBytes = dataBytes.toString('hex');
            dataBytes = dataBytes.substring(1,dataBytes.length);
            //Extracting hex string and converting to decimal
            OY1210Data.Temperature =  parseFloat(((parseInt(dataBytes.substring(0,2)+dataBytes.substring(4,5),16)/10)-80).toFixed(1));
            OY1210Data.Humidity    =  parseFloat(((parseInt(dataBytes.substring(2,4)+dataBytes.substring(5,6),16)/10)-25).toFixed(1))
            OY1210Data.CO2         =  parseInt(dataBytes.substring(6,dataBytes.length),16)
            OY1210Data.Time        = new Date().toISOString()
            parsedValues.push(OY1210Data)
        }
    }
    
    else{
        return null;
    }

    return parsedValues

}


const test = decodeOY1210Data('PkQdAhs=');
// const test = decodeOY1210Data('NkH4AaE=');
console.log(test);