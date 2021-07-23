const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.postSignup = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const userName = req.body.userName;

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
        lastName: lastName,
        firstName: firstName,
        userName: userName,
        list: { items: [] }
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({ message: 'User created!', userId: result._id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
      };

      loadedUser = user;

      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      };

      const token = jwt.sign({
        email: loadedUser.email,
        userId: loadedUser._id.toString()
      },
        'somesupersecretsecret',
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


// --------- Will be implemented after the basic logic ----------

// const crypto = require('crypto');
// require('dotenv').config();
// const SENGRID_API = process.env.SENGRID_API;
// const WEBSITE_URL = process.env.WEBSITE_URL;
// const nodemailer = require('nodemailer');
// const sendgridTransport = require('nodemailer-sendgrid-transport');
// const transporter = nodemailer.createTransport(sendgridTransport({
//   auth: {
//     api_key: SENGRID_API
//   }
// }));

// exports.postReset = (req, res, next) => {
//   crypto.randomBytes(32, (err, buffer) => {
//     if (err) {
//       console.log(err);
//       return res.redirect('/reset');
//     }
//     //Use buffer to generate a token that crypto generated
//     const token = buffer.toString('hex');
//     User.findOne({ email: req.body.email })
//       .then(user => {
//         if (!user) {
//           req.flash('error', 'There is no account with that email address found');
//           return res.redirect('/reset');
//         }
//         user.resetToken = token;
//         user.resetTokenExpiration = Date.now() + 3600000;
//         return user.save();
//       })
//       .then(result => {
//         res.redirect('/');
//         transporter.sendMail({
//           to: req.body.email,
//           from: 'cro18022@byui.edu',
//           subject: 'Password reset',
//           html: `
//             <p>You have requested a password reset</p>
//             <p>Click this <a href="${WEBSITE_URL}reset/${token}">link</a> to set a new password.</p>
//           `
//         });
//       })
//       .catch(err => {
//         const error = new Error(err);
//         error.httpStatusCode = 500;
//         return next(error);
//       });
//   });
// };


// exports.getNewPassword = (req, res, next) => {
//   const token = req.params.token;

//   User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
//     .then(user => {
//       let message = req.flash('error');
//       if (message.length > 0) {
//         message = message[0];
//       } else {
//         message = null;
//       }
//       res.render('pages/auth/new-password', {
//         path: '/new-password',
//         pageTitle: 'New Password',
//         errorMessage: message,
//         userId: req.user._id.toString(),
//         passwordToken: token
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       const error = new Error(err);
//       error.httpStatusCode = 500;

//       return next(error);


//     });
// };

// exports.postNewPassword = (req, res, next) => {
//   const newPassword = req.body.password;
//   const userId = req.body.userId;
//   const passwordToken = req.body.passwordToken;
//   let resetUser;

//   User.findOne({
//     resetToken: passwordToken,
//     resetTokenExpiration: { $gt: Date.now() },
//     _id: userId
//   })
//     .then(user => {
//       resetUser = user;
//       return bcrypt.hash(newPassword, 12)
//     })
//     .then(hashedPassword => {
//       resetUser.password = hashedPassword;
//       resetUser.resetToken = undefined;
//       resetUser.resetTokenExpiration = undefined;
//       return resetUser.save();
//     })
//     .then(result => {
//       res.redirect('/login');
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };


// ------------- This will be executed on the Frontend ----------------

// exports.getLogin = (req, res, next) => {
//     let message = req.flash('error');
//     if (message.length > 0) {
//         message = message[0];
//     } else {
//         message = null;
//     }

//     res.render('pages/auth/login', {
//         path: '/login',
//         pageTitle: 'Login',
//         errorMessage: message,
//         oldInput: {
//             //Need to add first name and last name
//             email: '',
//             password: ''
//         },
//         validationErrors: []
//     });
// };

// exports.getSignup = (req, res, next) => {
//     let message = req.flash('error');
//     if (message.length > 0) {
//       message = message[0];
//     } else {
//       message = null;
//     }
//     res.render('pages/auth/signup', {
//       path: '/signup',
//       pageTitle: 'Signup',
//       errorMessage: message,
//       oldInput: {
//         email: '',
//         password: '',
//         confirmPassword: ''
//       },
//       validationErrors: []
//     });
// };

// exports.postLogout = (req, res, next) => {   
//     req.session.destroy((err) => {
//       console.log(err);
//       res.redirect('/');
//     });

//  };     

// exports.getReset = (req, res, next) => { 
//     let message = req.flash('error');
//     if (message.length > 0) {
//       message = message[0];
//     } else {
//     message = null;
//   }
//     res.render('pages/auth/reset', {
//       path: '/reset',
//       pageTitle: 'Reset Password',
//       errorMessage: message
//     });
// };