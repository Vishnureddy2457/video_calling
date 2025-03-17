import React from "react";
import Carousel from "./Carousel";
import HeroSection from "./Hero";
import CardDisplayPage from "./Cards";
import AboutUs from "./About";
import Footer from "./Footer";
import ContactForm from "./Contactform";

const Home = () => {
  return (
      <div className="max-w-screen">
      <Carousel/>
      <HeroSection/>
      <CardDisplayPage/>
      <AboutUs/>
      <ContactForm/>
      <Footer/>
      </div>
  );
};

export default Home;
