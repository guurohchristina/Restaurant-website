const fetch = require('node-fetch'); // You may need to run 'npm install node-fetch'

exports.handler = async (event) => {
  const data = JSON.parse(event.body);
  
  // 1. Your Hubtel Credentials (from Hubtel Console)
  const clientId = process.env.HUBTEL_CLIENT_ID;
  const clientSecret = process.env.HUBTEL_CLIENT_SECRET;
  
  // 2. Format Credentials for Basic Auth
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const messagePayload = {
    From: "LocoLoca", // Your approved Hubtel Sender ID
    To: "233551218719", // YOUR phone number (must start with 233)
    Content: `LOCO LOCA ORDER:\n${data.quantity}x ${data.item}\nCust: ${data.name}\nPh: ${data.phone}\nAdd: ${data.address}`,
    Type: 0
  };
  
  try {
    const response = await fetch('https://smsc.hubtel.com/v1/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messagePayload)
    });
    
    return { statusCode: 200, body: "Order Sent" };
  } catch (error) {
    return { statusCode: 500, body: error.message };
  }
};