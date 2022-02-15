if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require('express')
const app = express();

const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')

const session = require('express-session')
const flash = require('connect-flash')

const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const mongoSanitize = require('express-mongo-sanitize');

const helmet = require('helmet')


const MongoStore = require('connect-mongo');


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/YelpCamp';


main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(dbUrl
    );
    console.log("Database Connected")
}



const secret = process.env.SECRET || 'thisissomesecret!';

const sessionConfig = {
    store: MongoStore.create({ mongoUrl: dbUrl}),
    touchAfter: 24 * 3600,
    name:'campgroundssssssssssssss',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/justimgcloudsand/",
    "https://code.jquery.com/",
    "https://maxcdn.bootstrapcdn.com"

];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/justimgcloudsand/",
    "https://maxcdn.bootstrapcdn.com"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/justimgcloudsand/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/justimgcloudsand/" ];
 
app.use(
    helmet({
        contentSecurityPolicy: {
            directives : {
                defaultSrc : [],
                connectSrc : [ "'self'", ...connectSrcUrls ],
                scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
                styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
                workerSrc  : [ "'self'", "blob:" ],
                objectSrc  : [],
                imgSrc     : [
                    "'self'",
                    "blob:",
                    "data:",
                    "https://res.cloudinary.com/justimgcloudsand/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                    "https://images.unsplash.com/"
                ],
                fontSrc    : [ "'self'", ...fontSrcUrls ],
                mediaSrc   : [ "https://res.cloudinary.com/dlzez5yga/" ],
                childSrc   : [ "blob:" ]
            }
        },
        crossOriginEmbedderPolicy: false
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.engine('ejs', ejsMate)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
    // app.use(mongoSanitize())
app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);

app.use((req, res, next) => {
    // console.log(req.session)
    // console.log(req.originalUrl)
    console.log(req.query)
    if (!['/login', '/'].includes(req.originalUrl)) {
        req.session.ReturnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.get('/fakeUser', async(req, res) => {
    const user = new User({ email: 'blah@blah.com', username: 'blahblah' })
    const newUser = await User.register(user, '123456')
    res.send(newUser)
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
    res.render('home')
})


app.all('*', (req, res, next) => {
    throw next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no! Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Serving on ${port}`)
})