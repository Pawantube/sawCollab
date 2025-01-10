 const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

// Route to send a message (save it to DB)
router.post('/send', async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Create a new message instance
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      message: message,
    });

    // Save the message to the database
    await newMessage.save();

    // Respond with the saved message
    res.status(200).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to fetch messages between two users
router.get('/conversation/:senderId/:receiverId', async (req, res) => {
	try {
	  const { senderId, receiverId } = req.params;
  
	  // Fetch messages between the two users and populate sender and receiver details
	  const messages = await Message.find({
		$or: [
		  { sender: senderId, receiver: receiverId },
		  { sender: receiverId, receiver: senderId }
		]
	  })
		.populate('sender', 'username email')  // Populate sender's details
		.populate('receiver', 'username email')  // Populate receiver's details
		.sort('timestamp');  // Sort by timestamp
  
	  // Return the messages
	  res.status(200).json(messages);
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ error: 'Server error' });
	}
  });
  
module.exports = router;
