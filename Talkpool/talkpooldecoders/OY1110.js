const decodeOY1110Data = (dataEncodedString) =>{
    let dataBytes = Buffer.from(dataEncodedString,'base64');
    console.log(dataBytes)

    // let dataBytes = Buffer.from('0f2e3ccd3338d23931f5','hex');
    // console.log(dataBytes.toString('base64'));

    let parsedValues = []

    let port=3
    if(port===1){
        //status
    }
    else if (port===2){
        if(dataBytes.length % 3 !==0){
            return null;
        }
        capacity = dataBytes.length/3;

        for (index=0;index < capacity;index++){
            let OY1110Data = {};
            d = new Date();
            d.setMinutes(d.getMinutes()-(15*index))

            OY1110Data.Temperature =  ( ( ( ((dataBytes[index*3])<<4) | ((dataBytes[(index*3)+2]&0xF0)>>4) )- 800) / 10.0)
            OY1110Data.RelativeHumidity = ( ( ( ((dataBytes[(index*3)+1])<<4) | (dataBytes[(index*3)+2]&0x0F) )- 250) / 10.0)


            OY1110Data.Time = d.toISOString();
            parsedValues.push(OY1110Data)

        }
    }
    else if (port===3){

        if (dataBytes.length%3 != 1) {
            return null;
            }
      
        dataBytes = dataBytes.slice(1,dataBytes.length)
        capacity =  dataBytes.length / 3
        
        for (index = 0; index < capacity; index++) {
            let OY1110Data = {};
            d = new Date();
            d.setMinutes(d.getMinutes()-(15*index))

            OY1110Data.Temperature =  ( ( ( ((dataBytes[index*3])<<4) | ((dataBytes[(index*3)+2]&0xF0)>>4) )- 800) / 10.0)
            OY1110Data.RelativeHumidity = ( ( ( ((dataBytes[(index*3)+1])<<4) | (dataBytes[(index*3)+2]&0x0F) )- 250) / 10.0)

         

            OY1110Data.Time = d.toISOString();
            parsedValues.push(OY1110Data)

        }
   
    }
    else{
        return null;
    }
    return parsedValues;

}


//const test = decodeOY1110Data('PkQd');
const test = decodeOY1110Data('Dy48zTM40jkx9Q==');
console.log(test);