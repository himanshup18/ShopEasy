import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaStar } from 'react-icons/fa';
import { products } from '../../data';
import './cart.css'; 
import './wishlist.css';
import toast from 'react-hot-toast';
function Cart() {
    const [wishlist, setwishlist] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('wishlist');
        if (storedCart) {
            setwishlist(JSON.parse(storedCart));
        }
    },[wishlist]);


    /* -----------------REMOVING PRODUCT FROM WISHLIST --------------------*/


    const removeItemFromLocalStorage = (key, valueToRemove) => {
        const currentValue = localStorage.getItem(key);
    
        if (currentValue) {
            try {
                const currentArray = JSON.parse(currentValue);
                const updatedArray = currentArray.filter(item => item.title !== valueToRemove);
                localStorage.setItem(key, JSON.stringify(updatedArray));
                toast.error('Removed from wishlist');
            } catch (error) {
                console.error('Error parsing or updating localStorage:', error);
            }
        }
    };

    const removefromwishlist = (value) => {
        removeItemFromLocalStorage('wishlist', value);
    };

    /*-------------------------------------- RETURN --------------------------------- */
    return (
        <div className="container">
        <h2>Wishlist</h2>
            <div className='wishlist-container'>
                {wishlist.map((item, ind) => {
                    const prod = products.find(prod => prod.title === item.title);
                    if (prod) {
                        return (
                            <div key={ind} className="wishlist-content">
                            <div className='wish_img_sec'>
                                    <img src={prod.image} alt={prod.title}/>
                                    <button className="remove-button" onClick={() => { removefromwishlist(prod.title) }}><FaHeart /></button>
                                    </div>
                                    <div className="wishlist_detail">
                                    <Link to={`/product/${prod.title}`} className='wishlist__title'><h2>{prod.title}</h2></Link>
                                        <p><span>Price</span> : ₹{prod.price}</p>
                                        <p><span className='rating'>{prod.rating.rate} <FaStar className='star' /></span> {prod.rating.count} Rating</p>
                                    </div>
                            </div>
                        );
                    } else {
                        return null;
                    }
                })}
            </div>   
            {wishlist.length === 0 && (
                <div className="no-items">
                    No items in wishlist
                </div>
            )}
        </div>
    );
}

export default Cart;
