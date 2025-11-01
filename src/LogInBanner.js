import React from "react";

const LogInBanner = () => {
  const bannerStyle = {
  backgroundColor: "#1f2937",
  color: "#e0e7ff",
  padding: "1rem 1.5rem",
  fontSize: "1.1rem",
  fontWeight: "600",
  textAlign: "center",
  borderTop: "2px solid #3b82f6",
  borderBottom: "2px solid #3b82f6",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  userSelect: "none",
  maxWidth: "100%",
  boxSizing: "border-box",
};

  return (
    <div style={bannerStyle} role="banner" aria-live="polite">
      Log in to view, create, and manage your smart mobile forms — your mission control awaits.
    </div>
  );
};

export default LogInBanner;
