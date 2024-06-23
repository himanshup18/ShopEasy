import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { Link, useParams } from 'react-router-dom';
import { products } from '../../data';
import './category.css';
import { FaRupeeSign, FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
function Category() {
    const [orderedproducts,setorderproducts]=useState([]);
    const [unfilter,setfilter]=useState(false);
    const [filterprice,setfilterprice]=useState(false);
    const [pgno,setpgno]=useState(1);
    const prodperpg=6;
    let no_of_pages=0;
    const firstindex=pgno*prodperpg-prodperpg;
    const lastindex=pgno*prodperpg;
    const { id } = useParams();

/*-------------Pagination------------------*/
const no_of_prod=products.filter(prod=>prod.category===id).length;
if(no_of_prod%prodperpg!=0){
     no_of_pages=Math.floor(no_of_prod/prodperpg)+1;
}
else{
    no_of_pages=no_of_prod/prodperpg;
}

const productarr=products.filter(prod=>prod.category===id).slice(firstindex,lastindex);

/*---------------------------------- FILTER ------------------------------------*/


    const filter = () => {
        setfilter(true);
        const filteredProducts = [...productarr]; 
        filteredProducts.sort((a, b) => {
            return b.rating.rate - a.rating.rate;
        });
        setorderproducts(filteredProducts);
        toast.success('Filtered Successfully w.r.t. Rating');
    }

    const unfilterfxn=()=>{
        setfilter(false);
        if(filterprice){
            const filteredProducts = [...productarr]; 
            filteredProducts.sort((a, b) => {
                return b.price - a.price;
            });
            setorderproducts(filteredProducts);
            toast.error('Removed filter w.r.t. rating');
        }

    }

const pricefilter=()=>{
setfilterprice(true);
const filteredProducts = [...productarr]; 
        filteredProducts.sort((a, b) => {
            return b.price - a.price;
        });
        setorderproducts(filteredProducts);
        toast.success('Filtered Successfully w.r.t. Price');
}

const unfilterfxnofprice=()=>{
    setfilterprice(false);
    if(filter){
    const filteredProducts = [...productarr]; 
    filteredProducts.sort((a, b) => {
        return b.rating.rate - a.rating.rate;
    });
    setorderproducts(filteredProducts);
    toast.error('Removed filter w.r.t. price');
}
}

   /*----------------------------------------- RETURN ----------------------------------- */

    return (
        <div className='category_container'>
            <h2>{id}</h2>
            <div className='filters'>
            <h3>Filter By :</h3>
            <div className='filter-buttons'>
            {!unfilter? <button className="filter-button" onClick={filter}>Rating</button>:
             <button className="filter-button" onClick={unfilterfxn}>Remove Filter</button>}
        
             {!filterprice? <button className="filter-button" onClick={pricefilter}>Price</button>:
             <button className="filter-button" onClick={unfilterfxnofprice}>Remove Filter</button>}
        </div></div>
          { unfilter|| filterprice? 
            <div className='product-container'>
             {orderedproducts
                .map((prod, ind) => (
                        <div key={ind} className='product'>
                                <Link to={`/product/${prod.title}`} className='product-link'>
                                    <img src={prod.image} alt={prod.title} className='product-image' />
                                    <div className='product-details'>
                                        <h3 className='product-title'>{prod.title}</h3>
                                        <p className='product-price'><span>Price :</span>₹{prod.price}</p>
                                        <p><span className='rating'>{prod.rating.rate} <FaStar className='star' /></span> {prod.rating.count} Rating</p>
                                     </div>
                                </Link>
                            </div>
                    ))}
            </div>
            :
            <div className='product-container'>
             {productarr
                    .map((prod, ind) => (
                        <div key={ind} className='product'>
                                <Link to={`/product/${prod.title}`} className='product-link'>
                                    <img src={prod.image} alt={prod.title} className='product-image' />
                                    <div className='product-details'>
                                        <h3 className='product-title'>{prod.title}</h3>
                                        <p className='product-price'><span>Price :<FaRupeeSign /></span>{prod.price}</p>
                                        <p><span className='rating'>{prod.rating.rate} <FaStar className='star' /></span> {prod.rating.count} Rating</p>
                                    </div>
                                </Link>
                            </div>
                    ))}
            </div>
            }
            <div className='pg_no'>
            <span>Page No. :</span>
            <div className='pg_no_btn'>
            {Array.from({ length: no_of_pages }, (_, index) => (
    <button key={index} onClick={() => setpgno(prev=>index + 1)}>{index + 1}</button>
))}
</div>
            </div>
        </div>
    );
}

export default Category;
