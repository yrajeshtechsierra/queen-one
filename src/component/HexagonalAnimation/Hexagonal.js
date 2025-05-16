import React, { useRef, useState, useEffect } from "react";
import HexagonalImage from "../../assets/images/hexagonal.png";

const Hexagonal = () => {
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
    if (!isDraggingRef.current) return;
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
    isDraggingRef.current = true;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e) => {
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
            cursor: "pointer",
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
            fill="#FFD700"
            style={{ cursor: "grab" }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          />
        </svg>
      </div>
    </div>
  );
};

export default Hexagonal;
