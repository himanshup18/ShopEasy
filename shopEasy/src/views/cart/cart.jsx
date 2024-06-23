import React, { useEffect, useState } from 'react';
import { FaMinus, FaPlus, FaRemoveFormat, FaRupeeSign, FaStar, FaTrash } from 'react-icons/fa';
import { products } from '../../data';
import './cart.css'; 
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
const Publishable_Key="pk_test_51O2Ys0SITp9UXygc6nHRqy20FgREJinDDOCnDGjdwcreaRL3m2xZSPxcqGMZnBr6XswlmoTvHnsCEEGZFAa8F0nQ00UnX8OTmP";

const Cart = ()=> {
    const [cartlist, setCartlist] = useState([]);
 const[totalprice,settotalprice]=useState(0);
 const [checkout,setCheckout]=useState(false);
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCartlist(JSON.parse(storedCart));
        }
        const x = cartlist.reduce((total, item) => {
            return total + (item.quantity * item.price);
        }, 0);
        
        settotalprice(x);
    },[cartlist]);

   
   
    /* -----------------REMOVING PRODUCT FROM CART --------------------*/

    const removeItemFromLocalStorage = (key, valueToRemove) => {
        const currentValue = localStorage.getItem(key);
    
        if (currentValue) {
            try {
                const currentArray = JSON.parse(currentValue);
                const updatedArray = currentArray.filter(item => item.title !== valueToRemove);
                localStorage.setItem(key, JSON.stringify(updatedArray));
                toast.error('Item Removed from cart');
            } catch (error) {
                console.error('Error parsing or updating localStorage:', error);
            }
        }
    };

/* ---------------------------- Updating quantities ----------------------------- */

    const updatequantity = (title, quantity) => {
        const currentValue = localStorage.getItem('cart');
    
        if (currentValue) {
            try {
                const currentArray = JSON.parse(currentValue);
                // Find the item in the array that matches the title
                const updatedArray = currentArray.map(item => {
                    if (item.title === title) {
                        // Update the quantity of the matched item
                        return { ...item, quantity: quantity };
                    }
                    return item; 
                });
                localStorage.setItem('cart', JSON.stringify(updatedArray));
            } catch (error) {
                console.error('Error parsing or updating localStorage:', error);
            }
        }
    };
    
    const subtract =(value,count)=>{
        if(count==1){
            removeItemFromLocalStorage('cart',value);
        }
        else{
        updatequantity(value,count-1);
        }
    }

    const add=(value,count)=>{
        updatequantity(value,count+1);
    }


/*-------------Ckeckout-------------*/

const makePayment = async () => {
    setCheckout(true);
      const storedCart = JSON.parse(localStorage.getItem('cart')); // Parse storedCart from string to object
   console.log(storedCart);
    if(storedCart.length==0){
        toast.error("Cart is empty");
        return;
    }
    const stripe = await loadStripe(Publishable_Key);
  
   try{ // console.log(storedCart);
    const response = await axios.post("https://product-catalog-jywz.onrender.com/api/create-checkout-session", storedCart);
    const sessionId = response.data.id;
    // Redirect to the Stripe Checkout page
    console.log(sessionId);
    const { error } = await stripe.redirectToCheckout({
        sessionId,
    });
    setCheckout(false);
    if (error) {
        console.log(error);
    }
}
catch(error){
    console.log(error);
    toast.error("Something went wrong");
}

};

/*------------------------------------ RETURN ------------------------------ */

    return (
        <div className="cart__container">
        <h2>Cart</h2>
            <div className='cart__content'><div>
                {cartlist.map((item, ind) => {
                    const prod = products.find(prod => prod.title === item.title);
                    if (prod) {
                        return (
                            <div key={ind} className="cart_detail">
                            
                                    <img src={prod.image} alt={prod.title} />
                                    
                                    <div className="prod_detail">
                                    <Link to={`/product/${prod.title}`} className='product__title'>
                                        <h2>{prod.title}</h2></Link>
                                        <p><span>Price</span> : ₹{prod.price}</p>
                                        <p><span className='rating'>{prod.rating.rate} <FaStar className='star' /></span> {prod.rating.count} Rating</p>
                                        <div className="quantity-controls">
                                            <button  className='add__minus' onClick={() => subtract(prod.title,item.quantity)}>{item.quantity === 1 ? <FaTrash /> : <FaMinus />}</button>
                                            <span className="quantity-display">{item.quantity}</span>
                                            <button className='add__minus' onClick={()=>add(prod.title,item.quantity)}><FaPlus /></button>
                                        </div>
                                    </div>
                        
                            </div>
                        );
                    } else {
                        return null;
                    }
                })}
</div>

<div className="cart-container">
    <table className="cart-table">
        <thead>
            <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
            </tr>
        </thead>
        <tbody>
            {cartlist.map(item => (
                <tr key={item.title}>
                    <td>{item.title}</td>
                    <td>₹{item.price}</td>
                    <td>{item.quantity}</td>
                </tr>
            ))}
        </tbody>
    </table>
    <h2 className="total-amount">Total Amount: ₹{totalprice}</h2>
    <button className="checkout-button" onClick={makePayment}>{checkout?"Loading":"Pay Now"}</button>
</div>

            </div>
            {cartlist.length === 0 && (
                <div className="no-items">
                    No items selected in your Cart
                </div>
            )} 
        </div>
    );
}

export default Cart;
