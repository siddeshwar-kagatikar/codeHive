const express = require('express');
const router = express.Router();
const Question = require('../models/Questions');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser')

// Route 1: Get all the questions
router.post('/getquestions', fetchuser, async (req, res) => {
    try {
        const questions = await Question.find({roomId: req.body.roomId});
        console.log(`from room yay: ${req.body.roomId}`);
        res.json(questions);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
}) 

// Route 2: Add a new question
router.use('/addquestion', [
    body('roomId', 'Enter a valid room id').exists(),
    body('heading', 'Enter a valid heading').isLength({ min: 3 }),
    body('question', 'Enter a valid question').isLength({ min: 3 }),
    body('example', 'Enter a valid example').isLength({ min: 3 }),
    body('difficulty', 'Enter a valid difficulty').exists(),
]);

router.post('/addquestion',fetchuser, async (req, res) => {
    try {
        const { roomId, heading, question, example, difficulty } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('issue in middleware');
            return res.status(400).json({ errors: errors.array() });
        } 
        const newqestion = new Question({
            roomId, heading, question, example, difficulty
        })
        const savedQuestion = await newqestion.save();
        res.json(savedQuestion);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

// Route 3: Edit a question
router.put('/editquestion/:id', fetchuser, async (req, res) => {
    try {
        const { id } = req.params;
        const { roomId, heading, question, example, difficulty } = req.body;
        const newQuestion = { roomId, heading, question, example, difficulty };
        console.log(newQuestion);
        const ques = await Question.findById(id);
        if (!ques) {
            return res.status(404).send("Not Found");
        }
        if (ques.roomId !== req.body.roomId) {
            return res.status(401).send("Not Allowed");
        }
        const updatedQuestion = await Question.findByIdAndUpdate(id, { $set: newQuestion }, { new: true });
        res.json({ "Success": "Question has been updated", updatedQuestion });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

// Route 4: Delete a question
router.delete('/deletequestion/:id', fetchuser, async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).send("Not Found");
        }
        if (question.roomId !== req.body.roomId) {
            return res.status(401).send("Not Allowed");
        }
        const delques = await Question.findByIdAndDelete(id);
        res.json({ "Success": "Question has been deleted", delques });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

//Route 5: Save testcases
router.put('/savetestcases/:id', fetchuser, async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).send("Not Found");
        }
        // if (question.roomId !== req.body.roomId) {
        //     return res.status(401).send("Not Allowed");
        // }
        // question.testcases = req.body.testcases;
        // const savedQuestion = await question.save();
        const updatedQuestion = await Question.findByIdAndUpdate(id, { $set: { testcases: req.body.testcases } }, { new: true });
        res.json({ "Success": "Testcases have been saved", updatedQuestion });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

//Route 6: Get testcases
router.get('/gettestcases/:id', fetchuser, async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id).select('testcases');
        if (!question) {
            return res.status(404).send("Not Found");
        }
        res.json(question);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

module.exports = router; 