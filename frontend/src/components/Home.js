import React from "react";
import Navbar from "./Navbar";
import "../styles/HomePage.css";
import { motion } from "framer-motion";
import img from "../images/bg.jpg";

const HomePage = () => {
  return (
    <div className="home-container">

      <motion.section
        className="hero-section"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-content">
          <div className="text-content">
            <h1>Welcome to <span>CodeHive</span></h1>
            <p>Your platform for coding assessments, interviews, and rankings.</p>
            <a href="#features" className="cta-button">Get Started</a>
          </div>
          {/* <motion.img
            src={img}
            alt="CodeHive Illustration"
            className="hero-image"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          /> */}
        </div>
      </motion.section>

      <motion.section
        id="features"
        className="features-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2>Features</h2>
        <div className="features-container">
          <motion.div
            className="feature"
            whileHover={{ scale: 1.1, rotate: 3 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3>Online Code Editor</h3>
            <p>Integrated editor for seamless coding experience.</p>
          </motion.div>
          <motion.div
            className="feature"
            whileHover={{ scale: 1.1, rotate: 3 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3>Ranking System</h3>
            <p>Real-time rankings to track your progress.</p>
          </motion.div>
          <motion.div
            className="feature"
            whileHover={{ scale: 1.1, rotate: 3 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3>Plagiarism Check</h3>
            <p>Ensure originality in your code submissions.</p>
          </motion.div>
          <motion.div
            className="feature"
            whileHover={{ scale: 1.1, rotate: 3 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3>Online Interviews</h3>
            <p>Conduct and attend live coding interviews effortlessly.</p>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="about"
        className="about-section"
        initial={{ x: "-100vw" }}
        whileInView={{ x: 0 }}
        transition={{ duration: 1 }}
      >
        <h2>About CodeHive</h2>
        <p>CodeHive is designed to simplify coding assessments and interviews. Our platform provides real-time rankings, plagiarism checks, and much more to ensure a fair and efficient process.</p>
      </motion.section>

      <footer id="contact" className="footer">
        <h3>Contact Us</h3>
        <p>Email: support@codehive.com</p>
        <p>&copy; 2025 CodeHive. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
