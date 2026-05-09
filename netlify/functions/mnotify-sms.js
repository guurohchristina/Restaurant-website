const fetch = require('node-fetch');

exports.handler = async (event) => {
  const data = JSON.parse(event.body);
  
  // This pulls your secret key from the Netlify settings (Step 3)
  const apiKey = process.env.MNOTIFY_KEY;
  
  // Formatting the SMS that YOU will receive
  const message = `🍔 LOCO LOCA ORDER:\n` +
    `------------------\n` +
    `Item: ${data.item} (${data.quantity}x)\n` +
    `Cust: ${data.name}\n` +
    `Phone: ${data.phone}\n` +
    `Add: ${data.address}\n` +
    `Notes: ${data.notes}`;
  
  // mNotify API Quick SMS Endpoint
  const url = `https://api.mnotify.com/api/sms/quick?key=${apiKey}`;
  
  const payload = {
    recipient: ["0551218719"], // YOUR number where you receive orders
    sender: "LocoLoca", // Your approved Sender ID
    message: message,
    is_schedule: false
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Order processed" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};