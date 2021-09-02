# Use Adeunis codec library in thethingsnetwork.org

1) Open script.txt and copy its content in "Payload Formats" section in thethingsnetwork.org console. 

2) Modify at the end of the code the following line to specify the product to decode :

``` javascript
decoder.setDeviceType("temp");
```

Possible values are :
* `analog` => 'Analog device'
* `comfort` => 'Comfort device'
* `comfort2` => 'Comfort 2 device'
* `drycontacts` => 'Dry Contacts device'
* `drycontacts2` => 'Dry Contacts 2 device'
* `deltap` => 'Delta P device'
* `motion` => 'Motion device'
* `pulse` => 'Pulse device'
* `pulse3` => 'Pulse 3 device'
* `pulse4` => 'Pulse 4 device'
* `pulse4nbiot` => 'Pulse 4 NB-IoT device'
* `repeater` => 'Repeater device'
* `temp` => 'Temp device'
* `temp3` => 'Temp 3 device'
* `temp4` => 'Temp 4 device'
* `ticCbeLinkyMono` => 'TIC CBE/LINKY MONO device'
* `ticCbeLinkyTri` => 'TIC CBE/LINKY TRI device'
* `ticPmePmi` => 'TIC PME-PMI device'

