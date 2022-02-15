const User = require('../models/user')


module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        const user = new User({ username, email })
        const registerUser = await User.register(user, password)
        req.login(registerUser, err => {
            if (err) return next(err);
            req.flash('success', 'Registration Success! Welcome to YelpCamp!')
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/campgrounds')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back! Successfully logged in!')
    const redirectUrl = req.session.ReturnTo || '/campgrounds'
    console.log(req.session.ReturnTo)
    delete req.session.ReturnTo
    // if(req.session.ReturnTo){
    //      return res.redirect(req.session.ReturnTo)
    // }
    // console.log(req.session)
    // console.log(redirectUrl)
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged you out! See ya!')
    res.redirect('/campgrounds')
}