import React, { useState, useEffect } from 'react';

const RecipeList = () => {
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setMeals(data.meals);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMeals();
  }, [searchTerm]);

  const handleMealClick = (meal) => {
    setSelectedMeal(meal);
  };

  const handleCloseDialog = () => {
    setSelectedMeal(null);
  };

  const addToFavorites = (meal) => {
    if (!favorites.find((fav) => fav.idMeal === meal.idMeal)) {
      const updatedFavorites = [...favorites, meal];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  const removeFromFavorites = (meal) => {
    const updatedFavorites = favorites.filter((fav) => fav.idMeal !== meal.idMeal);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  return (
    <>
      <div className='container'>
        <input
          type='search'
          placeholder='Enter your meal'
          className='Search-bar'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <ul className='meals'>
          {meals.map((meal) => (
            <li key={meal.idMeal} className='meal-container'>
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className='img-sec'
              />
              <h3 className='headings'>{meal.strMeal}</h3>
              <div className='button-container'>
                <button
                  className='addbtn'
                  onClick={() => addToFavorites(meal)}
                  disabled={favorites.find((fav) => fav.idMeal === meal.idMeal)}
                >
                  {favorites.find((fav) => fav.idMeal === meal.idMeal)
                    ? 'Added to Favorites'
                    : 'Add to Favorites'}
                </button>
                <button className='detailsbtn' onClick={() => handleMealClick(meal)}>
                  View Details
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {favorites.length > 0 && (
        <div className='favorites'>
          <h2>Favorite Meals</h2>
          <ul className='favorites-container'>
            {favorites.map((meal) => (
              <li key={meal.idMeal} className='meal-container'>
                <div className='fav-img'>
                  <img src={meal.strMealThumb} alt={meal.strMeal} className='img-sec'/>
                  <h3 className='headings'>{meal.strMeal}</h3>
                </div>
                <div className='button-container'>
                  <button className='detailsbtn' onClick={() => handleMealClick(meal)}>
                    View Details
                  </button>
                  <button className='removebtn' onClick={() => removeFromFavorites(meal)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedMeal && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>{selectedMeal.strMeal}</h2>
            <img src={selectedMeal.strMealThumb} alt={selectedMeal.strMeal} className='modal-img' />
            <h3>Ingredients:</h3>
            <ul>
              {Array.from(Array(20).keys()).map((num) => {
                const ingredientKey = `strIngredient${num + 1}`;
                const measureKey = `strMeasure${num + 1}`;
                if (selectedMeal[ingredientKey]) {
                  return (
                    <li key={ingredientKey}>
                      {selectedMeal[ingredientKey]} - {selectedMeal[measureKey]}
                    </li>
                  );
                }
                return null;
              })}
            </ul>
            <h3>Instructions:</h3>
            <p>{selectedMeal.strInstructions}</p>
            <button onClick={handleCloseDialog}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default RecipeList;

