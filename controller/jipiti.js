
const OpenAI = require ('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
  });
const User = require('../models/user');
require('dotenv').config()


exports.chatWithGPT = async (req, res, next) => {
    if (req.session.user) {
        const user = await User.findById(req.session.user._id);
        res
        .render('gpt', {
            path: '/konsultasi',
            pageTitle: 'Tanya Firda',
            user: user,
            currentUser: user.username,
            isAuth: req.session.isLoggedIn,
            assistant : []
        });
    }
    if(!req.session.user) {
        res.redirect('/')
    }
};  

exports.postGpt = async(req,res) => {
    try {
    const ask = req.body.ask
    const user = await User.findById(req.session.user._id);
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{"role": "user",
         "content": ask}],
      })
      let assistant = JSON.stringify(chatCompletion.choices[0].message.content)
      console.log(assistant.replace('\n', '<br>'))
      res.status(201)
      .render('gpt', {
        path: '/konsultasi',
        pageTitle: 'Tanya Firda',
        user: user,
        currentUser: user.username,
        isAuth: req.session.isLoggedIn,
        assistant : assistant.replace('\n', '<br>')
    });
    }
    catch(err) {
        console.log(err)
    }
}
