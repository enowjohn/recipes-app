import React from 'react';
import RecipeList from './components/RecipeList';
// import { Link } from 'react-router-dom';
import './App.css'
// import './Components/Styles.css'
const App = () => {
  return (
    <div>
      <div className="logo">
      <h1 className='header'> Recipe App</h1>
      </div>
      <RecipeList />
    </div>
  );
};
export default App;