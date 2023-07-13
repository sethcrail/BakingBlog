if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Dependencies -----------------
const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require ("fs");
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const nodemailer = require('nodemailer');
const {Howl, Howler} = require('howler');

//CONNECT EXTERNAL API -----------------

    //MongoDB
const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongooseAddress = 'mongodb+srv://' + mongoUsername + ":" + mongoPassword + '@cluster0.mgwew9b.mongodb.net/bakingBlogDB';

async function main() {
    await mongoose.connect(mongooseAddress);
  }
main().catch(err => console.log(err));

//CONFIGURE APP (EXPRESS/SESSION/PASSPORT) -----------------
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(flash());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/compose');
    }
    next();
}

require('./passport-config');

app.use(passport.initialize());
app.use(passport.session());

    
//recipe SCHEMA and CONSTRUCTOR
const recipeSchema = new mongoose.Schema({
    foodName: String,
    title: String,
    creationDate: Date,
    modifyDate: Date,
    photoTitle: String,
    body: Array,
    quote: String,
    citation: String,
    ingredientsListImperial: Array,
    ingredientsListMetric: Array,
    directionsList: Array
});

const Recipe = mongoose.model('Recipe', recipeSchema);

const scoreSchema = new mongoose.Schema({
    name: String,
    score: Number
});

const Score = mongoose.model('Score', scoreSchema);


//GET REQUESTS -----------------
app.get("/", (req, res)=>{
    (async ()=> {
        try {
            const recipesList = await Recipe.find().sort({creationDate: -1});
            const recentRecipe = recipesList[0];
            const nextRecipe = recipesList[1];
            res.render("index", {
                recipe: recentRecipe,
                nextRecipe: nextRecipe
            });
        } catch (err) {
            console.log(err);
        }
    })();
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login');
});

app.get('/compose', checkAuthenticated, (req, res) => {
    (async ()=> {
        try {
            const recipeList = await Recipe.find();
            const recipeTitleList = [];
            recipeList.forEach(recipe => {
                recipeTitleList.push(recipe.foodName);
            });
            res.render("compose", {
                recipeTitleList: recipeTitleList,
                savedMessage: 0
            });
        } catch (err) {
            console.log(err);
        }
    })();

});

app.get("/recipes", (req, res)=> {
    (async ()=> {
        try {
            const recipeList = await Recipe.find();
            res.render("recipes", {
                recipeList: recipeList
            });
        } catch (err) {
            console.log(err);
        }
    })();
});

app.get("/recipes/:postId", (req, res)=> {
    (async ()=> {
        try {
            let currentRecipe = "";
            let nextRecipeTitle = "";
            const recipesList = await Recipe.find().sort({creationDate: -1});
            recipesList.forEach((recipe, i) => {
                if (recipe.photoTitle === req.params.postId) {
                    currentRecipe = recipe;
                    if (i === recipesList.length - 1) {
                        nextRecipe = recipesList[0];
                    } else {
                        nextRecipe = recipesList[i + 1];
                    }

                } else {
                    return;
                }
            })
            const foundRecipe = await Recipe.findOne({photoTitle: req.params.postId});
            res.render("recipe", {
                recipe: currentRecipe,
                nextRecipe: nextRecipe
            });
        } catch (err) {
            console.log(err);
        }
    })();
});

app.get("/gallery", (req, res) => {
    (async ()=> {
        try {
            fs.readdir("public/assets/recipe-imgs/", (err, photoList) => {
                if (err) {
                    console.log(err);
                } else {
                    let numberOfSections = 1;
                    const numberOfPhotoSets = Math.floor(photoList.length / 4);
                    if (numberOfPhotoSets === 0) {

                    } else {
                        numberOfSections = numberOfPhotoSets;
                    }
                    res.render("gallery", {
                        photos: photoList,
                        numberOfSections: numberOfSections
                    });
                }

            });
        } catch (err) {
            console.log(err);
        }
    })();
    
});

