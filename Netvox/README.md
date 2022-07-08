# netvox-decoder

This is a simple payload decoder example for some of the Netvox range of LoRaWAN sensors.

It can be used with The Things Network v2 (TTN), Chirpstack and Node.js command line.

**Note:** this is designed for testing purposes only, I take no responsibility for anyone using this getting missing or incorrect data!


## The Things Network V2 Instructions

Simply copy and paste the code from decoder.js into the Payload Formats tab in your TTN application. Into the decoder box, replacing anything already in there.

## Chirpstack Instructions

1. Create a device profile for Netvox sensors if you don't already have one. Choose LoRaWAN MAC version 1.0.1.
1. In the codec tab, select "Custom JavaScript codec functions".
1. Copy and paste the code from decoder.js into the upper text box, replacing anything that was already in there.

## Node.js Command Line Instructions

Prerequisite: you need to have Node.js installed on your computer. Consult the Node.js website for install instructions.

Run the following command (whilst in the same folder as the decoder.js file):

```node decoder.js 0101011f07aa1176000000```

Replace the example payload shown there with your real one (case doesn't matter).

Paul Hayes - paul@alliot.co.uk