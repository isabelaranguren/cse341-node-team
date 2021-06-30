const crypto = require('crypto');

const User = require('../models/user');

const bcrypt = require('bcryptjs');
require('dotenv').config();

//THIS IS USING DOTENV
// const WEBSITE_URL = process.env.WEBSITE_URL;

//ARE WE GOING TO USE SENDGRID TO HAVE USERS SIGN UP?
// const nodemailer = require('nodemailer');
// const sendgridTransport = require('nodemailer-sendgrid-transport');
// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth: {    
//       api_key: process.env.SENGRID_API
//     }
//   }));

const { validationResult } = require('express-validator');

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        oldInput: {
            //Need to add first name and last name
            email: '',
            password: ''
        },
        validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
    //need to add first name and last name
    const email =  req.body.email;
  const password = req.body.password;  
  const errors = validationResult(req); 
  if(!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }
User.findOne({email: email})
  .then(user => {
    if(!user) {
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage:'Invalid email or password.',
        oldInput: {
          email: email,
          password: password
        },
        validationErrors: []
      });
    }
    bcrypt
    .compare(password, user.password)
    .then(doMatch => {
      if (doMatch){
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save((err) => {
          console.log(err);
          res.redirect('/');
        });
      }
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage:'Invalid email or password.',
        oldInput: {
          email: email,
          password: password
        },
        validationErrors: []
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/login');
    });
  
   })
   .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });

      
};



exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: message,
      oldInput: {
        email: '',
        password: '',
        confirmPassword: ''
      },
      validationErrors: []
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    //Add first and last name.
      
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
         path: '/signup',
         pageTitle: 'Signup',
         errorMessage: errors.array()[0].msg,
         oldInput: {
            email: email,
            password: password,
            confirmPassword: req.body.confirmPassword
            },
            validationErrors: errors.array()
       });
      }
     
         bcrypt
           .hash(password, 12)
            .then(hashedPassword => {
              const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
              });
              return user.save();
            })
            .then(result => {
             res.redirect('/login');
             return transporter.sendMail({
                to: email,
                from: 'cro18022@byui.edu',
                subject: 'Sign-up suceeded',
                html: '<h1>Thank you for signing up </h1>'
              });
              
            })
            .catch(err => {
             const error = new Error(err);
             error.httpStatusCode = 500;
             return next(error);
           });
            
};

exports.postLogout = (req, res, next) => {   
    req.session.destroy((err) => {
      console.log(err);
      res.redirect('/');
    });
            
 };     

exports.getReset = (req, res, next) => { 
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
    message = null;
  }
    res.render('auth/reset', {
      path: '/reset',
      pageTitle: 'Reset Password',
      errorMessage: message
    });
}; 

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) =>{
      if (err) {
        console.log(err);
        return res.redirect('/reset');
      }
      //Use buffer to generate a token that crypto generated
      const token = buffer.toString('hex');
      User.findOne({email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'There is no account with that email address found');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'cro18022@byui.edu',
          subject: 'Password reset',
          html: `
            <p>You have requested a password reset</p>
            <p>Click this <a href="${WEBSITE_URL}reset/${token}">link</a> to set a new password.</p>
          `
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
    });
  };


exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user => {
      let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token
    });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}; 

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
  
    User.findOne({resetToken: passwordToken, 
      resetTokenExpiration: {$gt: Date.now() },
      _id: userId
    })
      .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12)
    })
      .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
      })
      .then(result => {
        res.redirect('/login');
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

// exports.postDeleteAccount = (req,res,next) => {

// };