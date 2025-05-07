import React from "react";
import { motion } from "framer-motion";

// Importez vos images ici (remplacez par vos vraies images)
import AhmedImage from "../../assets/ahmed.png";
import AmineImage from "../../assets/amine.png";
import HibaImage from "../../assets/hiba.png";
import OmarImage from "../../assets/omar.png";

const teamMembers = [
  {
    id: 1,
    name: "Ahmed Mahmoud",
    image: AhmedImage,
    delay: 0.2,
  },
  {
    id: 2,
    name: "Med Amine Chebbi",
    image: AmineImage,
    delay: 0.3,
  },
  {
    id: 3,
    name: "Hiba Khedhri",
    image: HibaImage,
    delay: 0.4,
  },
  {
    id: 4,
    name: "Omar Belghith",
    image: OmarImage,
    delay: 0.5,
  },
];

const fadeIn = (delay) => {
  return {
    initial: {
      opacity: 0,
      y: 50,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: delay,
        ease: "easeInOut",
      },
    },
  }
};

const OurTeam = () => {
  return (
    <section className="bg-white py-16">
      <div className="container">
        <h1 className="text-4xl font-bold text-center pb-10">Our Team</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              variants={fadeIn(member.delay)}
              initial="initial"
              whileInView={"animate"}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="relative w-48 h-48 mb-4 rounded-full overflow-hidden border-4 border-gray-200 hover:border-primary transition-all duration-300">
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: member.delay + 0.1, 
                    ease: "easeInOut" 
                  }}
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.h3 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: member.delay + 0.2 
                }}
                className="text-xl font-bold text-center"
              >
                {member.name}
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: member.delay + 0.3 
                }}
                className="text-gray-600 text-center"
              >
                {member.position}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;