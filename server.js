const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '.'))); // Serves your HTML files

app.post('/send-sms', async (req, res) => {
  const data = req.body;
  const apiKey = process.env.MNOTIFY_KEY;
  const message = `🍔 LOCO LOCA ORDER:\nItem: ${data.item}\nQty: ${data.quantity}\nCust: ${data.name}\nPh: ${data.phone}\nAdd: ${data.address}`;
  
  try {
    const response = await fetch(`https://api.mnotify.com/api/sms/quick?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: ["0551218719"],
        sender: "LocoLoca",
        message: message,
        is_schedule: false
      })
    });
    res.status(200).send("Order Sent");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));