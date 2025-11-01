import React, { useState, useEffect } from "react";

// Recursive Form Tree Component
const FormTree = ({ node, values, setValues }) => {
  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const labelStyle = {
    color: "#a0c8ff",
    fontSize: "1.125rem",
    marginBottom: "0.5rem",
    display: "block",
  };
  const inputStyle = {
    backgroundColor: "#0f111a",
    border: "1.5px solid #1e40af",
    color: "#a0c8ff",
    borderRadius: "8px",
    padding: "6px 10px",
    marginTop: "4px",
    fontSize: "1rem",
    outline: "none",
    width: "100%",
  };

  switch (node.type) {
    case "FormElement":
      return (
        <div style={{ marginTop: "1.5rem" }}>
          <h3
            style={{
              color: "#66aaff",
              fontSize: "1.25rem",
              marginBottom: "0.75rem",
            }}
          >
            {node.formName}
          </h3>
          {node.formSubtitle && (
            <p style={{ color: "#a0c8ff", marginBottom: "1rem" }}>
              {node.formSubtitle}
            </p>
          )}
        </div>
      );

    case "TextInput":
      return (
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>{node.label}</label>
          <input
            type="text"
            value={values[node.id] || ""}
            onChange={(e) => handleChange(node.id, e.target.value)}
            style={inputStyle}
          />
        </div>
      );

    case "TextArea":
      return (
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>{node.label}</label>
          <textarea
            value={values[node.id] || ""}
            onChange={(e) => handleChange(node.id, e.target.value)}
            style={{ ...inputStyle, height: "80px", resize: "vertical" }}
          />
        </div>
      );

    case "DropDown":
      return (
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>{node.label}</label>
          <select
            value={values[node.id] || "Select"}
            onChange={(e) => handleChange(node.id, e.target.value)}
            style={inputStyle}
          >
            {node.options.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );

    case "Slider":
      return (
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>
            {node.label}: {values[node.id] || node.defaultValue}
          </label>
          <input
            type="range"
            min={node.min}
            max={node.max}
            step={node.step}
            value={values[node.id] || node.defaultValue}
            onChange={(e) => handleChange(node.id, Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
      );

    default:
      return (
        <div style={{ color: "#ff4d4d" }}>
          Unsupported node type: {node.type}
        </div>
      );
  }
};

// Utility: Generate GUID
const generateGuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const VisualFormTree = () => {
  const [formValues, setFormValues] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState("");
  const [formNames, setFormNames] = useState([]);
  const [formDefinition, setFormDefinition] = useState([]); // 🔹 dynamic form JSON
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpText, setHelpText] = useState("");
  const [submissionDetails, setSubmissionDetails] = useState(null); // 🔹 store fetched details

  const fullHelpText = `This component displays a dynamic form tree on the left side where you can interact with the form structure.
The right panel shows recent submission records. Use the 'Filter Submissions' button to submit form values.
Clicking on a submission and pressing 'View' opens the submission details in the side drawer.`;

  // Fetch dynamic form names
  useEffect(() => {
    const fetchFormNames = async () => {
      try {
        const response = await fetch("https://localhost:8443/api/formorbit/subs");
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();
        setFormNames(data);
      } catch (err) {
        console.error("Failed to fetch form names:", err);
      }
    };
    fetchFormNames();
  }, []);

  // Typewriter help text
  useEffect(() => {
    if (helpOpen) {
      let i = 0;
      setHelpText("");
      const interval = setInterval(() => {
        setHelpText((prev) => prev + fullHelpText[i]);
        i++;
        if (i >= fullHelpText.length) clearInterval(interval);
      }, 20);
      return () => clearInterval(interval);
    }
  }, [helpOpen]);

  // 🔹 Handle dropdown selection and fetch template JSON
  const handleFormChange = async (event) => {
    const formName = event.target.value;
    setSelectedForm(formName);

    if (!formName) return;

    try {
      const response = await fetch(
        `https://localhost:8443/api/formorbit/form?formName=${encodeURIComponent(formName)}`
      );
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();

      setFormDefinition(data);
      alert(`Loaded form: ${formName}`);
    } catch (err) {
      console.error("Failed to fetch form JSON:", err);
      alert(`Error loading form: ${err.message}`);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Form values before submit:", formValues);

      const payloadToSend = {
        templateName: selectedForm || "",
        ...formValues,
      };

      const response = await fetch("https://localhost:8443/api/formorbit/drill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadToSend),
      });

      if (!response.ok) throw new Error(`Server responded with ${response.status}`);

      let payload;
      const rawText = await response.text();
      try {
        payload = JSON.parse(rawText);
      } catch {
        payload = rawText;
      }

      let ids = [];
      if (Array.isArray(payload)) ids = payload;
      else if (payload && Array.isArray(payload.matchingSubmissionIds))
        ids = payload.matchingSubmissionIds;
      else if (typeof payload === "string" && payload.trim()) ids = [payload.trim()];

      const nowISODate = new Date().toISOString().slice(0, 10);
      setSubmissions(ids.map((id) => ({ submissionId: id, submittedAt: nowISODate })));

      console.log("Server response (parsed):", payload);
      const pretty =
        typeof payload === "object" ? JSON.stringify(payload) : String(payload);
      alert(`Submit complete: ${pretty}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error submitting form: ${error.message}`);
    }
  };

  const handleClear = () => {
    setFormValues({});
    setSubmissions([]);
  };

  const handleRowClick = (sub) => setSelectedSubmission(sub);

  const handleViewClick = async () => {
    if (selectedSubmission) {
      try {
        const response = await fetch(
          `https://localhost:8443/api/formorbit/${selectedSubmission.submissionId}`
        );
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();
        setSubmissionDetails(data);
        setDrawerOpen(true);
      } catch (err) {
        console.error("Failed to fetch submission details:", err);
        alert(`Error loading submission details: ${err.message}`);
      }
    }
  };

  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "auto",
        padding: "2rem",
        color: "#a0c8ff",
        backgroundColor: "#0a0c17",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "relative",
      }}
    >
      {/* Top section */}
      <section
        style={{
          backgroundColor: "#0f111a",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "2rem",
          boxShadow: "0 0 4px #4f83cc33, 0 0 8px #1e40af33",
          border: "1.5px solid #1e40af",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            color: "#66aaff",
            textShadow: "0 0 2px #66aaff88",
            fontSize: "2rem",
            marginBottom: 0,
          }}
        >
          Dynamic Form Tree
        </h2>
        <span
          onClick={() => setHelpOpen(true)}
          style={{
            cursor: "pointer",
            color: "#ff4d4d",
            fontWeight: "bold",
            fontSize: "3rem",
            textShadow: "0 0 4px #ff4d4d, 0 0 8px #ff4d4d88",
            userSelect: "none",
          }}
          title="Click for help"
        >
          ?
        </span>
      </section>

      {/* Two Panel Layout */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr",
          gap: "2rem",
        }}
      >
        {/* Left Panel */}
        <div
          style={{
            backgroundColor: "#0f111a",
            borderRadius: "1rem",
            padding: "1.5rem",
            border: "1.5px solid #1e40af",
            boxShadow: "0 0 4px #4f83cc33, 0 0 8px #1e40af33",
          }}
        >
          {/* Dropdown */}
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                color: "#a0c8ff",
                fontSize: "1.125rem",
                marginBottom: "0.5rem",
                display: "block",
              }}
            >
              Form Submissions
            </label>
            <select
              style={{
                backgroundColor: "#0f111a",
                border: "1.5px solid #1e40af",
                color: "#a0c8ff",
                borderRadius: "8px",
                padding: "6px 10px",
                fontSize: "1rem",
                outline: "none",
                width: "100%",
              }}
              value={selectedForm}
              onChange={handleFormChange}
            >
              <option value="" disabled>
                -- Select Forms --
              </option>
              {formNames.map((name, idx) => (
                <option key={idx} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Form Tree */}
          {formDefinition.map((node, index) => (
            <FormTree
              key={index}
              node={node}
              values={formValues}
              setValues={setFormValues}
            />
          ))}

          {/* Selected Form Fields */}
          {Object.keys(formValues).length > 0 && (
            <div
              style={{
                backgroundColor: "#11122a",
                border: "1px solid #00fff744",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                marginBottom: "1rem",
                color: "#f5f8f8ff",
                fontFamily: "monospace",
                fontSize: "1rem",
                maxHeight: "150px",
                overflowY: "auto",
              }}
            >
              <strong
                style={{
                  color: "#00fff7",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                Selected Fields:
              </strong>
              {Object.entries(formValues).map(([key, value]) => (
                <div key={key} style={{ marginBottom: "0.25rem" }}>
                  <span style={{ color: "#66aaff" }}>{key}:</span>{" "}
                  <span>
                    {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Buttons */}
          <button
            onClick={handleClear}
            style={{
              backgroundColor: "#ff4d4d",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              marginBottom: "0.75rem",
              fontSize: "1rem",
              width: "100%",
              boxShadow: "0 0 4px #ff4d4d33",
            }}
          >
            Clear Data
          </button>

          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: "#1e40af",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              marginTop: "1.5rem",
              fontSize: "1rem",
              width: "100%",
              boxShadow: "0 0 4px #1e40af33",
            }}
          >
            Filter Submissions
          </button>
        </div>

        {/* Right Panel */}
        <div
          style={{
            backgroundColor: "#0f111a",
            borderRadius: "1rem",
            padding: "1.5rem",
            border: "1.5px solid #1e40af",
            boxShadow: "0 0 4px #4f83cc33, 0 0 8px #1e40af33",
          }}
        >
          <h3 style={{ color: "#66aaff", marginBottom: "1rem" }}>
            Recent Submissions
          </h3>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "0.5rem",
                      borderBottom: "1px solid #1e40af",
                    }}
                  >
                    Submission ID
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "0.5rem",
                      borderBottom: "1px solid #1e40af",
                    }}
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr
                    key={sub.submissionId}
                    onClick={() => handleRowClick(sub)}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedSubmission?.submissionId === sub.submissionId
                          ? "#1e40af44"
                          : "transparent",
                    }}
                  >
                    <td style={{ padding: "0.5rem" }}>{sub.submissionId}</td>
                    <td style={{ padding: "0.5rem" }}>{sub.submittedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={handleViewClick}
            style={{
              backgroundColor: "#00fff7",
              color: "#0a0a1f",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              marginTop: "1rem",
              fontWeight: "bold",
              width: "100%",
              boxShadow: "0 0 4px #00fff733",
            }}
          >
            View Submission Data
          </button>
        </div>
      </section>

      {/* Drawer */}
      {drawerOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "400px",
            height: "100%",
            backgroundColor: "#0f111a",
            borderLeft: "2px solid #1e40af",
            padding: "1rem",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          <h3 style={{ color: "#66aaff", marginBottom: "1rem" }}>
            Submission Details
          </h3>
          {submissionDetails ? (
            <pre style={{ color: "#a0c8ff" }}>
              {JSON.stringify(submissionDetails, null, 2)}
            </pre>
          ) : (
            <p>No submission details loaded</p>
          )}
          <button
            onClick={() => setDrawerOpen(false)}
            style={{
              backgroundColor: "#ff4d4d",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              marginTop: "1rem",
              width: "100%",
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Help Modal */}
      {helpOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              backgroundColor: "#0a0a1f",
              border: "2px solid #00fff7",
              borderRadius: "1rem",
              padding: "2rem",
              maxWidth: "600px",
              color: "#f5f8f8ff",
              fontFamily: "monospace",
              fontSize: "1.25rem",
              whiteSpace: "pre-wrap",
              boxShadow: "0 0 6px #00fff733, 0 0 12px #00fff733 inset",
            }}
          >
            <h2
              style={{
                color: "#00fff7",
                marginBottom: "1rem",
                textShadow: "0 0 3px #00fff733",
              }}
            >
              Help - Dynamic Form Tree
            </h2>
            <p style={{ lineHeight: "1.6", marginBottom: "1rem" }}>{helpText}</p>
            <button
              onClick={() => setHelpOpen(false)}
              style={{
                backgroundColor: "#00fff7",
                color: "#0a0a1f",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 0 4px #00fff733",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default VisualFormTree;
