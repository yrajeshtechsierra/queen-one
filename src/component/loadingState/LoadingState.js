import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../assets/css/loadingState.css";
import videoSource from "../../assets/videos/technology_videos.mp4";
import archiveHexcellenceLogo from "../../assets/images/archiveHexcellenceborderLogo.png";
import HexagonalImage from "../../assets/images/hexagonal.png";
import Step4CrownAnimation from "../Step4CrownAnimation";

const LoadingState = () => {
  const [videoEnded, setVideoEnded] = useState(false);
  const [showArtDeco, setShowArtDeco] = useState(false);
  const [showHexagonal, setShowHexagonal] = useState(false);
  const [hexagonalComplete, setHexagonalComplete] = useState(false);
  const [showNextComponent, setShowNextComponent] = useState(false);
  
  // Handle video end and trigger art deco animation
  useEffect(() => {
    if (videoEnded) {
      setShowArtDeco(true);
      
      // After 5 seconds (3s for zoom animation + 2s full display), transition to hexagonal
      const timer = setTimeout(() => {
        setShowArtDeco(false);
        
        // Wait for fade out animation to complete before showing hexagonal component
        setTimeout(() => {
          setShowHexagonal(true);
        }, 500);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [videoEnded]);

  // Handle hexagonal completion
  useEffect(() => {
    if (hexagonalComplete) {
      setShowHexagonal(false);
      
      // Wait for fade out animation to complete before showing next component
      setTimeout(() => {
        setShowNextComponent(true);
      }, 500);
    }
  }, [hexagonalComplete]);

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
                <span>FUN</span>
                <span>RESOURCES</span>
                <span>VIBES & CO</span>
              </div>
              <div className="user-icon">👤</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hexagonal Component */}
      <AnimatePresence>
        {showHexagonal && (
          <motion.div
            key="hexagonal-component"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ModifiedHexagonal onComplete={() => setHexagonalComplete(true)} />
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
            className="next-component"
          >
          <Step4CrownAnimation/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Modified Hexagonal component that includes completion detection
const ModifiedHexagonal = ({ onComplete }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  
  // This is the wrapper component that adds the completion functionality
  // to the original Hexagonal component
  
  useEffect(() => {
    // If progress reaches 100%, trigger the completion callback
    if (progressPercent >= 100 && !isCompleted) {
      setIsCompleted(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000); // Add a short delay before moving to next component
    }
  }, [progressPercent, isCompleted, onComplete]);

  return (
    <>
      <HexagonalWithProgress 
        onProgressChange={setProgressPercent} 
        isCompleted={isCompleted}
      />
      
      {/* Optional completion indicator */}
      {isCompleted && (
        <div className="completion-message">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0,0,0,0.7)",
              color: "#FFD700",
              padding: "1rem 2rem",
              borderRadius: "8px",
              fontSize: "1.5rem",
              zIndex: 10
            }}
          >
            Complete!
          </motion.div>
        </div>
      )}
    </>
  );
};

// This component extends the original Hexagonal with progress tracking
const HexagonalWithProgress = ({ onProgressChange, isCompleted }) => {
  const hexPoints = React.useMemo(
    () => [
      { x: 15, y: 130 },
      { x: 75, y: 15 },
      { x: 225, y: 15 },
      { x: 285, y: 130 },
      { x: 225, y: 245 },
      { x: 75, y: 245 },
      { x: 15, y: 130 },
    ],
    []
  );

  const [state, setState] = useState({
    discPosition: { x: 15, y: 130 },
    currentEdgeIndex: 0,
    edgeProgress: 0,
  });

  const svgRef = useRef(null);
  const discRef = useRef(null);
  const progressPathRef = useRef(null);
  const isDraggingRef = useRef(false);
  const edgeIndexRef = useRef(0);

  // Calculate the total hexagon perimeter
  const totalPerimeter = React.useMemo(() => {
    let perimeter = 0;
    for (let i = 0; i < hexPoints.length - 1; i++) {
      const p1 = hexPoints[i];
      const p2 = hexPoints[i + 1];
      perimeter += Math.hypot(p2.x - p1.x, p2.y - p1.y);
    }
    return perimeter;
  }, [hexPoints]);

  // Calculate current progress along the hexagon
  useEffect(() => {
    let coveredDistance = 0;
    for (let i = 0; i < state.currentEdgeIndex; i++) {
      const p1 = hexPoints[i];
      const p2 = hexPoints[i + 1];
      coveredDistance += Math.hypot(p2.x - p1.x, p2.y - p1.y);
    }
    
    const currentEdgeStart = hexPoints[state.currentEdgeIndex];
    const currentEdgeEnd = hexPoints[state.currentEdgeIndex + 1];
    const currentEdgeLength = Math.hypot(
      currentEdgeEnd.x - currentEdgeStart.x,
      currentEdgeEnd.y - currentEdgeStart.y
    );
    
    coveredDistance += currentEdgeLength * state.edgeProgress;
    const progressPercent = (coveredDistance / totalPerimeter) * 100;
    
    onProgressChange(progressPercent);
    
    // Auto-complete if reached the end or near the end
    if (
      state.currentEdgeIndex === hexPoints.length - 2 && 
      state.edgeProgress > 0.95
    ) {
      onProgressChange(100);
    }
  }, [state, hexPoints, totalPerimeter, onProgressChange]);

  const getPointOnEdge = (p1, p2, t) => ({
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
  });

  const getMouseOrTouchPosition = (e) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    let clientX, clientY;

    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const updateProgressPath = React.useCallback(
    (edgeIndex, progress) => {
      const start = hexPoints[edgeIndex];
      const end = hexPoints[edgeIndex + 1];
      const point = getPointOnEdge(start, end, progress);

      let d = `M ${hexPoints[0].x} ${hexPoints[0].y}`;
      for (let i = 1; i <= edgeIndex; i++) {
        d += ` L ${hexPoints[i].x} ${hexPoints[i].y}`;
      }
      d += ` L ${point.x} ${point.y}`;

      if (progressPathRef.current) {
        progressPathRef.current.setAttribute("d", d);
      }

      if (discRef.current) {
        discRef.current.setAttribute("cx", point.x.toFixed(2));
        discRef.current.setAttribute("cy", point.y.toFixed(2));
      }
    },
    [hexPoints]
  );

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || isCompleted) return;
    const mouse = getMouseOrTouchPosition(e);
    if (!mouse) return;

    let edgeIndex = edgeIndexRef.current;
    let start = hexPoints[edgeIndex];
    let end = hexPoints[edgeIndex + 1];

    for (let tries = 0; tries < 10; tries++) {
      const edgeVec = { x: end.x - start.x, y: end.y - start.y };
      const toMouse = { x: mouse.x - start.x, y: mouse.y - start.y };
      const edgeLength = Math.hypot(edgeVec.x, edgeVec.y);
      const projectedLength =
        (toMouse.x * edgeVec.x + toMouse.y * edgeVec.y) / edgeLength;
      let t = projectedLength / edgeLength;

      if (t >= 0 && t <= 1) {
        edgeIndexRef.current = edgeIndex;
        updateProgressPath(edgeIndex, t);
        return;
      } else if (t > 1 && edgeIndex < hexPoints.length - 2) {
        edgeIndex++;
        start = hexPoints[edgeIndex];
        end = hexPoints[edgeIndex + 1];
      } else if (t < 0 && edgeIndex > 0) {
        edgeIndex--;
        start = hexPoints[edgeIndex];
        end = hexPoints[edgeIndex + 1];
      } else {
        return;
      }
    }
  };

  const handleMouseDown = () => {
    if (isCompleted) return;
    isDraggingRef.current = true;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e) => {
    if (isCompleted) return;
    e.preventDefault();
    isDraggingRef.current = true;
    window.addEventListener("touchmove", handleMouseMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
  };

  const handleTouchEnd = () => {
    handleMouseUp();
    window.removeEventListener("touchmove", handleMouseMove);
    window.removeEventListener("touchend", handleTouchEnd);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);

    const edgeIndex = edgeIndexRef.current;
    const start = hexPoints[edgeIndex];
    const end = hexPoints[edgeIndex + 1];
    const cx = parseFloat(discRef.current.getAttribute("cx"));
    const cy = parseFloat(discRef.current.getAttribute("cy"));

    const edgeVec = { x: end.x - start.x, y: end.y - start.y };
    const toDisc = { x: cx - start.x, y: cy - start.y };
    const edgeLength = Math.hypot(edgeVec.x, edgeVec.y);
    const projectedLength =
      (toDisc.x * edgeVec.x + toDisc.y * edgeVec.y) / edgeLength;
    const t = projectedLength / edgeLength;

    setState({
      discPosition: { x: cx, y: cy },
      currentEdgeIndex: edgeIndex,
      edgeProgress: t,
    });
  };

  useEffect(() => {
    edgeIndexRef.current = state.currentEdgeIndex;
    updateProgressPath(state.currentEdgeIndex, state.edgeProgress);
  }, [state, updateProgressPath]);

  return (
    <div
      style={{
        width: "100%",
        height: "100dvh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${HexagonalImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "300px",
          aspectRatio: "300 / 260",
          position: "relative",
          clipPath:
            "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          backgroundColor: "white",
          fontWeight: "bold",
          fontSize: "clamp(1.5rem, 6vw, 2.5rem)",
          color: "#D4AF37",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        GET
        <br />
        HEXY
        <svg
          ref={svgRef}
          viewBox="0 0 300 260"
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            cursor: isCompleted ? "default" : "pointer",
          }}
        >
          <path
            d="M15 130 L75 15 L225 15 L285 130 L225 245 L75 245 Z"
            fill="none"
            stroke="#808080"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            ref={progressPathRef}
            d=""
            fill="none"
            stroke="#FFD700"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            ref={discRef}
            cx={state.discPosition.x}
            cy={state.discPosition.y}
            r="10"
            fill={isCompleted ? "#00FF00" : "#FFD700"}
            style={{ cursor: isCompleted ? "default" : "grab" }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          />
        </svg>
      </div>
    </div>
  );
};

export default LoadingState;
