
const  decodeOY1320Data = (dataEncodedString)=> {

    
    //This is reccommended way to do so first number gives the bytes second gives the string
    //Third argument gives encoding type.
    dataBytes    = Buffer.from(dataEncodedString,'base64');
    dst    = dataBytes.toString('hex');
    first = dst.substring(4,dst.length);
    // dataBytes = Buffer.from('012100001738','hex');    
    let parsedValues = [];
    if(dataBytes.length % 6 === 0){
        let OY1320Data = {};
        console.log("Databytes: - ",dataBytes);
        capacity = dataBytes.length / 6;
        for(i =0;i<capacity;i++){
            
            OY1320Data.MeterReading = parseInt(first.substring(4,8),16);
            OY1320Data.Status       = "0";
            OY1320Data.Time         = new Date().toISOString();
            parsedValues.push(OY1320Data);
        }
    }
    if(dataBytes.length % 9 === 0){
        let OY1320Data = {};
        console.log("Databytes: - ",dataBytes);
        capacity = dataBytes.length / 9;
        for(i =0;i<capacity;i++){
            OY1320Data.MeterReading = parseInt(first.substring(4,8),16);
            OY1320Data.Status       = dst.substring(8,9);
            OY1320Data.Time         = new Date().toISOString();
            parsedValues.push(OY1320Data);
        }
    }
    return parsedValues
}


const test = decodeOY1320Data('ASEAABc4');
//const test = decodeOY1320Data('ASEAAAAUASAI');
console.log(test);