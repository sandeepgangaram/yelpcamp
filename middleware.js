const Campground = require('./models/campground')
const Review = require('./models/review')
const { validateSchema } = require('./schemas')
const ExpressError = require('./utils/ExpressError')
const { reviewSchema, campgroundSchema } = require('./schemas')


module.exports.isLoggedIn = (req, res, next) => {
    // req.session.ReturnTo = req.originalUrl
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must login to continue')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateSchema = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body)

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw next(new ExpressError(msg, 400))
    } else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw next(new ExpressError(msg, 400))
    } else {
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'No you dont have permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'No you dont have permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}