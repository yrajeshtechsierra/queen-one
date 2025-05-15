import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../assets/css/loadingState.css";
import videoSource from "../../assets/videos/technology_videos.mp4";

const LoadingState = () => {
  const [videoEnded, setVideoEnded] = useState(false);

  return (
    <div className="loading-state-container">
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

      <AnimatePresence>
        {videoEnded && (
          <motion.div
            key="slider"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="slider"
          >
            <h2>🎉 Welcome to the Slider!</h2>
            <p>This content is shown after the video ends.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoadingState;
