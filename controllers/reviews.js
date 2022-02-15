const Review = require('../models/review')
const Campground = require('../models/campground')


module.exports.createReview = async (req, res) => {
    // res.send("Good")
    const campground = await Campground.findById(req.params.id)
    const review = await new Review(req.body.review)
    campground.reviews.push(review)
    review.author = req.user._id
    await review.save()
    await campground.save()
    req.flash('success', 'Created a new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Review.findByIdAndDelete(reviewId)
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    req.flash('success', 'Deleted a review!')
    res.redirect(`/campgrounds/${id}`)
}