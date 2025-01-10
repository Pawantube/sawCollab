const express = require('express');
const { registerUser, getAllUsers } = require('../controllers/userController');
const bcrypt = require('bcryptjs'); // For comparing hashed passwords
const jwt = require('jsonwebtoken'); // For generating tokens
const router = express.Router();
const User = require('../models/User'); 
router.post('/register', registerUser);
// router.post('/login', async (req, res) => {
// 	const { email, password } = req.body;
  
// 	try {
// 	  console.log('Login request received');
// 	  console.log('Email:', email);
  
// 	  // Find user by email
// 	  const user = await User.findOne({ email });
// 	  if (!user) {
// 		console.log('User not found');
// 		return res.status(400).json({ error: 'Invalid email or password.' });
// 	  }
  
// 	  console.log('User found:', user);
  
// 	  // Compare the provided password with the stored hashed password
// 	  const isPasswordValid = await bcrypt.compare(password, user.password);
// 	  if (!isPasswordValid) {
// 		console.log('Password mismatch');
// 		return res.status(400).json({ error: 'Invalid email or password.' });
// 	  }
  
// 	  // Generate a JWT token
// 	  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
// 	  console.log('Token generated:', token);
  
// 	  // Send token in the response
// 	  res.status(200).json({
// 		message: 'Login successful',
// 		token, // Include token in the response
// 	  });
// 	} catch (error) {
// 	  console.error('Error during login:', error);
// 	  res.status(500).json({ error: 'Server error' });
// 	}
//   });
  

router.post('/login', async (req, res) => {
	const { email, password } = req.body;
  
	try {
	  console.log('Login request received: Email:', email);
  
	  // Check if user exists
	  const user = await User.findOne({ email });
	  if (!user) {
		console.log('User not found for email:', email);
		return res.status(400).json({ error: 'Invalid email or password.' });
	  }
  
	  console.log('User found:', user);
  
	  // Compare the provided password with the stored hashed password
	  const isPasswordValid = await bcrypt.compare(password, user.password);
	  if (!isPasswordValid) {
		console.log('Password mismatch for user:', email);
		return res.status(400).json({ error: 'Invalid email or password.' });
	  }
  
	  // Generate a JWT token
	  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
	  console.log('JWT Token generated:', token);
  
	  // Send response
	  res.status(200).json({
		message: 'Login successful',
		token, // Send token to the client
	  });
	} catch (error) {
	  console.error('Error during login:', error); // Log the error
	  res.status(500).json({ error: 'Internal Server Error' });
	}
  });
  

router.get('/', getAllUsers);

module.exports = router;
