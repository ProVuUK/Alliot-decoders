const decodeOY1100data = (dataEncodedString) =>{
    let dataBytes = Buffer.from(dataEncodedString,'base64');

    if(dataBytes.length % 3 !==0){
        return null;
    }
    capacity = dataBytes.length / 3;
    let parsedValues = [];

    for(index=0;index<capacity;index++){
        let OY1100Data  = {}
        d = new Date();
        //time setting
        d.setHours(d.getHours()-(index*2))
        OY1100Data.Temperature = parseFloat((((dataBytes[(index*3)]<<4) | ((dataBytes[(index*3)+2]& 0xF0)>>4))*0.1).toFixed(1));
        OY1100Data.RelativeHumidity = parseFloat((((dataBytes[(index*3)+1]<<4) | (dataBytes[(index*3)+2]&0x0F) ) *0.1).toFixed(1)) ;
        OY1100Data.Time = d.toISOString();
        parsedValues.push(OY1100Data);
    }
    return parsedValues;
}

const test = decodeOY1100data('EhrXEhpG6RnO');
console.log(test);