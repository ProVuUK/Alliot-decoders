const {processDecryptedPayload} = require('./BobPayloadProcessor');
const payload = '52017f7f003802000108460c00000000007fffffffffffffffffff';
const reportMessage = processDecryptedPayload(payload);

console.log(reportMessage);
