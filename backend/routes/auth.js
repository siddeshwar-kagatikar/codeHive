const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "gammingsiddu692142" 
const fetchuser = require('../middleware/fetchuser')

router.use('/createuser',[
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
])

// Route 1: create a user using: POST "/api/auth/createuser". No login required
router.post('/createuser', async (req, res) => {
    // If ther are erroers, return bad request and the errors
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success,errors: errors.array() });
    }
    //check wether the user with this email exist
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({success,error: "sorry a user with this email already exists" })
        }

        const salt = await bcrypt.genSaltSync(10);
        const secpass = await bcrypt.hashSync(req.body.password,salt);

        user = await User.create({
            name: req.body.name,
            password: secpass,
            email: req.body.email
        })
        // .then(user => res.json(user)).catch(err => {console.log(err)
        // res.json({error: 'Please enter a unique value for email', errmessage:err.message})})
        const data = {
            user:{
                id: user.id
            }
        }
        success = true;
        const autoken = jwt.sign(data,JWT_SECRET);
        console.log({success,autoken});

        res.json({success,autoken})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }

})

router.use('/login',[
    body('email',"enter correct credentials").isEmail(),
    body('password',"enter correct credentials").exists()
])
// Route 2
router.post('/login', async(req,res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        let user = await User.findOne({ email: req.body.email })
        if(!user){
            return res.status(400).json({error:"enter correct cerdentials!!!"})
        }
        let password = req.body.password;
        const cmppassword = await bcrypt.compare(password,user.password);
        if(!cmppassword){
            return res.status(400).json({success,error:"enter correct cerdentials!!!"})
        }
        const data = {
            user:{
                id: user.id
            }
        }
        success = true
        const autoken = jwt.sign(data,JWT_SECRET);
        res.json({success,autoken});
    }catch(error){
        console.error(error.message);
        res.status(500).send("error at backend");
    }
})

// Route 3: Get loggedin user details using POST "/api/auth/getuser". Login required
router.post('/getuser',fetchuser,async (req,res) => {
    try{
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user)
    }catch(error){
        console.error(error.message);
        res.status(500).send("error at backend");
    }
})

module.exports = router