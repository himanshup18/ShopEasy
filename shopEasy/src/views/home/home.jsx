import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import { categories } from '../../data';


const YourComponent = () => {

   const scrollToCategory = () => {
        const categoryContainer = document.getElementById('category-container');
        categoryContainer.scrollIntoView({ behavior: 'smooth' });
    }


    return (
        <div className='home-container'>
        <div className='welcome_sec'>
          <div className='first_sec'>
    <h5>WELCOME TO</h5>
    <h1>Our Store</h1>
    <span>Lorem ah zcncna H CZ HDNNAZ Bnxanjjdhac sz acsa nz</span>
<button onClick={()=>scrollToCategory()}>SHOP NOW</button>
          </div>
          <div className='second_sec'>
          </div>
        </div>
        <div className='category_section' id='category-container'>
        <h6>CHECK NOW</h6>
        <h1>Our Feature Products</h1>
        <div className='grid'>
            {categories.map((cate, index) => (
                <ul key={index} className='category-item'> 
                    <Link className='category-link' to={`/category/1/${cate.category}`}>
                        <img src={cate.image} alt={cate.category} className='category-image' />
                        <li className='category-name'>{cate.category}</li>
                    </Link>
                </ul>
            ))}
        </div>
        </div>
        </div>
    );
};

export default YourComponent;
