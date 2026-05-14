const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '.')));

app.post('/send-sms', async (req, res) => {
  const data = req.body;
  const apiKey = process.env.MNOTIFY_KEY;
  
  // 1. FIX: Changed Sender to "mNotify" for guaranteed delivery during testing
  const message = `🍽️LOCO LOCA ORDER:\nItem: ${data.item}\nQty: ${data.quantity}\nAmount:${data.price}\nCustomer: ${data.name}\nPhone: ${data.phone}\nAddress: ${data.address}\nSpecial Request: ${data.special}`;
  
const customerMessage = `Hello ${data.name}, thank you for your Loco Loca order! We have received it and will call you shortly to confirm.`;
  
  try {
    const response = await fetch(`https://api.mnotify.com/api/sms/quick?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: ["0551218719"],
        sender: "Loco Loca", // Use "mNotify" as sender until "LocoLoca" is approved by them
        message: message,
        is_schedule: false
      })
    });
    
    const customerRes = await fetch(`https://api.mnotify.com/api/sms/quick?key=${apiKey}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipient: [data.phone], // This pulls the customer's number
    sender: "Loco Loca",
    message: customerMessage,
    is_schedule: false
  })
});
    
    
    
    
    // 2. FIX: Capture the actual response from mNotify to see why it failed
    const result = await response.json();
    console.log("mNotify API Result:", result);
    
    if (result.status === "success") {
      res.status(200).send("Order Sent");
    } else {
      // This will show up in your Render Logs
      console.error("mNotify Error Details:", result.message);
      res.status(400).send(`SMS Failed: ${result.message}`);
    }
    
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));