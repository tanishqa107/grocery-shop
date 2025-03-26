const express = require("express");
const cors = require("cors");
const axios = require("axios");  // Import Axios for API calls
// require("dotenv").config();      // Load .env file

const app = express();
app.use(express.json());
app.use(cors());

const SPOONACULAR_API_KEY = "31d06ca5d33340c78b910571bbbe0ed4";

app.post("/generate", async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { mealPlan } = req.body;
    if (!mealPlan) {
      return res.status(400).json({ error: "Meal plan is required" });
    }

    // 🛠️ 1️⃣ Make a request to Spoonacular to search for recipes
    const searchUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${mealPlan}&number=1&apiKey=${SPOONACULAR_API_KEY}`;
    const searchResponse = await axios.get(searchUrl);

    if (!searchResponse.data.results.length) {
      return res.status(404).json({ error: "No recipes found" });
    }

    const recipeId = searchResponse.data.results[0].id;

    // 🛠️ 2️⃣ Get recipe details, including ingredients
    const recipeUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=${SPOONACULAR_API_KEY}`;
    const recipeResponse = await axios.get(recipeUrl);

    // Extract ingredient names
    const ingredients = recipeResponse.data.extendedIngredients.map(ing => ing.original);

    res.json({ ingredients });
  } catch (error) {
    console.error("Backend error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch grocery list" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
