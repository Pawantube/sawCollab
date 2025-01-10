// const Message = require('../models/Message'); // Ensure the Message model is correctly defined

// Get all messages between sender and receiver
const getMessages = async (req, res) => {
	const { senderId, receiverId } = req.query;
  
	if (!senderId || !receiverId) {
	  return res.status(400).json({ error: 'Both senderId and receiverId are required.' });
	}
  
	try {
	  const messages = await Message.find({
		$or: [
		  { senderId, receiverId },
		  { senderId: receiverId, receiverId: senderId },
		],
	  })
		.sort({ timestamp: 1 })  // Sort by timestamp in ascending order
		.populate('senderId receiverId', 'username email');  // Optional: Populate sender and receiver info
  
	  res.json(messages);
	} catch (err) {
	  console.error('Error fetching messages:', err);
	  res.status(500).json({ error: 'Unable to fetch messages.' });
	}
  };
  
  // Post a new message
  const postMessage = async (req, res) => {
	const { senderId, receiverId, content } = req.body;
  
	if (!senderId || !receiverId || !content) {
	  return res.status(400).json({ error: 'Missing required fields.' });
	}
  
	try {
	  const newMessage = new Message({
		senderId,
		receiverId,
		content,
	  });
  
	  await newMessage.save(); // Save the message to the database
	  res.status(200).json({ message: 'Message sent successfully.' });
	} catch (err) {
	  console.error('Error saving message:', err);
	  res.status(500).json({ error: 'Failed to send message.' });
	}
  };
  
  module.exports = { getMessages, postMessage };
  