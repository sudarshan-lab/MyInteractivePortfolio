const express = require('express');
const router = express.Router();
const Message = require('../Models/MessageModel');


router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }); 
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { content, sender, email, isPrivate } = req.body;
    const message = new Message({ content, sender, email, isPrivate });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