app.get("/play", (req, res) => {

    (async ()=> {
        try {
            const scoresList = await Score.find({}).sort({score: -1});
            res.render("play", {scoresList: scoresList} );
        } catch (err) {
            console.log(err);
        }
    })();
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/contact", (req, res) => {
    res.render("contact", {sentMessage: 0});
});


//FOR COMPOSE PAGE
app.get("/:postId", (req, res)=> {
    (async ()=> {
        try {
            const foundRecipe = await Recipe.find({foodName: req.params.postId});
            res.send(foundRecipe);
        } catch (err) {
            console.log(err);
        }
    })();
});



//POST REQUESTS
app.post('/login', passport.authenticate('local', {
    successRedirect: '/compose',
    failureRedirect: '/login',
    failureFlash: true
}));

app.post("/compose", (req, res)=> {

    const today = new Date();

    if (req.body.editRecipe == "New Recipe") {

        var newRecipe = new Recipe({
            foodName: req.body.foodName,
            title: req.body.title,
            modifyDate: today,
            creationDate: today,
            photoTitle: req.body.foodName.replace(/\s+/g, '').toLowerCase(),
            body: req.body.body.split('\r\n\r\n'),
            quote: req.body.quote,
            citation: req.body.quoteAuthor,
            ingredientsListImperial: req.body.ingredientsImperial.split('\r\n\r\n'),
            ingredientsListMetric: req.body.ingredientsMetric.split('\r\n\r\n'),
            directionsList: req.body.directions.split('\r\n\r\n')
        });

        (async ()=> {
            try {
                await newRecipe.save();
                res.render("compose", {savedMessage: 1});
            } catch (err) {
                res.render("compose", {savedMessage: 2});
                console.log(err);
            }
        })();

    } else {
        (async ()=> {
            try {
                await Recipe.findOneAndUpdate({foodName: req.body.editRecipe}, {
                    foodName: req.body.foodName,
                    title: req.body.title,
                    modifyDate: today,
                    photoTitle: req.body.foodName.replace(/\s+/g, '').toLowerCase(),
                    body: req.body.body.split('\r\n\r\n'),
                    quote: req.body.quote,
                    citation: req.body.quoteAuthor,
                    ingredientsListImperial: req.body.ingredientsImperial.split('\r\n\r\n'),
                    ingredientsListMetric: req.body.ingredientsMetric.split('\r\n\r\n'),
                    directionsList: req.body.directions.split('\r\n\r\n')
                });
                res.render("compose", {savedMessage: 1});
            } catch (err) {
                res.render("compose", {savedMessage: 2});
                console.log(err);
            }
        })();
    };
});

app.post('/play', (req, res)=> {
    (async ()=> {
        try {
            const score = new Score ({
                name: req.body.hsName,
                score: req.body.hsScore
            });
            await score.save();
            await Score.find({})
                .then((scores) => {
                    if (scores.length >= 6) {
                        Score.findOneAndDelete({})
                            .sort({score: 1})
                            .then(() => {
                                res.redirect("/play");
                            }).catch((err) => {
                                console.log(err);
                            });
                    } else {
                        res.redirect("/play");
                    }
                }).catch((err) => {
                    console.log(err);
                });
            } catch (err) {
                console.log(err);
            }
    })();
});

app.post('/contact', (req, res) => {

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const message = req.body.message;

    const mailDetails = {
        from: process.env.EMAIL_ADDRESS_SENDER,
        to: process.env.EMAIL_ADDRESS_RECIPIENT,
        subject: 'New message from ' + firstName + ' ' + lastName + ' on Bake Me',
        text: '"' + message + '" Reply at: ' + email
    }

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_ADDRESS_SENDER,
            pass: process.env.APP_PASSWORD
        }
    });

    send();

    async function send() {
        try {
            const result = await transporter.sendMail(mailDetails);
            res.render('contact', {sentMessage: 1})
        } catch (err) {
            res.render('contact', {sentMessage: 2})
            console.log(err);
        } 
    }
});

//Server Start
app.listen(3000);

