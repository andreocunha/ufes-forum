const User = require('../models/User');
const { createToken } = require('../utils/token');
const jwtDecode = require('jwt-decode');

module.exports = {

  // function to create a new user if it doesn't exist
  async signup(req, res) {
    const { email, name, image } = req.body;

    const userByEmail = await User.findOne({ email });
    // const userByName = await User.findOne({ name });

    if (userByEmail) {
      // create a token and get the expiration date and return it
      const token = createToken(userByEmail);
      const { exp } = jwtDecode(token);

      return res.status(200).json({
        token,
        exp,
      });
    }

    const newUser = await User.create({
      name,
      email,
      image,
    });

    // create a token and get the expiration date and return it
    const token = createToken(newUser);
    const { exp } = jwtDecode(token);

    return res.json({
      newUser,
      token,
      exp,
    });
  },

  // function to list all users
  async list(req, res) {
    try {
      //get all users removing the email, id and role
      // verify if the user has anonimous mode true
      // if it true, so remove the name, linkedin, instagram, github and image of the user
      const users = await User.find({}, '-email -__v -role');
      const usersWithAnonimousMode = users.map((user) => {
        if (user.anonymousMode) {
          return {
            ...user._doc,
            name: user.nickname,
            linkedin: '',
            instagram: '',
            github: '',          
            image: `https://secure.gravatar.com/avatar/${user.id}?s=90&d=identicon`,
            id: user._id,
          };
        }
        return user;
      });
      // res.json(users);
      res.json(usersWithAnonimousMode);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // function to list a specific user by name
  async listOne(req, res) {
    try {
      const user = await User.findOne({ name: req.params.name }, '-__v -role');
      if(user.anonymousMode) {
        let newUser = {
          ...user._doc,
          name: user.nickname,
          linkedin: '',
          instagram: '',
          github: '',
          image: `https://secure.gravatar.com/avatar/${user.id}?s=90&d=identicon`,
          id: user._id,
        };
        return res.json(newUser);
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getUserByID(id){
    try {
      const user = await User.findById(id);
      if(user.anonymousMode) {
        let newUser = {
          ...user._doc,
          name: user.nickname,
          linkedin: '',
          instagram: '',
          github: '',
          image: `https://secure.gravatar.com/avatar/${user.id}?s=90&d=identicon`,
          id: user._id,
        };
        return newUser;
      }
      return user;
    } catch (err) {
      cosole.log(err);
      return null;
    }
  },

  // function to update only the name or image by a specific user
  async update(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true },
      );
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // function to update information of a specific user
  async updateInfo(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true },
      );
       // verify if the user has anonimous mode true
      // if it true, so remove the name, linkedin, instagram, github and image of the user
      if(user.anonymousMode){
        const userWithAnonimousMode = {
          ...user._doc,
          name: user.nickname,
          linkedin: '',
          instagram: '',
          github: '',
          image: `https://secure.gravatar.com/avatar/${user.id}?s=90&d=identicon`,
          id: user._id,
        };
        res.json(userWithAnonimousMode);
      }
      else{
        res.json(user);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  

  // function to delete a specific user
  async delete(req, res) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};