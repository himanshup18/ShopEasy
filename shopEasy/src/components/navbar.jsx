import React, { useContext, useState } from "react";
import { FaArrowLeft, FaCartPlus, FaHeart, FaHome} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../Base_url";
import "./navbar.css";
import toast from "react-hot-toast";
import { Context } from "..";

const navbarObj=[
  {
    id: 1,
    title: "Home",
    link: "/",
  },
  {
    id: 2,
    title: "Cart",
    link: "/cart",
  },
  {
    id: 3,
    title: "Wishlist",
    link: "/wishlist",
  },
  
]

function Navbar() {
  const {isAuthorized,setIsAuthorized,user,setUser}=useContext(Context);

  const [showMenu, setShowMenu] = useState(false);

  const back_fxn = () => {
    window.history.back();
  };

  const handleLogout = async () => {
    try {
   setShowMenu(!showMenu)
        // setOpen(false);
      const response = await axios.get(`${BASE_URL}/logout`,{withCredentials:true});
      console.log(response.data);
      toast.success(response.data.message);
      setIsAuthorized(false);
      setUser(null);
      // Redirect or perform any other action after successful logout
    } catch (error) {
      console.error(error.response.data);
      toast.error(error.response.data.message);
    }
  };

  const path = window.location.pathname;
  if(path==='/success'){
    // toast.success('Payment successfull');
    alert('Payment successfull');
    window.location.href='/';
  }else if(path==='/cancel'){
    // toast.error('Payment cancelled');
    alert('Payment cancelled');
    window.location.href='/';
  }
  return (
    <>
    {path==='/login'?<></>:
    <nav className="navbar">
      <button className="back_btn" onClick={() => back_fxn()}>
        <FaArrowLeft />
      </button>
         <Link  className="heading" to='/'> <span className="nav_heading">Product</span></Link>
      <div className={`${showMenu ? "nav__menu show-menu" : "nav__menu"}`}>
        <div className="btn">
        {navbarObj.map((item) => (
            <Link
              to={item.link}
              className="cart"
              onClick={() => setShowMenu(!showMenu)}
            >
              {item.title}
            </Link>
          ))}
{isAuthorized?
         <button onClick={handleLogout} className="cart">
            Logout
          </button>:
          <Link to="/login" className="cart" onClick={() => setShowMenu(!showMenu)}>
            Get Started
          </Link>
}
           {/* 
          <Link
            to="/cart"
            className="cart"
            onClick={() => setShowMenu(!showMenu)}
          >
            Cart
          </Link>
          <Link
            to="/wishlist"
            className="cart"
            onClick={() => setShowMenu(!showMenu)}
          >
            Wishlist
          </Link> */}
        </div>
      </div>

      <div
        className={`${
          showMenu ? "nav__toggle animated-toggle" : "nav__toggle"
        }`}
        onClick={() => setShowMenu(!showMenu)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>}
    </>
  );
}

export default Navbar;
