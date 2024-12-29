const express = require('express');
const router = express.Router();
const Code = require('../models/Codes');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');

router.get('/fetchcode', fetchuser, async (req, res) => {
    try {
        const code = await Note.find({ user: req.user.id, qid: req.body.qid });
        console.log(`from note side:${req.user.id}`);
        res.json(note)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }
})

module.exports = router;