const express = require('express');
const router = express.Router();
const Code = require('../models/Codes');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const { checkPlagiarism } = require('../plag');

router.post('/plagcheck', fetchuser, async (req, res) => {
    try {
        const { qid } = req.body;

        // Only get code for a particular question
        const allcode = await Code.find({ qid });

        // Structure submissions as expected by checkPlagiarism
        const submissions = allcode.map(entry => ({
            studentId: entry.user.toString(),  // Ensure string format
            code: entry.code
        }));

        // Call plagiarism checker
        const plagiarismResults = checkPlagiarism(submissions);

        res.json({ qid, comparisons: plagiarismResults });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Some error occurred" }); // Send proper JSON error
    }
});

router.post('/fetchcode', fetchuser, async (req, res) => {
    try {
        const code = await Code.find({ user: req.user.id, qid: req.body.qid, language: req.body.language });
        console.log(`from note side:${req.user.id}`);
        if(code.length === 0) res.json("");
        else res.json(code[0].code);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }
})

router.post('/fetchallcode', fetchuser, async (req, res) => {
    try {
        const code = await Code.find();
        if(code.length === 0) res.json([]);
        else res.json(code);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }
})

router.post('/savecode', fetchuser, async (req, res) => {
    try {
        const { qid, code, language, solved } = req.body;
        const findcode = await Code.find({ user: req.user.id, qid: req.body.qid, language: req.body.language, solved: req.body.solved });
        console.log("body in backend:",req.body);
        if(findcode.length !== 0){
            const code = await Code.findOneAndUpdate({ user: req.user.id, qid: req.body.qid, language: req.body.language }, { code: req.body.code, solved: req.body.solved });
            return res.json(code);
        }
        else
        {
            const newCode = new Code({
                user: req.user.id,
                qid,
                language,
                code,
                solved
            })
            const savedCode = await newCode.save();
            res.json(savedCode);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }
})

module.exports = router;