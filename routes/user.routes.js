const express=require('express')
const jwt=require("jsonwebtoken")
const {body,validationResult}=require('express-validator')
const bcrypt=require('bcrypt')
const router=express.Router()
const User=require('../Model/user.model')

router.get('/test', (req, res) => {
  res.json({ message: "User route is working" });
});

// Register user
router.post('/register',
  body('username').trim().isLength({ min: 3 }),
  body('email').trim().isEmail(),
  body('password').trim().isLength({ min: 8 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: 'Invalid input' });
      }

      const { username, password, email } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password.trim(), 10);

      const newUser = await User.create({
        username,
        password: hashedPassword,
        email
      });

      res.status(201).json({ message: "User registered successfully", user: { username: newUser.username, email: newUser.email } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// Login user
router.post('/login',
  body('username').trim().isLength({ min: 3 }),
  body('password').trim().isLength({ min: 8 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: "Invalid input" });
      }

      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) return res.status(400).json({ message: "Invalid username" });

      const isMatch = await bcrypt.compare(password.trim(), user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid password" });

      const token = jwt.sign(
        { userId: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ message: "Login successful", token });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);
module.exports=router