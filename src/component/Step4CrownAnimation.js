import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import ProcessForm from "./ProcessForm";

const Step4CrownAnimation = () => {
  // Animation states
  const [showPillow, setShowPillow] = useState(false);
  const [showCrown, setShowCrown] = useState(false);
  const [showJewel, setShowJewel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [hideElements, setHideElements] = useState(false);
  const [jewelEnlarged, setJewelEnlarged] = useState(false);

  // Crown center position for jewel placement detection
  const crownRef = useRef(null);
  const jewelRef = useRef(null);
  const containerRef = useRef(null);

  // Position values for the draggable jewel
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Get viewport dimensions for responsive calculations
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1366,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  // Update dimensions on resize and initial load
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial dimensions
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set up sequential animations
  useEffect(() => {
    // Show pillow after 2 seconds
    const pillowTimer = setTimeout(() => {
      setShowPillow(true);
    }, 2000);

    // Clean up timer
    return () => clearTimeout(pillowTimer);
  }, []);

  // Show crown after pillow appears
  useEffect(() => {
    if (showPillow) {
      const crownTimer = setTimeout(() => {
        setShowCrown(true);
      }, 2000);

      return () => clearTimeout(crownTimer);
    }
  }, [showPillow]);

  // Show jewel after crown appears
  useEffect(() => {
    if (showCrown) {
      const jewelTimer = setTimeout(() => {
        setShowJewel(true);
      }, 2000);

      return () => clearTimeout(jewelTimer);
    }
  }, [showCrown]);

  // Reset jewel position on screen resize
  useEffect(() => {
    if (showJewel && !hideElements) {
      // Reset jewel position to bottom right corner on resize
      x.set(dimensions.width * 0.3);
      y.set(dimensions.height * 0.3);
    }
  }, [dimensions, showJewel, hideElements, x, y]);

  // Check if jewel is placed in crown hole
  const checkJewelPlacement = () => {
    if (!crownRef.current || !containerRef.current || !jewelRef.current) return;

    // Get crown and jewel positions relative to container
    const containerRect = containerRef.current.getBoundingClientRect();
    const crownRect = crownRef.current.getBoundingClientRect();
    const jewelRect = jewelRef.current.getBoundingClientRect();

    // Calculate crown center position (the empty space where jewel should go)
    const crownCenterX = crownRect.left + crownRect.width / 2;
    const crownCenterY = crownRect.top + crownRect.height * 0.35; // Adjust to target the center hole

    // Calculate jewel center position
    const jewelCenterX = jewelRect.left + jewelRect.width / 2;
    const jewelCenterY = jewelRect.top + jewelRect.height / 2;

    // Calculate distance between jewel and crown hole
    const distance = Math.sqrt(
      Math.pow(jewelCenterX - crownCenterX, 2) +
        Math.pow(jewelCenterY - crownCenterY, 2)
    );

    // Calculate proximity thresholds based on viewport size
    const viewportSmallestDimension = Math.min(
      dimensions.width,
      dimensions.height
    );
    const proximityThreshold = viewportSmallestDimension * 0.15; // For enlarging jewel
    const placementThreshold = viewportSmallestDimension * 0.06; // For accepting placement

    // If jewel is within proximity, enlarge it
    if (distance < proximityThreshold) {
      setJewelEnlarged(true);
    } else {
      setJewelEnlarged(false);
    }

    // If jewel is close enough to hole, trigger transition to form
    if (distance < placementThreshold) {
      // Snap jewel to center of crown
      x.set(crownCenterX - containerRect.left - jewelRect.width / 2);
      y.set(crownCenterY - containerRect.top - jewelRect.height / 2);

      setHideElements(true);

      // After elements are hidden, show the form
      setTimeout(() => {
        setShowForm(true);
      }, 500);
    }
  };

  // Calculate responsive sizes based on viewport
  const getResponsiveSize = (baseValue, dimension = "width") => {
    const baseScreen = dimension === "width" ? 1366 : 768; // Base screen dimensions (13" MacBook)
    const currentDimension = dimensions[dimension];
    const scaleFactor = currentDimension / baseScreen;

    // Apply different scaling for different screen sizes
    if (currentDimension < 480) return baseValue * Math.min(scaleFactor, 0.6); // Mobile
    if (currentDimension < 768) return baseValue * Math.min(scaleFactor, 0.75); // Small tablets
    if (currentDimension < 1024) return baseValue * Math.min(scaleFactor, 0.85); // Large tablets
    if (currentDimension > 1920) return baseValue * Math.min(scaleFactor, 1.2); // Large desktop

    return baseValue * scaleFactor; // Standard scaling
  };

  // Get jewel size based on screen and state
  const getJewelSize = () => {
    const baseSize = dimensions.width * 0.05;
    const enlargedMultiplier = jewelEnlarged ? 1.4 : 1;

    // Size adjustments for different screens
    if (dimensions.width < 480) {
      return getResponsiveSize(baseSize * 1.2) * enlargedMultiplier; // Slightly larger on mobile for easier handling
    }

    return getResponsiveSize(baseSize) * enlargedMultiplier;
  };

  // Calculate jewel starting position
  const getJewelPosition = (axis) => {
    if (axis === "x") {
      if (dimensions.width < 480) {
        return dimensions.width * 0.4; 
      } else if (dimensions.width < 768) {
        return dimensions.width * 0.25; 
      } else {
        return dimensions.width * 0.4; 
      }
    } else {
      if (dimensions.height < 700) {
        return dimensions.height * 0.2; 
      }  else {
        return dimensions.height * 0.3; 
      }
    }
  };

  // Update the jewel's initial position when it first appears
  useEffect(() => {
    if (showJewel && !hideElements) {
      x.set(getJewelPosition("x"));
      y.set(getJewelPosition("y"));
    }
  }, [showJewel, hideElements, dimensions]);

  // Replace the existing getJewelStartPosition function with our new one
  // or update it to use the responsive calculation
  const getJewelStartPosition = (axis) => {
    return getJewelPosition(axis);
  };

  // Get drag constraints based on container size
  const getDragConstraints = () => {
    return {
      left: -dimensions.width * 0.45,
      right: dimensions.width * 0.45,
      top: -dimensions.height * 0.45,
      bottom: dimensions.height * 0.45,
    };
  };

  console.log("dimensions.height", dimensions.height);

  return (
    <div
      ref={containerRef}
      style={{
        backgroundImage: `url(${require("../assets/images/step3CrownAnimationBg.png")})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <AnimatePresence>
        {/* Pillow Animation */}
        {showPillow && !hideElements && (
          <motion.img
            src={require("../assets/images/royalCrownPillow.png")}
            alt="Royal Pillow"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              //   left: "12%",
              top: `${dimensions.height < 700 ? 45 : 25}vh`,
              transform: "translate(-50%, -50%)",
              alignSelf: "center",
              width: getResponsiveSize(dimensions.width * 0.6),
              height: "auto",
              objectFit: "contain",
              maxWidth: "90%",
              minWidth: "300px",
            }}
          />
        )}
        {/* Crown Animation */}
        {showCrown && !hideElements && (
          <motion.img
            ref={crownRef}
            src={require("../assets/images/crownImg.png")}
            alt="Crown"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              top: `${dimensions.height < 700 ? 38 : 5}vh`,
              transform: "translate(-50%, -50%)",
              alignSelf: "center",
              width: getResponsiveSize(dimensions.width * 0.4),
              height: "auto",
              objectFit: "contain",
              maxWidth: "70%",
              zIndex: 2,
              minWidth: "200px",
            }}
          />
        )}

        {/* Draggable Jewel */}
        {showJewel && !hideElements && (
          <motion.div
            ref={jewelRef}
            drag
            dragConstraints={getDragConstraints()}
            dragElastic={0.1}
            initial={{
              opacity: 0,
              scale: 0.5,
              x: getJewelPosition("x"),
              y: getJewelPosition("y"),
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              cursor: "grab",
              x,
              y,
              zIndex: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onDrag={checkJewelPlacement}
            onDragEnd={checkJewelPlacement}
            whileDrag={{ cursor: "grabbing" }}
          >
            <img
              src={require("../assets/images/jewelImg.png")}
              alt="Jewel"
              style={{
                width: `${getJewelSize()}px`,
                height: "auto",
                pointerEvents: "none",
                minWidth: "30px",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form that appears after jewel placement */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "8px",
            padding: `${getResponsiveSize(24, "height")}px`,
            width: `${getResponsiveSize(
              Math.min(480, dimensions.width * 0.9)
            )}px`,
            minWidth: "280px",
            maxWidth: "95%",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            textAlign: "center",
            zIndex: 20,
          }}
        >
          <ProcessForm />
        </motion.div>
      )}
    </div>
  );
};

export default Step4CrownAnimation;
