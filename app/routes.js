module.exports = function (app, passport, db, Deaths) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs')
  })

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('deathSentences').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user: req.user,
        messages: result.map(pplMSG => {
          return {
            ...pplMSG,
            reactions: pplMSG.thumbUp + pplMSG.thumbDown
          }
        })
      })
    })
  });


  app.get('/waysToDie', (req, res) => {
      const newDeaths = new Deaths();
      newDeaths.death =  ['Impaled through the neck with a steak knife',
      'Accidentally electrocuted until head explodes',
      'Fell from the Seattle Great Wheel',
      'Pushed in front of a train',
      'Blown up by a grenade',
      'Died of a heart attack',
      'Jumped off a 20-floor building',
      'Partially decapitated by a ladder',
      'Ran over by an unknown SWAT truck',
      'Died of smoke inhalation'
      ]
      newDeaths.save(function(err) {
        if (err)
            throw err;
        res.send({success:newDeaths});
    });
  })

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout(() => {
      console.log('User has logged out!')
    });
    res.redirect('/');
  });

  // message board routes ===============================================================

  app.post('/messages', (req, res) => {
    Deaths.findOne({}, (error, docs) => {
      if(error){
        console.log(error)
      }else {
        const num = Math.round(Math.random() * docs.death.length)
        console.log(docs.death[num], num)
        db.collection('deathSentences').save({ name: req.body.name, msg: docs.death[num]}, (err, result) => {
          if (err) return console.log(err)
          console.log('saved to database')
          res.redirect('/profile')
        })
      }
    })
  })

  app.put('/messages', (req, res) => {
    db.collection('deathSentences')
      .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
        $inc: {
          thumbUp: 1
        }
      }, {
        sort: { _id: -1 },
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.put('/messages/thumbDown', (req, res) => {
    db.collection('deathSentences')
      .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
        $inc: {
          thumbDown: - 1
        }
      }, {
        sort: { _id: -1 },
        upsert: true  //might be a bug later on that leon leaves and you need to fix
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.delete('/messages', (req, res) => {
    db.collection('deathSentences').findOneAndDelete({ name: req.body.name, msg: req.body.msg }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
