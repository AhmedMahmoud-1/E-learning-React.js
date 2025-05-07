import React from "react";
import { RiComputerLine } from "react-icons/ri";
import { CiMobile3 } from "react-icons/ci";
import { TbWorldWww } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { TbCloudComputing } from "react-icons/tb";
import { BiSolidData } from "react-icons/bi";
import { FaNetworkWired } from "react-icons/fa";
import { MdDesignServices } from "react-icons/md";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ServicesData = [
  {
    id: 1,
    title: "Web Development",
    link: "#",
    icon: <TbWorldWww />,
    delay: 0.2,
  },
  {
    id: 2,
    title: "Mobile development",
    link: "#",
    icon: <CiMobile3 />,
    delay: 0.3,
  },
  {
    id: 3,
    title: "Software development",
    link: "#",
    icon: <RiComputerLine />,
    delay: 0.4,
  },
  {
    id: 4,
    title: "BI & Data Science",
    link: "#",
    icon: <BiSolidData />,
    delay: 0.5,
  },
  {
    id: 5,
    title: "Cloud Computing",
    link: "#",
    icon: <TbCloudComputing />,
    delay: 0.6,
  },
  {
    id: 6,
    title: "Réseau",
    link: "#",
    icon: <FaNetworkWired />,
    delay: 0.7,
  },
  {
    id: 7,
    title: "UI/UX Design",
    link: "#",
    icon: <MdDesignServices />,
    delay: 0.8,
  },
  
];

const SlideLeft = (delay) => {
  return {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3, delay } },
  };
};

const Services = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const itemsPerPage = 4;

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      Math.min(prev + 1, ServicesData.length - itemsPerPage)
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section className="bg-white relative">
      <div className="container pb-14 pt-16">
        <h1 className="text-4xl font-bold text-center pb-10">
          <span className="text-primary-dark">Cours disponibles
          </span>
        </h1>

        <div className="relative">
          {/* Boutons de navigation */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md disabled:opacity-50"
          >
            <FiChevronLeft className="text-2xl" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex >= ServicesData.length - itemsPerPage}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md disabled:opacity-50"
          >
            <FiChevronRight className="text-2xl" />
          </button>

          {/* Conteneur défilable */}
          <motion.div
            className="grid grid-cols-4 gap-8 overflow-hidden"
            drag="x"
            dragConstraints={{ right: 0, left: -(currentIndex * 300) }}
          >
            {ServicesData.slice(currentIndex, currentIndex + itemsPerPage).map((service) => (
              <motion.div
                key={service.id}
                variants={SlideLeft(service.delay)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="bg-[#f4f4f4] rounded-2xl flex flex-col gap-4 items-center justify-center p-4 py-7 hover:bg-white hover:scale-105 duration-300 hover:shadow-xl min-w-[250px]"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h1 className="text-lg font-semibold text-center px-3">
                  <span className="text-primary-dark">{service.title}</span>
                </h1>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Services;