import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { products } from '../../data';
import './product.css';
import { FaCartPlus, FaHeart, FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Context } from '../..';

function Category() {
    const {isAuthorized}=useContext(Context);
    const { id } = useParams();
const [redornot,setredornot]=useState(false);
const [cart_btn,setcart_btn]=useState(true);
   const [wishlist, setWishlist] = useState([]);
   useEffect(()=>{
    const pastStorage = localStorage.getItem('wishlist');
    const wishlistItems = pastStorage ? JSON.parse(pastStorage) : [];
     setWishlist(wishlistItems);
     const existingItemIndex = wishlistItems.findIndex(item => item.title === id);
     if (existingItemIndex !== -1) {
        setredornot(true);
     }
   },[wishlist]);

   useEffect(()=>{
    const pastStorage = localStorage.getItem('cart');
    const wishlistItems = pastStorage ? JSON.parse(pastStorage) : [];
     setWishlist(wishlistItems);
     const existingItemIndex = wishlistItems.findIndex(item => item.title === id);
     if (existingItemIndex !== -1) {
        setcart_btn(false);
     }
   },[]);

     const categproduct=products.filter(prod=>prod.title===id);


     const munna=()=>{
         setcart_btn(!cart_btn);
     }

    /*-------------------------------ADD TO CART ----------------------------- */
    const addtocart = (title, price, quantity) => {
        if(!isAuthorized){
            toast.error('Please login first');
            return;
        }
        const obj = {
            title: title,
            price: price,
            quantity: quantity
        };
    
        const pastStorage = localStorage.getItem('cart');
        const cartItems = pastStorage ? JSON.parse(pastStorage) : [];
      
        const existingItemIndex = cartItems.find(item => item.title === title);
if(!existingItemIndex){
            cartItems.push(obj);
            localStorage.setItem('cart', JSON.stringify(cartItems));
            setcart_btn(false);
            toast.success('Item Added to cart');
}
else{
    setcart_btn(true);
}
    };
    
  /*-------------------------------------- ADD TO WISHLIST ----------------------------- */
  const addtowishlist = (title) => {
    if(!isAuthorized){
        toast.error('Please login first');
        return;
    }
setWishlist(prev=>!prev);
    const obj = {
        title: title,
    };

    const pastStorage = localStorage.getItem('wishlist');
    const wishlistItems = pastStorage ? JSON.parse(pastStorage) : [];

    const existingItemIndex = wishlistItems.findIndex(item => item.title === title);
    const updatedArray = wishlistItems.filter(item => item.title !== title);
    if (existingItemIndex !== -1) {
        setredornot(false);
        localStorage.setItem('wishlist', JSON.stringify(updatedArray));
        toast.error('Removed from wishlist');
    } else {
        
        setredornot(true);
        toast.success('Added to wishlist');
        wishlistItems.push(obj);
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }  
};


    
/*-----------------------------------RETURN ----------------------------------- */
    return (
        <div className="box">
            <div className='prod-details'>
            
                {categproduct
                    .map((prod, ind) => (
                        <div key={ind} className='prod'>
                            <img src={prod.image} alt='Product Image' className='prod-image' />
                           
                            <div className='prod-info'>
                                <h2 className='prod-title'>{prod.title}</h2>
                                <p><span className='prod-rating'>{prod.rating.rate} <FaStar className='star' /></span> {prod.rating.count} Ratings</p>
                                <p><span>Price</span> : ₹{prod.price}</p>
                                <span className='prod-specs'>Description :</span>
                                <span className='prod-description'>{prod.description}</span>
                                <span className='prod-specs'>Specifications :</span>
                    <ul className='specs-list'>
                        {Object.entries(prod.speci).map(([key, value], index) => (
                            <li key={index} className='specs-list1'><p className='speci-key'>{key}</p>: <p className='speci-value'>{value}</p></li>
                        ))}
                    </ul>
                    <div className='action-buttons'>
                 {cart_btn?<button onClick={()=>addtocart(prod.title,prod.price,1)} className='add-to-cart'><span> <FaCartPlus />  Add to Cart</span> </button>
               :<Link to='/cart' onClick={()=>addtocart(prod.title,prod.price,1)} className='add-to-cart go-to-cart'><span><FaCartPlus />  Go to Cart </span>  </Link>
                  }  <button onClick={()=>addtowishlist(prod.title)
                                         } className={redornot?'filledheart':'add-to-wishlist'}> <span><FaHeart />  Wishlist </span></button>
                </div>
                    </div>   
                        </div>
                    ))}
                
                </div>
        </div>
    );
}

export default Category;
