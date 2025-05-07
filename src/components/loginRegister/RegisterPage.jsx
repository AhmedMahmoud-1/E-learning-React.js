import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { saveUserData } from '../../utils/localStorage';
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

const RegisterPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    subject: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    const userData = {
      ...formData,
      userType,
      rememberMe: false
    };

    saveUserData(userData);
    
    if (userType === 'student') {
      navigate('/homeStudent');
    } else {
      navigate('/homeTeacher');
    }
  };

  const handleLoginRedirect = () => navigate('/login');
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
        transition={{ duration: 0.3 }}
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
          Créer un compte
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

        <form className="space-y-4" onSubmit={handleSubmit}>
          <motion.div variants={FadeUp(0.6)} initial="initial" animate="animate">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Votre nom complet"
              required
            />
          </motion.div>

          <motion.div variants={FadeUp(0.8)} initial="initial" animate="animate">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="votre@email.com"
              required
            />
          </motion.div>

          <motion.div variants={FadeUp(1.0)} initial="initial" animate="animate">
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de compte</label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setUserType('student')}
                className={`flex-1 py-2 px-4 rounded-md border ${
                  userType === 'student' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                Étudiant
              </button>
              <button
                type="button"
                onClick={() => setUserType('teacher')}
                className={`flex-1 py-2 px-4 rounded-md border ${
                  userType === 'teacher' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                Professeur
              </button>
            </div>
          </motion.div>

          {userType === 'student' && (
            <motion.div variants={FadeUp(1.1)} initial="initial" animate="animate">
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro d'étudiant</label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Votre numéro d'étudiant"
                required
              />
            </motion.div>
          )}

          {userType === 'teacher' && (
            <motion.div variants={FadeUp(1.1)} initial="initial" animate="animate">
              <label className="block text-sm font-medium text-gray-700 mb-1">Matière enseignée</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Sélectionnez une matière</option>
                <option value="Web Development">Web Development</option>
                <option value="Software Development">Software Development</option>
                <option value="Apps Development">Apps Development</option>
                <option value="BI & Data Science">BI & Data Science</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Réseau">Réseau</option>
              </select>
            </motion.div>
          )}

          <motion.div variants={FadeUp(1.2)} initial="initial" animate="animate">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="••••••••"
              required
            />
          </motion.div>

          <motion.div variants={FadeUp(1.4)} initial="initial" animate="animate">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="••••••••"
              required
            />
          </motion.div>

          <motion.div variants={FadeUp(1.6)} initial="initial" animate="animate">
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-200"
            >
              S'inscrire
            </button>
          </motion.div>

          <motion.div
            variants={FadeUp(1.8)}
            initial="initial"
            animate="animate"
            className="text-center mt-4"
          >
            <p className="text-gray-600">
              Déjà un compte?{' '}
              <button
                type="button"
                onClick={handleLoginRedirect}
                className="font-medium text-orange-600 hover:text-orange-500 underline cursor-pointer"
              >
                Connectez-vous
              </button>
            </p>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;