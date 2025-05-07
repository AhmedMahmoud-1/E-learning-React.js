import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Banner2 from "./components/Banner/Banner2";
import Footer from "./components/Footer/Footer";
import OurTeam from "./components/OurTeam/OurTeam";
import LoginPage from "./components/loginRegister/LoginPage";
import RegisterPage from "./components/loginRegister/RegisterPage";

import HomeStudent from "./components/teacherStudent/HomeStudent";
import ProfesseurCours from "./components/teacherStudent/ProfesseurCours";
import HomeTeacher from "./components/teacherStudent/HomeTeacher";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <main className="overflow-x-hidden bg-white text-dark">
              <Navbar />
              <section id="hero"><Hero /></section>
              <section id="services"><Services /></section>
              <section id="about">
                <Banner /><Banner2 /><Subscribe/>
              </section>
              <section id="contact">
                <OurTeam />
                <Footer />
              </section>
            </main>
          } 
        />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route 
          path="/homeStudent" 
          element={
            <PrivateRoute requiredUserType="student">
              <HomeStudent />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/homeTeacher" 
          element={
            <PrivateRoute requiredUserType="teacher">
              <HomeTeacher />
            </PrivateRoute>
          } 
        />
        <Route path="/teacher/courses" element={<ProfesseurCours />} />


      </Routes>
    </Router>
  );
};

export default App;