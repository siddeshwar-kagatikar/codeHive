const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

router.post(
    '/',
    [
        body('name', 'Enter a valid name').isLength({ min: 3 }),
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    ],
    async (req, res) => {
        // Validate the request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Create the user with validated data
            const { name, email, password } = req.body;
            const user = await User.create({ name, email, password });
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

module.exports = router;
