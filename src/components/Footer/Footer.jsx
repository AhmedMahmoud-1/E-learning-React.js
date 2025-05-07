import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-28 bg-[#f7f7f7]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="container"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 md:gap-4">
          {/* first section */}
          <div className="space-y-4 max-w-[300px]">
            <h1 className="text-2xl font-bold">E-learning</h1>
            <p className="text-dark2">
            Notre plateforme d’e-learning offre une expérience d’apprentissage flexible et interactive, 
            adaptée à tous les niveaux. Grâce à des cours dispensés par des experts, 
            des ressources pédagogiques variées et un accès à vie, vous pouvez développer vos compétences à votre rythme, 
            où que vous soyez. Rejoignez notre communauté et découvrez une manière moderne et efficace d'apprendre!
            </p>
          </div>
          {/* second section */}
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Courses</h1>
              <div className="text-dark2">
                <ul className="space-y-1 text-lg">
                  <li className="cursor-pointer hover:text-secondary duration-200">
                    Web Development
                  </li>
                  <li className="cursor-pointer hover:text-secondary duration-200">
                    Software Development
                  </li>
                  <li className="cursor-pointer hover:text-secondary duration-200">
                    Apps Development
                  </li>
                  <li className="cursor-pointer hover:text-secondary duration-200">
                  BI & Data Science
                  </li>
                  <li className="cursor-pointer hover:text-secondary duration-200">
                  Cloud Computing
                  </li>
                  <li className="cursor-pointer hover:text-secondary duration-200">
                  UI/UX Design
                  </li>
                  <li className="cursor-pointer hover:text-secondary duration-200">
                  Réseau
                  </li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Links</h1>
              <div className="text-dark2">
                <ul className="space-y-2 text-lg">
                  <li className="cursor-pointer hover:text-secondary duration-200" >
                  Accueile
                  </li>
                  <li className="cursor-pointer hover:text-secondary duration-200">
                  Cours
                  </li>
                  <li className="cursor-pointer hover:text-secondary duration-200">
                  À propos
                  </li>
                  <li className="cursor-pointer hover:text-secondary duration-200">
                  Contactez-nous
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* third section */}
          <div className="space-y-4 max-w-[300px]">
            <h1 className="text-2xl font-bold">Get In Touch</h1>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Enter your email"
                className="p-3 rounded-s-xl bg-white w-full py-4 focus:ring-0 focus:outline-none placeholder:text-dark2"
              />
              <button className="bg-primary text-white font-semibold py-4 px-6 rounded-e-xl">
                Go
              </button>
            </div>
            {/* social icons */}
            <div className="flex space-x-6 py-3">
              <a href="#">
                <FaWhatsapp className="cursor-pointer hover:text-primary hover:scale-105 duration-200" />
              </a>
              <a href="https://www.instagram.com/ahmed_mh_1/">
                <FaInstagram className="cursor-pointer hover:text-primary hover:scale-105 duration-200" />
              </a>
              <a href="https://github.com/Ahmedmh1">
                <FaGithub className="cursor-pointer hover:text-primary hover:scale-105 duration-200" />
              </a>
              <a href="https://www.facebook.com/ahmed.mh0">
                <FaFacebook className="cursor-pointer hover:text-primary hover:scale-105 duration-200" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
