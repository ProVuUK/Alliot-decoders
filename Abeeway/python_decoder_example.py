
logging.info("Kerlink POST request from '{}':\nURL: {}\nBody: {}".format(request.remote_addr, request.url, request.json))
raw_payload = request.json
f_port = raw_payload['fPort']
dev_eui = raw_payload['endDevice']['devEui']
sensor_payload = raw_payload['payload']
f_cnt_up = raw_payload['fCntUp']
logging.info("fPort: {} devEUI: {} payload: {}".format(f_port, dev_eui, sensor_payload))
payload_bytes = bytes.fromhex(sensor_payload)
batt_voltage = payload_bytes[2]*0.0055+2.8
batt_percentage = int((payload_bytes[2]/255)*100)
temperature = (payload_bytes[3]*0.5)-44
ack_token = payload_bytes[4] >> 4

# decode status
sos_mode = bool(payload_bytes[1] & 0x10)
tracking_state = bool(payload_bytes[1] & 0x08)
moving = bool(payload_bytes[1] & 0x04)
periodic_pos = bool(payload_bytes[1] & 0x02)
pos_on_demand = bool(payload_bytes[1] & 0x01)
operation_mode = payload_bytes[1] >> 5

logging.info("Abeeway Tracker uplink status. SOS Mode: {}, Tracking State: {}, Moving: {}, Periodic Position: {}, Position on Demand: {}, Operation Mode: {}".format(sos_mode, tracking_state, moving, periodic_pos, pos_on_demand, operation_mode))
logging.info("Device status. Batt %age:{} Batt V: {} Temperature: {}".format(batt_percentage, batt_voltage, temperature))
latitude = longitude = None
if payload_bytes[0] == 0x03 and (payload_bytes[4] & 0x0f) == 0x00:
    # GPS data
    lat_raw = ((payload_bytes[6] << 16) | (payload_bytes[7] << 8) | payload_bytes[8])
    lat_raw = lat_raw << 8
    if lat_raw > 0x7FFFFFFF:
        lat_raw = lat_raw - 0x100000000
    latitude = lat_raw/10000000
    lng_raw = ((payload_bytes[9] << 16) | (payload_bytes[10] << 8) | payload_bytes[11])
    lng_raw = lng_raw << 8
    if lng_raw > 0x7FFFFFFF:
        lng_raw = lng_raw - 0x100000000
    longitude = lng_raw/10000000
    accuracy = payload_bytes[12]*3.9
    age = payload_bytes[5]*8
    source = "gps"
elif payload_bytes[0] == 0x03 and (payload_bytes[4] & 0x0f) == 0x09:
    # wifi sniffer data
    bssid0 = ':'.join(list(map(lambda x: ('{:02x}'.format(x)), payload_bytes[6:12])))
    bssid1 = ':'.join(list(map(lambda x: ('{:02x}'.format(x)), payload_bytes[13:19])))
    bssid2 = ':'.join(list(map(lambda x: ('{:02x}'.format(x)), payload_bytes[20:26])))
    bssid3 = ':'.join(list(map(lambda x: ('{:02x}'.format(x)), payload_bytes[27:33])))
    try:
        rssi0 = payload_bytes[12]-256 if payload_bytes[12]>127 else payload_bytes[12]
    except IndexError:
        rssi0 = ''
    try:
        rssi1 = payload_bytes[19]-256 if payload_bytes[19]>127 else payload_bytes[19]
    except IndexError:
        rssi1 = ''
    try:
        rssi2= payload_bytes[26]-256 if payload_bytes[26]>127 else payload_bytes[26]
    except IndexError:
        rssi2 = ''
    try:
        rssi3 = payload_bytes[33]-256 if payload_bytes[33]>127 else payload_bytes[33]
    except IndexError:
        rssi3 = ''
                
    gmaps = googlemaps.Client(key=gmaps_key)
    result = gmaps.geolocate(wifi_access_points=[
        {'macAddress': bssid0, 'signalStrength': rssi0},
        {'macAddress': bssid1, 'signalStrength': rssi1},
        {'macAddress': bssid2, 'signalStrength': rssi2},
        {'macAddress': bssid3, 'signalStrength': rssi3}])
    latitude = float(result['location']['lat'])
    longitude = float(result['location']['lng'])
    accuracy = 0
    age = 0
    source = "wifi"
elif payload_bytes[0] == 0x05:
    logging.info("Abeeway heartbeat for: {}".format(dev_eui))
if latitude and longitude:
    logging.info("Location data. lat:{} lng:{} accuracy: {} age: {} source:{}".format(latitude, longitude, accuracy, age, source))
