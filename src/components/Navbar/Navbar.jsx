import React, { useState } from "react";
import LogoPng from "../../assets/logo.png";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";

const NavbarMenu = [
  {
    id: 1,
    title: "Accueil",
    path: "hero",
  },
  {
    id: 2,
    title: "Cours",
    path: "services",
  },
  {
    id: 3,
    title: "À propos",
    path: "about",
  },
  {
    id: 4,
    title: "Contactez-nous",
    path: "contact",
  },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    navigate("/login");
    setIsMenuOpen(false); 
  };

  return (
    <nav className="relative z-20">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="container py-10 flex justify-between items-center"
      >
        {/* Logo section */}
        <div className="flex justify-center items-center h-full">
          <motion.img
            whileInView={{ opacity: 1, x: 100 }}
            src={LogoPng}
            className="w-48 h-48 object-contain"
            alt="Logo"
          />
        </div>

        {/* Menu section - Desktop */}
        <div className="hidden lg:block">
          <ul className="flex items-center gap-3">
            {NavbarMenu.map((menu) => (
              <li key={menu.id}>
                <Link
                  to={menu.path}
                  smooth={true}
                  duration={500}
                  offset={-100}
                  className="inline-block py-2 px-3 hover:text-secondary relative group cursor-pointer"
                  activeClass="text-secondary font-bold"
                >
                  <div className="w-2 h-2 bg-secondary absolute mt-4 rounded-full left-1/2 -translate-x-1/2 top-1/2 bottom-0 group-hover:block hidden"></div>
                  {menu.title}
                </Link>
              </li>
            ))}
            <button 
              onClick={handleLogin}
              className="primary-btn"
            >
              Se connecter
            </button>
          </ul>
        </div>

        {/* Mobile Hamburger menu section */}
        <div className="lg:hidden">
          <button 
            onClick={toggleMenu} 
            className="focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <IoMdClose className="text-4xl" />
            ) : (
              <IoMdMenu className="text-4xl" />
            )}
          </button>
        </div>

        {/* Mobile Menu - appears when hamburger is clicked */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-md"
          >
            <ul className="flex flex-col items-center py-4">
              {NavbarMenu.map((menu) => (
                <li key={menu.id} className="w-full text-center">
                  <Link
                    to={menu.path}
                    smooth={true}
                    duration={500}
                    offset={-100}
                    className="inline-block py-3 px-4 w-full hover:bg-gray-100 cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                    activeClass="bg-gray-100 font-bold"
                  >
                    {menu.title}
                  </Link>
                </li>
              ))}
              <li className="w-full text-center py-3">
                <button 
                  onClick={handleLogin}
                  className="primary-btn"
                >
                  Se connecter
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </motion.div>
    </nav>
  );
};

export default Navbar;