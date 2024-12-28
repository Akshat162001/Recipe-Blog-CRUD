require('../models/database');
const Recipe=require('../models/Recipe')
const Category = require('../models/Category');
exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
    const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
    const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);

    const food = { latest, thai, american, chinese };

    res.render('index', { title: 'Cooking Blog - Home', categories, food });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};


exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Cooking Blog - Categories', categoryById });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" }); // Corrected 'satus' and 'see'
  }
};



  exports.exploreCategories = async (req, res) => {
    try {
      const limitNumber = 20;
      const categories = await Category.find({}).limit(limitNumber); // Fixed the syntax here
      res.render('categories', { title: 'Cooking Blog - Categories', categories });
    } catch (error) {
      res.status(500).send({ message: error.message || "Error Occurred" }); // Fixed typo in 'status'
    }
  };
  
// get thing of recipe

exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id; // Corrected 'ic' to 'id'
    const recipe = await Recipe.findById(recipeId); // Corrected 'findByIc' to 'findById'
    res.render('recipe', { title: "Cooking Blog - Recipe", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" }); // Fixed 'satus' and the logical OR operator
  }
};

// serach thing starts here By POST

exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search',{title:'Cooking Blog -Search',recipe})
    
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" }); // Fixed 'satus' and logical OR operator
  }
  
};

// EXPLORE-LATEST CONTENT
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber); // Fixed syntax issues and corrected sort key

    res.render('explore-latest', { title: 'Cooking Blog - ExploreLatest ', recipe }); // Corrected 'racipe' to 'recipes'
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" }); // Fixed 'satus' and logical OR operator
  }
};

