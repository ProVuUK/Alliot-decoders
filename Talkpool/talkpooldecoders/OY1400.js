
const decodeOY1400Data = (dataEncodedString) =>{
    const lastByte = dataEncodedString.substring(dataEncodedString.length - 2,dataEncodedString.length);
    if (lastByte === '00') {
     dataEncodedString = dataEncodedString.substring(0, dataEncodedString.length - 2)
    }
   let  dataBytes    = Buffer.from(dataEncodedString,'base64')
   dataBytes = [...Buffer.from(dataBytes)];
   console.log(dataBytes);

    let parsedValues = []; 
    port = 1;
    if(port===1){
        if(dataBytes.length % 6 ===0){
            capacity = dataBytes.length /6;
            let OY1400Data = {}
            parsedValues = []; 
            for(index=0;index<capacity;index++){
                const val = (parseInt(dataBytes[index * 6]) << 8) + parseInt(dataBytes[(index * 6) + 1]);
                if(val===289){
                    OY1400Data.AnalogCh1 = parseFloat(( ((parseInt(dataBytes[(index * 1) + 2]) << 8) + (parseInt(dataBytes[(index * 1) + 3])) ) ) * 0.5125 ).toFixed(4);
                    OY1400Data.AnalogCh2 = parseFloat(( ((parseInt(dataBytes[(index * 1) + 4]) << 8) + (parseInt(dataBytes[(index * 1) + 5])) ) ) * 0.5125 ).toFixed(4);
                    OY1400Data.DigitalCh2 = 0;
                    OY1400Data.DigitalCh1 = 0;
                    OY1400Data.Time      = new Date().toISOString();
                    parsedValues.push(OY1400Data);
                } else {
                    OY1400Data.AnalogCh1 = 0;
                    OY1400Data.DigitalCh2 = 0;
                    OY1400Data.DigitalCh1 = 0;
                    OY1400Data.AnalogCh2 = 0;
                    OY1400Data.Time      = new Date().toISOString();
                    parsedValues.push(OY1400Data);    
                }
            }
            
        }

        //01211c1800001be000001be00008
        if(dataBytes.length % 14 ===0){
            capacity = 3;
            parsedValues = []; 
            for(index=0;index<capacity;index++){
                let OY1400Data = {}
                OY1400Data.AnalogCh1 =  parseFloat(( ((parseInt(dataBytes[(index * 4) + 2]) << 8) + (parseInt(dataBytes[(index * 4) + 3])) ) ) * 0.5125 ).toFixed(4);
                OY1400Data.AnalogCh2 =  parseFloat(( ((parseInt(dataBytes[(index * 4) + 4] << 8)) + (parseInt(dataBytes[(index * 4) + 5])) ) ) * 0.5125 ).toFixed(4);
                OY1400Data.Time      = new Date().toISOString();
                OY1400Data.DigitalCh2 = 0;
                OY1400Data.DigitalCh1 = 0;
                parsedValues.push(OY1400Data); 
            }
            
        }

        // 0122011738002188
        //This was giving error in go as it was picking up bytes not found so i had to modity it a bit.
        if (dataBytes.length%8===0){
            parsedValues = []; 
            const capacity = dataBytes.length / 4
            for (index = 0; index < capacity; index++) {
                let OY1400Data = {};
                const val = (parseInt(dataBytes[index * 8]) << 8) + parseInt(dataBytes[(index * 8) + 1]);
                if (val === 290) {
                    OY1400Data.DigitalCh1 =  Number(parseFloat(( ((parseInt(dataBytes[(index * 4) + 2]) << 8) + (parseInt(dataBytes[(index * 4) + 3])) ) ) * 0.5125 ).toFixed(0));
                    OY1400Data.AnalogCh2 =   parseFloat(( ((parseInt(dataBytes[(index * 4) + 4]) << 8) + (parseInt(dataBytes[(index * 4) + 6])) ) ) * 0.5125 ).toFixed(4);
                    OY1400Data.DigitalCh2 = 0;
                    OY1400Data.AnalogCh1 = 0;
                    OY1400Data.Time      = new Date().toISOString();
                    parsedValues.push(OY1400Data);
                } else {
                    OY1400Data.AnalogCh1 = 0;
                    OY1400Data.DigitalCh2 = 0;
                    OY1400Data.DigitalCh1 = 0;
                    OY1400Data.AnalogCh2 = 0;
                    OY1400Data.Time      = new Date().toISOString();
                    parsedValues.push(OY1400Data);    
                }
               
            }
            
        }

        //0123479000
        if (dataBytes.length%4===0){
            const capacity = dataBytes.length / 4  
            parsedValues = []; 
            for (index = 0; index < capacity; index++) {
                let OY1400Data = {}
                const val = (parseInt(dataBytes[index * 4]) << 8) + parseInt(dataBytes[(index * 4) + 1]);
                if (val===292) {
                    //float64(uint16(databytes[(index*5)+2])<<8+uint16(databytes[(index*5)+3])
                    OY1400Data.DigitalCh1 = Number(parseFloat(parseInt(dataBytes[(index * 4) + 2])).toFixed(0));
                    OY1400Data.DigitalCh2 = Number(parseFloat(parseInt(dataBytes[(index * 4) + 3])).toFixed(0));
                    OY1400Data.AnalogCh1 = 0;
                    OY1400Data.AnalogCh2 = 0;
                    OY1400Data.Time      = new Date().toISOString();
                    parsedValues.push(OY1400Data);    
                } else {
                    OY1400Data.AnalogCh1 = 0;
                    OY1400Data.DigitalCh2 = 0;
                    OY1400Data.DigitalCh1 = 0;
                    OY1400Data.AnalogCh2 = 0;
                    OY1400Data.Time      = new Date().toISOString();
                    parsedValues.push(OY1400Data);    
                }  
            } 
            
        }
        
        if (dataBytes.length%5===0){
            const capacity = dataBytes.length / 5
            parsedValues = [];
            for (index = 0; index < capacity; index++) {
                let OY1400Data = {}
                const val = (parseInt(dataBytes[index * 5]) << 8) + parseInt(dataBytes[(index * 5) + 1]);
                if (val===291) {
                    //float64(uint16(databytes[(index*5)+2])<<8+uint16(databytes[(index*5)+3])
                    OY1400Data.AnalogCh1 = parseFloat(( ((parseInt(dataBytes[(index * 5) + 2]) << 8) + (parseInt(dataBytes[(index * 5) + 3])) ) ) * 0.5125 ).toFixed(4);
                    OY1400Data.DigitalCh2 = Number(parseFloat(( ((parseInt(dataBytes[(index * 5) + 4]) << 8) + (parseInt(dataBytes[(index * 5) + 6])) ) )  * 0.5125).toFixed(0));
                    OY1400Data.DigitalCh1 = 0;
                    OY1400Data.AnalogCh2 = 0;
                    OY1400Data.Time      = new Date().toISOString();
                    parsedValues.push(OY1400Data);    
                } else {
                    OY1400Data.AnalogCh1 = 0;
                    OY1400Data.DigitalCh2 = 0;
                    OY1400Data.DigitalCh1 = 0;
                    OY1400Data.AnalogCh2 = 0;
                    OY1400Data.Time      = new Date().toISOString();
                    parsedValues.push(OY1400Data);    
                }
                
            } 
            
        }

        //01240101000100000001
        if (dataBytes.length%10===0) {
            const capacity = dataBytes.length-1;
            parsedValues = [];
            for (index = 4; index < capacity; index++) {
                let OY1400Data = {}
                const val = (parseInt(dataBytes[index * 2]) << 8) + parseInt(dataBytes[(index * 2) + 1]);
                if (val===292) {
                    OY1400Data.DigitalCh1 = Number(parseFloat(( ((parseInt(dataBytes[(index * 2) + 2]) << 8) + (parseInt(dataBytes[(index * 2) + 3])) ) ) * 0.5125 ).toFixed(0));
                    OY1400Data.DigitalCh2 = Number(parseFloat(( ((parseInt(dataBytes[(index * 2) + 4]) << 8) + (parseInt(dataBytes[(index * 2) + 6])) ) ) * 0.5125 ).toFixed(0));
                    OY1400Data.AnalogCh1 = 0;
                    OY1400Data.AnalogCh2 = 0;
                    OY1400Data.Time      = new Date().toISOString();
                    parsedValues.push(OY1400Data);    
                } else {
                    OY1400Data.AnalogCh1  = 0;
                    OY1400Data.DigitalCh2 = 0;
                    OY1400Data.DigitalCh1 = 0;
                    OY1400Data.AnalogCh2  = 0;
                    OY1400Data.Time       = new Date().toISOString();
                    parsedValues.push(OY1400Data);    
                }
              
            }     
        
        }

    }

    else{
        return null;
    }

    return parsedValues;  
}

const test = decodeOY1400Data('01211c1800001be000001be00008');
console.log(test);