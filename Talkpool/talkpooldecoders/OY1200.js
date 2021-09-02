
const  decodeOY1200Data = (dataEncodedString)=> {

   
    //This is reccommended way to do so first number gives the bytes second gives the string
    //Third argument gives encoding type.
    let dataBytes =  Buffer.from(dataEncodedString, 'base64');
        //This Will Return 12 Byte Value e.g.  b5 eb 2d 77 3b a6 21
    let parsedValues = [];
   
    port = 1;
    if(port===1){
        if(dataBytes.length !== 12){
            return null
        }
        console.log("Databytes: - ",dataBytes);
        capacity = dataBytes.length / 12;
        // const number = dataBytes[2].toString(16) + dataBytes[3].toString(16)
        // console.log(parseInt(number,16));
        console.log();
        for(index = 0;index<capacity;index++){
            let OY1200Data = {
                Time        : String,
                CO2Raw      : 0,
                CO2Filtered : 0,
                Temperature : 0.0,
                Humidity    : 0.0
            }
            //Converting the buffer value to hex string
            dataBytes = dataBytes.toString('hex');
           
            //Extracting hex string and converting to decimal
            OY1200Data.CO2Raw      =  parseInt(dataBytes.substring(4,8),16)
            OY1200Data.CO2Filtered =  parseInt(dataBytes.substring(8,12),16)
            OY1200Data.Temperature =  parseInt(dataBytes.substring(12,16),16)/100
            OY1200Data.Humidity    =  parseInt(dataBytes.substring(16,20),16)/100
            OY1200Data.Time        = new Date().toISOString()

            parsedValues.push(OY1200Data)
        }

    }else{
        return null;
    }

    return parsedValues

}


const test = decodeOY1200Data('ASEBkQGZCK8KBQAA');
console.log(test);