// EXPLORE RANDOM VALUES
exports.exploreRandom = async(req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render('explore-random', { title: 'Cooking Blog - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 

/////SUBMIT RECIPE/////---->
/**
 * GET /submit-recipe
 * Submit Recipe
 */
exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
}


exports.submitRecipeOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}




// async function insertDummyCategoryData() {
//   try {
//     await Category.insertMany([
//       {
//         name: "Thai",
//         image: "thai-food.jpg"
//       },
//       {
//         name: "American",
//         image: "american-food.jpg"
//       },
//       {
//         name: "Chinese",
//         image: "chinese-food.jpg"
//       },
//       {
//         name: "Mexican",
//         image: "mexican-food.jpg"
//       },
//       {
//         name: "Indian",
//         image: "indian-food.jpg"
//       },
//       {
//         name: "Spanish",
//         image: "spanish-food.jpg"
//       }
//     ]);
//     console.log('Dummy category data inserted');
//   } catch (error) {
//     console.error('Error inserting dummy category data:', error);
//   }
// }
// insertDummyCategoryData()

// async function insertDummyRecipeData() {
//   try {
//     await Recipe.insertMany([
//       {
//         "name": "Stir-fried vegetables",
//         "description": "Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion. Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl. Heat your wok until it's really hot. Add a splash of oil - it should start to smoke - then the chilli and onion mix.",
//         "source": "https://www.jamieoliver.com/recipes/vegetables-recipes/stir-fried-vegetables/",
//         "email": "hello@raddy.co.uk",
//         "ingredients": [
//           "1 clove of garlic",
//           "1 fresh red chilli",
//           "3 spring onions",
//           "1 small red onion",
//           "1 handful of mangetout",
//           "a few shiitake mushrooms"
//         ],
//         "category": "Chinese",
//         "image": "stir-fried-vegetables.jpg"
//       },
//       {
//         "name": "Tom Daley's sweet & sour chicken",
//         "description": "Drain the juices from the tinned fruit into a bowl, add the soy and fish sauces, then whisk in 1 teaspoon of cornflour. Pull off the chicken skin, lay it flat in a large, cold frying pan, place on a low heat and leave for a few minutes. Meanwhile, slice the chicken into 3cm chunks and place in a bowl with 1 heaped teaspoon of five-spice and a pinch of salt.",
//         "source": "https://www.jamieoliver.com/recipes/chicken-recipes/tom-daley-s-sweet-sour-chicken/",
//         "email": "hello@raddy.co.uk",
//         "ingredients": [
//           "1 can of tinned fruit",
//           "1 tablespoon soy sauce",
//           "1 teaspoon fish sauce",
//           "500g chicken thighs",
//           "1 heaped teaspoon five-spice",
//           "a pinch of salt"
//         ],
//         "category": "Mexican",
//         "image": "tom-daley-sweet-sour-chicken.jpg"
//       },
//       {
//         "name": "Classic Spaghetti Bolognese",
//         "description": "Cook the spaghetti according to the packet instructions. Heat olive oil in a pan, add onions and garlic, then stir in the minced beef and cook until browned. Add tomatoes, tomato paste, and seasoning, then simmer for 20 minutes.",
//         "source": "https://www.jamieoliver.com/recipes/beef-recipes/classic-spaghetti-bolognese/",
//         "email": "hello@raddy.co.uk",
//         "ingredients": [
//           "400g spaghetti",
//           "2 tablespoons olive oil",
//           "1 onion, chopped",
//           "2 garlic cloves, minced",
//           "500g minced beef",
//           "400g canned tomatoes",
//           "2 tablespoons tomato paste"
//         ],
//         "category": "Italian",
//         "image": "spaghetti-bolognese.jpg"
//       },
//       {
//         "name": "Vegan Buddha Bowl",
//         "description": "Cook quinoa as per instructions. Arrange cooked quinoa in a bowl, top with roasted sweet potatoes, avocado slices, steamed broccoli, and chickpeas. Drizzle with tahini dressing.",
//         "source": "https://www.jamieoliver.com/recipes/vegetables-recipes/vegan-buddha-bowl/",
//         "email": "hello@raddy.co.uk",
//         "ingredients": [
//           "1 cup quinoa",
//           "1 avocado",
//           "1 cup steamed broccoli",
//           "1 cup roasted sweet potatoes",
//           "1 cup chickpeas",
//           "2 tablespoons tahini"
//         ],
//         "category": "Thai",
//         "image": "vegan-buddha-bowl.jpg"
//       },
//       {
//         "name": "American Pancakes",
//         "description": "Whisk together flour, sugar, baking powder, and salt. Add milk, eggs, and melted butter, and mix until smooth. Heat a pan and cook pancakes until golden brown on both sides.",
//         "source": "https://www.jamieoliver.com/recipes/american-recipes/classic-pancakes/",
//         "email": "hello@raddy.co.uk",
//         "ingredients": [
//           "1 cup all-purpose flour",
//           "2 tablespoons sugar",
//           "1 teaspoon baking powder",
//           "1/4 teaspoon salt",
//           "1 cup milk",
//           "2 eggs",
//           "2 tablespoons melted butter"
//         ],
//         "category": "American",
//         "image": "american-pancakes.jpg"
//       },
//       {
//         "name": "Indian Butter Chicken",
//         "description": "Marinate chicken in yogurt and spices. Cook onions, garlic, and ginger in a pan, then add the marinated chicken and cook thoroughly. Stir in cream and simmer for a few minutes before serving.",
//         "source": "https://www.jamieoliver.com/recipes/chicken-recipes/indian-butter-chicken/",
//         "email": "hello@raddy.co.uk",
//         "ingredients": [
//           "500g chicken",
//           "1 cup yogurt",
//           "1 teaspoon garam masala",
//           "1 teaspoon turmeric",
//           "1 onion, chopped",
//           "2 garlic cloves, minced",
//           "1 tablespoon ginger paste",
//           "1/2 cup cream"
//         ],
//         "category": "Indian",
//         "image": "indian-butter-chicken.jpg"
//       }



//     ]); // Corrected: Used `[]` instead of `[)` for an array
//   } catch (error) {
//     console.log('Error:', error); // Corrected: Removed `+` before `error`
//   }
// }

// // Call the function
// insertDummyRecipeData();
