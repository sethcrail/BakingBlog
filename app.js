const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require ("fs");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false}));

//Connect to MongoDB
const username = fs.readFileSync('private/admin.txt', 'utf8');
const password = fs.readFileSync('private/password.txt', 'utf8');
const mongooseAddress = 'mongodb+srv://' + username + ":" + password + '@cluster0.mgwew9b.mongodb.net/bakingBlogDB';

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongooseAddress);
}

//recipe SCHEMA and CONSTRUCTOR
const recipeSchema = new mongoose.Schema({
    foodName: String,
    title: String,
    creationDate: String,
    mostRecent: Boolean,
    photoTitle: String,
    body: Array,
    quote: String,
    citation: String,
    ingredientsListImperial: Array,
    ingredientsListMetric: Array,
    directionsList: Array
});

const Recipe = mongoose.model('Recipe', recipeSchema);



//GET REQUESTS
app.get("/", (req, res)=>{
    (async ()=> {
        try {
            const foundRecipe = await Recipe.findOne({mostRecent: true});
            res.render("index", {
                recipe: foundRecipe
            });
        } catch (err) {
            console.log(err);
        }
    })();
});

app.get("/compose", (req, res)=>{
    (async ()=> {
        try {
            const recipeList = await Recipe.find();
            const recipeTitleList = [];
            recipeList.forEach(recipe => {
                recipeTitleList.push(recipe.foodName);
            });
            res.render("compose", {
                recipeTitleList: recipeTitleList
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
            const foundRecipe = await Recipe.findOne({photoTitle: req.params.postId});
            res.render("recipe", {
                recipe: foundRecipe
            });
        } catch (err) {
            console.log(err);
        }
    })();
});


app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/gallery", (req, res) => {
    fs.readdir("public/assets/recipe-imgs/", (err, photoList) => {
        if (err) {
            console.log(err);
        } else {
            console.log(photoList);
        }
    });
    const numberOfSections = 1;
    
    res.render("gallery");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

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
app.post("/compose", (req, res)=> {

    if (req.body.editRecipe == "New Recipe") {

        const today = new Date();
        const options = {year: 'numeric', month: 'long', day: 'numeric'};

        var newRecipe = new Recipe({
            foodName: req.body.foodName,
            title: req.body.title,
            mostRecent: true,
            creationDate: today.toLocaleDateString('en-US', options),
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
                const allRecipes = await Recipe.find();
                await allRecipes.forEach(recipe => {
                    recipe.mostRecent = false;
                    recipe.save();
                });
                await newRecipe.save();
                console.log("Recipe Saved.");
                res.redirect("/compose");
            } catch (err) {
                console.log(err);
            }
        })();

    } else {
        (async ()=> {
            try {
                await Recipe.findOneAndUpdate({foodName: req.body.editRecipe}, {
                    foodName: req.body.foodName,
                    title: req.body.title,
                    photoTitle: req.body.foodName.replace(/\s+/g, '').toLowerCase(),
                    body: req.body.body.split('\r\n\r\n'),
                    quote: req.body.quote,
                    citation: req.body.quoteAuthor,
                    ingredientsListImperial: req.body.ingredientsImperial.split('\r\n\r\n'),
                    ingredientsListMetric: req.body.ingredientsMetric.split('\r\n\r\n'),
                    directionsList: req.body.directions.split('\r\n\r\n')
                });
                res.redirect("/compose");
            } catch (err) {
                console.log(err);
            }
        })();
    };
});



//Server Start
app.listen(3000, ()=> {
    console.log("Server started on port 3000.")
});

