import React from "react";
import BannerPng from "../../assets/banner.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Banner2 = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register");
  };
  return (
    <section>
      <div className="container py-14 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-8 space-y-6 md:space-y-0">
        {/* Banner Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <div className="text-center md:text-left space-y-4 lg:max-w-[450px]">
            <h1 className="text-4xl font-bold !leading-snug">
            Rejoignez  pour améliorer vos compétences
            </h1>
            <p className="text-primary-dark">
              Rejoignez des milliers d'apprenants et accédez à des ressources exclusives pour atteindre vos objectifs.
            </p>
            <button
              onClick={handleRegister}
              className="primary-btn !mt-8"
            >
              Inscrivez-vous
            </button>
          </div>
        </motion.div>
        {/* Banner Image */}
        <div className="flex justify-center items-center">
          <motion.img
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            src={BannerPng}
            alt=""
            className="w-[350px] md:max-w-[450px] object-cover drop-shadow"
          />
        </div>
      </div>
    </section>
  );
};

export default Banner2;
