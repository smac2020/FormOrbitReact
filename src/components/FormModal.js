import React from "react";

const FormModal = ({ form, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#0d0d1f", // dark modal background
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          flexShrink: 0,
          padding: "1rem 2rem",
          backgroundColor: "#111133",
          color: "#9effff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.7)",
          zIndex: 10001,
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1.5rem" }}>{form.title}</h3>
        <button
          onClick={onClose}
          aria-label="Close form"
          style={{
            fontSize: "2rem",
            color: "#9effff",
            background: "none",
            border: "none",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          &times;
        </button>
      </div>

      {/* Iframe container */}
      <div
        style={{
          flexGrow: 1,
          backgroundColor: "#0d0d1f", // dark background behind iframe
          boxShadow: "inset 0 0 50px #3f3fff44",
        }}
      >
        <iframe
          title={form.title}
          src={`/forms/${form.id}.html`}
          style={{
            border: "none",
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      </div>
    </div>
  );
};

export default FormModal;




