const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash password before saving to database
userSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
	  this.password = await bcrypt.hash(this.password, 10); // Hash the password
	  console.log('Hashed password:', this.password); // Log the hashed password for debugging
	}
	next();
  });
  
const User = mongoose.model('User', userSchema);
module.exports = User;
