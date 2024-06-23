import React, { useContext, useEffect } from "react";
import { Route,Routes} from "react-router-dom";
import { BASE_URL } from './Base_url.js';
import axios from "axios";
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword.jsx';
import ChangePassword from './components/Auth/ChangePassword.jsx';
import { Context } from '.';
import Home from "./views/home/home";
import Category from "./views/category/category";
import Product from "./views/products/product";
import Cart from "./views/cart/cart";
import Wishlist from "./views/cart/wishlist";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import ScrollToTop from "./components/Scrolltotop";
import toast, { Toaster } from "react-hot-toast";
function App() {
  const {isAuthorized,setIsAuthorized,user,setUser}=useContext(Context);

  const getUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getuser`,{withCredentials:true});
      console.log("app response",response);
      setUser(response.data.user);
      setIsAuthorized(true);
      toast.success(response.data.message);

    } catch (error) {
      toast.success(error.response.data.message);
      setIsAuthorized(false);
      console.error('Error fetching user data:', error);
    }
  };
 
  useEffect(() => {
    getUser();
  }, [isAuthorized]);
  
  console.log("auth->",isAuthorized);
  console.log("user->",user);

  return (
    <div>
    <Navbar />
    <ScrollToTop />
     <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Register />} />
      <Route path='/forgotPassword' element={<ForgotPassword />} />
      <Route path='/changePassword' element={<ChangePassword />} />
          <Route exact path="/category/1/:id" element={<Category />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
        <Footer />
        <Toaster />
    </div>
  );
}

export default App;
