const userModel = require("../Models/userModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({_id}, jwtkey, {expiresIn: "3d"});
}

//Function Register 
const userRegister = async (req, res) => { console.log("start")
    try{ 
        const {name, email, password} = req.body;
    if(!name || !email || !password) return res.status(400).json("All fields are required!!!");

    let user = await userModel.findOne({email});

    if(user) return res.status(400).json("Email is Already exist!!!");

    if(!validator.isEmail(email)) return res.status(400).json("Email must be a valid email!!!");
    
    if(!validator.isStrongPassword(password)) return res.status(400).json("Password must be a strong password!!!");
    const codereferral = Date.now().toString(36) + Math.floor(Math.random()*101);
    const salt = await bcrypt.genSalt(10)
    let hashpassword = await bcrypt.hash(password, salt);
        console.log(hashpassword);
        const rndInt = Math.floor(Math.random() * 4) + 1;
        const avatar = `assets/images/ava${rndInt}.png`; console.log(avatar)
    user = new userModel({name, email, password: hashpassword, codereferral, avatar});
    await user.save();

    const token = createToken(user._id);
    res.status(200).json({_id: user._id, name, token, codereferral, avatar});
    
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

//Function Login
const userLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
// const token = createToken("start");
        if(!email || !password) return res.status(400).json("All fields are required!!!"); //check email and password from body

        let user = await userModel.findOne({email}); //get data from database using email

        if(!user) return res.status(400).json("Email doesn't exist!!!"); //check if user doesnt exist

        const isValidPassword = await bcrypt.compare(password, user.password); //check password is correct
        if(!isValidPassword) return res.status(400).json("Password is not valid"); //if password doesnt correct
        // console.log(user);
        const token = createToken(user._id);
        res.status(200).json({_id: user._id, name: user.name, token, codereferral: user.codereferral, avatar: user.avatar});

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

//Function Find a User
const userSearch = async (req, res) => {
    try {
        const userId = req.params.userId;
        let user = await userModel.findById(userId);
        if(!user) return res.status(400).json("User Not Found");

        const { password, ...others } = user._doc;
        // console.log(others);
        res.status(200).json(others)


    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

const updateProfile = async (req, res) => {
    try {
        const {name, avatar, userId} = req.body;
        console.log(name)
        let updateData = await userModel.findByIdAndUpdate(userId, {name: name, avatar: avatar}, {new:true});
        const { password, email, ...others } = updateData._doc;
        res.status(200).json(others);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}



module.exports = {
    userRegister,
    userLogin,
    userSearch,
    updateProfile
}