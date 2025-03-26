import React, { useState } from "react";
import { Card } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { motion } from "framer-motion";
import "./App.css";

const GroceryPlanner = () => {
  const [mealPlan, setMealPlan] = useState("");
  const [groceryList, setGroceryList] = useState([]);

  const generateList = async () => {
    if (!mealPlan) return;
    try {
      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealPlan }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Debugging

      // Ensure groceryList is always an array
      setGroceryList(data.ingredients || []);
    } catch (error) {
      console.error("Error fetching grocery list:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <Card className="w-full max-w-lg p-6 shadow-lg flex flex-col" style={{ maxHeight: "80vh" }}>
        <h2 className="text-xl font-bold mb-4">Grocery List AI Planner</h2>
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Enter meals (e.g., Pasta, Salad)"
            value={mealPlan}
            onChange={(e) => setMealPlan(e.target.value)}
          />
          <Button onClick={generateList}>Generate List</Button>
        </div>
        {groceryList.length > 0 && (
          <div className="mt-4 overflow-y-auto" style={{ maxHeight: "50vh" }}>
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              {groceryList.map((item, index) => (
                <li key={index} className="p-2 bg-gray-100 rounded">
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>
        )}
      </Card>
    </div>
  );
};

export default GroceryPlanner;
