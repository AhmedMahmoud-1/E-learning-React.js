import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authenticateUser, saveUserData, getCurrentUser } from '../../utils/localStorage';
import logo from '../../assets/logo.png';
import backgroundImage from '../../assets/bg_login.jpg';

export const FadeUp = (delay) => ({
  initial: { opacity: 0, y: 50 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      duration: 0.3,
      delay: delay,
      ease: "easeInOut",
    },
  },
});

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.rememberMe) {
      setEmail(user.email);
      setPassword(user.password);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const user = authenticateUser(email, password);
    
    if (user) {
      const userData = {
        ...user,
        rememberMe
      };
      
      saveUserData(userData);
      
      if (user.userType === 'student') {
        navigate('/homeStudent');
      } else {
        navigate('/homeTeacher');
      }
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  const handleSignUpRedirect = () => navigate('/register');
  const handleLogoClick = () => navigate('/');

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        className="absolute inset-0 bg-black bg-opacity-30"
      />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4 z-10"
      >
        <motion.div
          variants={FadeUp(0.2)}
          initial="initial"
          animate="animate"
          className="flex justify-center mb-6 cursor-pointer"
          onClick={handleLogoClick}
        >
          <img src={logo} alt="Logo" className="h-16 w-auto hover:opacity-80 transition-opacity duration-200" />
        </motion.div>
        
        <motion.h1
          variants={FadeUp(0.4)}
          initial="initial"
          animate="animate"
          className="text-3xl font-bold text-center mb-8 text-gray-800"
        >
          Connexion
        </motion.h1>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm"
          >
            {error}
          </motion.div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <motion.div variants={FadeUp(0.6)} initial="initial" animate="animate">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="votre@email.com"
              required
            />
          </motion.div>
          
          <motion.div variants={FadeUp(0.8)} initial="initial" animate="animate">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="••••••••"
              required
            />
          </motion.div>
          
          <motion.div variants={FadeUp(1.0)} initial="initial" animate="animate" className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Se souvenir de moi
              </label>
            </div>
            
            <div className="text-sm">
              <button type="button" className="font-medium text-orange-600 hover:text-orange-500">
                Mot de passe oublié?
              </button>
            </div>
          </motion.div>
          
          <motion.div variants={FadeUp(1.2)} initial="initial" animate="animate">
            <button 
              type="submit" 
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-200"
            >
              Se connecter
            </button>
          </motion.div>

          <motion.div
            variants={FadeUp(1.4)}
            initial="initial"
            animate="animate"
            className="text-center mt-6"
          >
            <p className="text-gray-600">
              Nouveau sur notre plateforme?{' '}
              <button 
                type="button"
                onClick={handleSignUpRedirect}
                className="font-medium text-orange-600 hover:text-orange-500 underline cursor-pointer"
              >              
                Créez un compte
              </button>
            </p>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;