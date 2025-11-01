import React, { useState, useEffect } from "react";

function TemplateManager() {
  const [templates, setTemplates] = useState([]); // dynamic instead of hardcoded
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [typedText, setTypedText] = useState("");

  const helpText = `Template Manager Help:

This component lets you view and manage all your form templates.
Click on a table row to see details in the card below.

You can activate a template, translate it to other languages, or see more details about it.
Use the help icon at the top right for guidance at any time.
`;

// Add this function inside your TemplateManager component
const editTemplate = (template) => {
  const username = "scottm"; // TODO: replace with logged-in user
  const templateName = template.name;

  fetch(`https://localhost:8443/api/formorbit/edittemplate?username=${username}&templateName=${encodeURIComponent(templateName)}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch template for editing");
      }
      return res.text(); // or res.json() if your backend returns JSON
    })
    .then((data) => {
      // For now, just show an alert with response
      alert(`Edit template response: ${data}`);
      // TODO: load template JSON into Form Designer
    })
    .catch((err) => {
      console.error("Error editing template:", err);
      alert(`Error fetching template: ${err.message}`);
    });
};


  // Fetch templates from backend
  useEffect(() => {
    const username = "scottm"; // TODO: later replace with logged-in user
    fetch(`https://localhost:8443/api/formorbit/all?username=${username}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch templates");
        }
        return res.json();
      })
      .then((data) => {
        // data should be [{ name: "Template1" }, { name: "Template2" }]
        const mappedTemplates = data.map((t, index) => ({
          id: index + 1,
          name: t.name,
          created: new Date().toISOString().split("T")[0], // placeholder
          status: "Active", // placeholder, adjust if backend adds more fields
          description: "Template description goes here.", // placeholder
        }));
        setTemplates(mappedTemplates);
      })
      .catch((err) => {
        console.error("Error fetching templates:", err);
      });
  }, []);

  // Handle typing effect for Help
  useEffect(() => {
    if (helpOpen) {
      let i = 0;
      setTypedText("");
      const interval = setInterval(() => {
        if (i < helpText.length) {
          setTypedText((prev) => prev + helpText.charAt(i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 25);
      return () => clearInterval(interval);
    }
  }, [helpOpen]);

  const handleRowClick = (template) => {
    setSelectedTemplate(template);
  };

  return (
    <div
      style={{
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: "#1a1a2e",
        color: "#f5f5f5",
        padding: "2rem",
        height: "100vh",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Help Icon */}
      <div
        onClick={() => setHelpOpen(true)}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          fontSize: "1.5rem",
          cursor: "pointer",
          color: "#00ffff",
        }}
      >
        ❓
      </div>

      <h2
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          color: "#00ffff",
        }}
      >
        Template Manager
      </h2>

      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "1.5rem",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#0f0f1f", color: "#00ffea" }}>
            <th
              style={{ padding: "0.75rem", borderBottom: "1px solid #00ffea" }}
            >
              Name
            </th>
            <th
              style={{ padding: "0.75rem", borderBottom: "1px solid #00ffea" }}
            >
              Created
            </th>
            <th
              style={{ padding: "0.75rem", borderBottom: "1px solid #00ffea" }}
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {templates.length > 0 ? (
            templates.map((template) => (
              <tr
                key={template.id}
                onClick={() => handleRowClick(template)}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedTemplate?.id === template.id
                      ? "#222244"
                      : "transparent",
                  transition: "background-color 0.3s",
                }}
              >
                <td
                  style={{ padding: "0.75rem", borderBottom: "1px solid #333" }}
                >
                  {template.name}
                </td>
                <td
                  style={{ padding: "0.75rem", borderBottom: "1px solid #333" }}
                >
                  {template.created}
                </td>
                <td
                  style={{ padding: "0.75rem", borderBottom: "1px solid #333" }}
                >
                  {template.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "1rem" }}>
                No templates found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Card Panel */}
      {selectedTemplate && (
        <div
          style={{
            backgroundColor: "#0f0f1f",
            padding: "1rem",
            borderRadius: "0.5rem",
            boxShadow: "0 0 20px #00ffff",
            maxHeight: "40vh",
            overflowY: "auto",
            fontSize: "1rem",
          }}
        >
          <h3
            style={{
              color: "#00ffff",
              marginBottom: "0.75rem",
              fontSize: "1.25rem",
            }}
          >
            {selectedTemplate.name}
          </h3>
          <p style={{ fontSize: "1rem" }}>{selectedTemplate.description}</p>
          <p style={{ fontSize: "1rem" }}>
            <strong>Created:</strong> {selectedTemplate.created}
          </p>
          <p style={{ fontSize: "1rem" }}>
            <strong>Status:</strong> {selectedTemplate.status}
          </p>
          <div style={{ marginTop: "1rem" }}>
            <button
              style={{
                backgroundColor: "#00ffea",
                color: "#1a1a2e",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "0.25rem",
                marginRight: "0.5rem",
                cursor: "pointer",
                fontSize: "1rem",
              }}
              onClick={() => editTemplate(selectedTemplate)} // <-- call placeholder method
            >
              Edit
            </button>
            <button
              style={{
                backgroundColor: "#ff00ff",
                color: "#1a1a2e",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "0.25rem",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Translate
            </button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {helpOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setHelpOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#0f0f1f",
              padding: "2rem",
              borderRadius: "0.5rem",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "70vh",
              overflowY: "auto",
              color: "#ffffff",
              fontFamily: "'Roboto Mono', monospace",
              boxShadow: "0 0 30px #00ffea",
              lineHeight: "1.5",
              fontSize: "1.1rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <pre style={{ whiteSpace: "pre-wrap" }}>{typedText}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default TemplateManager;
