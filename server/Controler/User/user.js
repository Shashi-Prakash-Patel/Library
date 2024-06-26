const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Profile = require("../../models/student");
const loginSchema = require("../../models/login");

/*
User login
*/

const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    const data = await Profile.findOne({ adhar: email, mobile: password });

    if (data) {
      const token = jwt.sign(
        { email: data.name, _id: data._id },
        process.env.SECRET
      );

      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader("Access-Control-Allow-Origin", "https://react-phi-coral.vercel.app");
      // res.cookie("token", token, {maxAge: 30 * 24 * 60 * 60 * 1000, secure: true, httpOnly: true, path: '/'});
      res.status(200).json({ message: "success", data: data, token: token });
    } else {
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader("Access-Control-Allow-Origin", "https://react-phi-coral.vercel.app");
      res.status(202).json({ message: "Please register" });
    }
  } else {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "https://react-phi-coral.vercel.app");
    res.status(203).json({ message: "All field are required" });
  }
};

/*
Send the data for auth
*/

const UsetLoginDataForAuth = async (req, res) => {
  const { id, email } = req.params;
  const data = await loginSchema.find({ _id: id, email: email });
  
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "https://react-phi-coral.vercel.app");
  res.json({ user: data });
};

/*
 User Register Data
*/
const RegisterData = async (req, res) => {
  const { name, adhar, mobile, study, dob, gender } = req.body;
  const image = req.file.filename;

  if (name && adhar && mobile && study && dob && gender) {
    const UserData = await Profile.findOne({ adhar: adhar, mobile: mobile });

    if (UserData) {
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Origin", "https://react-phi-coral.vercel.app");
      res.json({ status: "failed", message: "You are already register" });
    } else {
      const User = new Profile({
        name: name,
        adhar: adhar,
        mobile: mobile,
        study: study,
        dob: dob,
        gender: gender,
        image: image,
      });

      const result = await User.save();

      const token = jwt.sign(
        { email: User.name, _id: User._id },
        process.env.SECRET
      );

      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Origin", "https://react-phi-coral.vercel.app");
      res.cookie("token", token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
      res.json({ message: "Successful", data: result });
    }
  } else {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "https://react-phi-coral.vercel.app");
    res.json({ status: "failed", message: "All the field are required" });
  }
};

/*
Send the data of all the user
*/
const GetAllUserData = async (req, res) => {
  const data = await Profile.find({});

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "https://react-phi-coral.vercel.app");
  return res.json({ user: data });
};

/*
Send the One  user data
*/

const GetUserProfile = async (req, res) => {
  const AuthCookies = req.cookies.token;

  if (AuthCookies) {
    const { email, _id } = jwt.verify(AuthCookies, process.env.SECRET);
    const data = await Profile.findById({ _id: _id, email });
    if (data) {
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Origin", "https://react-phi-coral.vercel.app");
      res.status(200).json({ user: data });
    } else {
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Origin", "https://react-phi-coral.vercel.app");
      res.status(201).json({ user: "You are not register" });
    }
  } else {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "https://react-phi-coral.vercel.app");
    res.status(202).json({ user: "Please login" });
  }
};

const GetRegisterUserData = async (req, res) => {
  const cookieData = req.headers.authorization;

  if (cookieData) {
    const { email, _id } = jwt.verify(cookieData, process.env.SECRET);
    const result = await Profile.find({ _id: _id, name: email });

    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "https://react-phi-coral.vercel.app");
    res.status(200).json({ message: "Successful", data: result });
  } else {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "https://react-phi-coral.vercel.app");
    res.status(202).json({ message: "Faild", data: "Please login"});
  }
};

const UserLogOut = (req, res) => {
  res.clearCookie("token");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "https://react-phi-coral.vercel.app");
  res.json({ message: "success" });
};

module.exports = {
  RegisterData,
  GetAllUserData,
  GetUserProfile,
  LoginUser,
  UsetLoginDataForAuth,
  GetRegisterUserData,
  UserLogOut,
};
