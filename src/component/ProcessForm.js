import { useState } from 'react';
import "../assets/css/ProcessForm.css"

export default function ProcessForm() {
    const [dimensions, setDimensions] = useState({
      width: typeof window !== "undefined" ? window.innerWidth : 0,
      height: typeof window !== "undefined" ? window.innerHeight : 0,
    });

    const getResponsiveSize = (baseSize) => {
    const screenWidth = dimensions.width;
    if (screenWidth < 480) return baseSize * 0.6; // Mobile
    if (screenWidth < 768) return baseSize * 0.8; // Tablet
    return baseSize; // Desktop
  };
  
  return (
   <>
    <div style={{ marginBottom: "20px" }}>
            <svg
              viewBox="0 0 50 20"
              width="50"
              height="20"
              style={{ margin: "0 auto 16px" }}
            >
              <polygon
                points="25,0 35,10 30,10 40,20 10,20 20,10 15,10"
                fill="#000"
              />
            </svg>
            <h2
              style={{
                fontSize: getResponsiveSize(24),
                fontWeight: "600",
                margin: "0 0 24px",
               
              }}
            >
              Enjoy Your Process
            </h2>
          </div>

          <input
            type="text"
            value=""
            placeholder="Enter your email"
            className="process-form-email-input"
            style={{
              padding: "12px 16px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              marginBottom: "16px",
              fontSize: getResponsiveSize(16),
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "24px",
              flexDirection: dimensions.width < 480 ? "column" : "row",
            }}
          >
            <input
              type="text"
              placeholder="Enter your name"
              className="process-form-name-input"
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                fontSize: getResponsiveSize(16),
              }}
            />
            <input
              type="text"
              placeholder=""
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                fontSize: getResponsiveSize(16),
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: "500",
                  fontSize: getResponsiveSize(16),
                }}
              >
                Revenue Bucket
              </p>
              <span
                style={{
                  fontSize: getResponsiveSize(14),
                  color: "rgba(0, 0, 0, 0.6)",
                }}
              >
                See 3 More ▼
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  dimensions.width < 480 ? "1fr" : "1fr 1fr 1fr",
                gap: "8px",
              }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    padding: "12px",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    borderRadius: "4px",
                    fontSize: getResponsiveSize(14),
                  }}
                >
                  $000 - $000
                </div>
              ))}
            </div>
          </div>

          <button
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: "#F1FFAD",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: getResponsiveSize(16),
              cursor: "pointer",
              transition: "background-color 0.2s",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            SUBMIT TO HEXCELLENCE
          </button>
          </>
  );
}
