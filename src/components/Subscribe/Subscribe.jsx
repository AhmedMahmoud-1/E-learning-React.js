import React from "react";
import { FaBell } from "react-icons/fa";
import BgImage from "../../assets/bg.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


const bgStyle = {
  backgroundImage: `url(${BgImage})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const Subscribe = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register");
  };
  return (
    <section className="bg-[#f7f7f7]">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        style={bgStyle}
        className="container py-24 md:py-48"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="flex flex-col justify-center"
        >
          <div className="text-center space-y-4 lg:max-w-[430px] mx-auto">
            <h1 className="text-4xl font-bold !leading-snug">
               Plus de 10 000 étudiants apprennent avec nous
            </h1>
            <p>
            Rejoignez une communauté d'apprenants passionnés 
                    et progressez avec nous.
            </p>
           
            <button
              onClick={handleRegister}
              className="primary-btn !mt-8 inline-flex items-center gap-4 group"
            >
              Inscrivez-vous
              <FaBell className="group-hover:animate-bounce group-hover:text-lg duration-200" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Subscribe;
