import React from 'react';
import './footer.css';
import { useLocation } from 'react-router-dom';
const Footer = () => {
  const path=useLocation().pathname;
  return (
    <>
   { path==='/login'?<></>:<footer className='footer'>
      <p>&copy; 2024 Product Catalog</p>
    </footer>}
    </>
  );
};

export default Footer;
