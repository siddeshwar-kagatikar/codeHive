const express = require('express');
const router = express.Router();
const Code = require('../models/Codes');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const { checkPlagiarism } = require('../plag');

router.post('/plagcheck',fetchuser, async(req, res) => {
    try {
        const allcode = await Code.find({qid: req.body.qid});
        const submissions = allcode.map(entry => {
            return {
              studentId: entry.user,  // Map 'user' to 'studentId'
              code: entry.code         // Map 'code' directly
            };
          });
        
        const plagiarismResults = checkPlagiarism(submissions);
        //   console.log(plagiarismResults);
          res.json(plagiarismResults);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }
})

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

router.post('/savecode', fetchuser, async (req, res) => {
    try {
        const { qid, code, language } = req.body;
        const findcode = await Code.find({ user: req.user.id, qid: req.body.qid, language: req.body.language });

        if(findcode.length !== 0){
            const code = await Code.findOneAndUpdate({ user: req.user.id, qid: req.body.qid, language: req.body.language }, { code: req.body.code });
            return res.json(code);
        }
        else
        {
            const newCode = new Code({
                user: req.user.id,
                qid,
                language,
                code
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