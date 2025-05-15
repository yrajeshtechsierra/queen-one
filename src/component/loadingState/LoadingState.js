import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../assets/css/loadingState.css";
import videoSource from "../../assets/videos/technology_videos.mp4";
import Step3Animation from "../Step3Animation";
import archiveHexcellenceLogo from "../../assets/images/archiveHexcellenceborderLogo.png"

const LoadingState = () => {
  const [videoEnded, setVideoEnded] = useState(false);
  const [showArtDeco, setShowArtDeco] = useState(false);
  const [showNextComponent, setShowNextComponent] = useState(false);
  
  // Handle video end and trigger art deco animation
  useEffect(() => {
    if (videoEnded) {
      setShowArtDeco(true);
      
      // After 5 seconds (3s for zoom animation + 2s full display), transition to next component
      const timer = setTimeout(() => {
        setShowArtDeco(false);
        
        // Wait for fade out animation to complete before showing next component
        setTimeout(() => {
          setShowNextComponent(true);
        }, 500);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [videoEnded]);

  // Art Deco frame animation variants
  const frameVariants = {
    hidden: {
      opacity: 0,
      scale: 0.85,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="loading-state-container">
      {/* Video Animation */}
      <AnimatePresence>
        {!videoEnded && (
          <motion.div
            key="video"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="loading-state"
          >
            <video
              autoPlay
              muted
              playsInline
              onEnded={() => setVideoEnded(true)}
              style={{ width: "100%", height: "100%" }}
            >
              <source src={videoSource} type="video/mp4" />
            </video>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Art Deco Frame Animation */}
      <AnimatePresence>
        {showArtDeco && (
          <motion.div
            key="art-deco-frame"
            variants={frameVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="art-deco-container"
          >
            <div className="archive-hexcellence-logo-container">
             <img src={archiveHexcellenceLogo} alt="Archive Hexcellence" className="archive-hexcellence-logo" />
            </div>
            
            {/* Navigation indicators */}
            <div className="navigation-footer">
              <div className="lotus-icon">⚜</div>
              <div className="nav-links">
                <span>FUn</span>
                <span>RESOURCES</span>
                <span>VIBES & CO</span>
              </div>
              <div className="user-icon">👤</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Component */}
      <AnimatePresence>
        {showNextComponent && (
          <motion.div
            key="next-component"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Step3Animation />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoadingState;