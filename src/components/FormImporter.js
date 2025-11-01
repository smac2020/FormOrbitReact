import React, { useState } from "react";

const FormImporter = ({ setFormJson }) => {
  const [htmlInput, setHtmlInput] = useState("");
  const [error, setError] = useState(null);
  const [importedJson, setImportedJson] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUploadStatus, setImageUploadStatus] = useState(null);

  const parseHtmlToJson = (html) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const form = doc.querySelector("form");
      if (!form) throw new Error("No form element found in HTML.");

      const formId =
        form.querySelector('input[name="formid"]')?.value || crypto.randomUUID();
      const formName = "Gold Rush";
      const formStyle = "Dusk";

      const jsonOutput = [
        {
          type: "FormElement",
          id: formId,
          formName,
          formStyle,
        },
      ];
      const processedRadioGroups = new Set();
      const inputs = form.querySelectorAll("input, select, textarea");
      inputs.forEach((input) => {
        const tagName = input.tagName.toLowerCase();
        const id = input.id || crypto.randomUUID();
        if (input.type === "hidden") return;

        const labelText =
          form.querySelector(`label[for='${id}']`)?.textContent.trim() ||
          input.name ||
          tagName;

        if (tagName === "input") {
          switch (input.type) {
            case "text":
            case "email":
            case "password":
              jsonOutput.push({ type: "TextInput", id, text: labelText });
              break;
            case "checkbox":
              jsonOutput.push({
                type: "Checkbox",
                id,
                label: labelText,
                checkedValue: "Checked",
                uncheckedValue: "Unchecked",
              });
              break;
            case "range":
              jsonOutput.push({
                type: "Slider",
                id,
                label: labelText,
                min: input.min ? Number(input.min) : 0,
                max: input.max ? Number(input.max) : 10,
                step: input.step ? Number(input.step) : 1,
                defaultValue: input.defaultValue ? Number(input.defaultValue) : 5,
              });
              break;
            case "radio":
              const groupName = input.name;
              if (processedRadioGroups.has(groupName)) break;
              const groupInputs = form.querySelectorAll(
                `input[type="radio"][name="${groupName}"]`
              );
              const options = Array.from(groupInputs).map(
                (radio) => radio.value || radio.id
              );
              const labelElement =
                form.querySelector(`label[for='${groupInputs[0].id}']`) ||
                groupInputs[0].closest("label") ||
                groupInputs[0].previousSibling;
              const groupLabel =
                labelElement?.textContent.trim() || `Select your ${groupName}`;
              jsonOutput.push({
                type: "Radio",
                id: groupInputs[0].id || crypto.randomUUID(),
                label: groupLabel,
                options,
              });
              processedRadioGroups.add(groupName);
              break;
            default:
              break;
          }
        } else if (tagName === "select") {
          const options = Array.from(input.querySelectorAll("option")).map(
            (opt) => opt.textContent.trim()
          );
          jsonOutput.push({
            type: "DropDown",
            id,
            label: labelText,
            options,
          });
        } else if (tagName === "textarea") {
          jsonOutput.push({
            type: "TextInput",
            id,
            text: labelText,
          });
        }
      });

      return jsonOutput;
    } catch (e) {
      setError(e.message);
      return null;
    }
  };

  const handleImport = () => {
    setError(null);
    const json = parseHtmlToJson(htmlInput);
    if (json) {
      setFormJson(json);
      setImportedJson(json);
    }
  };

  const handlePdfChange = (event) => {
    setPdfFile(event.target.files[0]);
    setUploadStatus(null);
  };

  const handlePdfUpload = async () => {
    if (!pdfFile) {
      setUploadStatus("❌ No file selected.");
      return;
    }

    setIsConverting(true);

    try {
      const formData = new FormData();
      formData.append("file", pdfFile);
      const response = await fetch("http://localhost:8080/api/formorbit/pdf", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed: " + response.statusText);
      const result = await response.text();
      setUploadStatus("✅ Upload successful");
      setHtmlInput(result);
    } catch (e) {
      setUploadStatus(`❌ Upload failed: ${e.message}`);
    } finally {
      setIsConverting(false);
    }
  };

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
    setImageUploadStatus(null);
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      setImageUploadStatus("❌ No image selected.");
      return;
    }

    setIsConverting(true);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      const response = await fetch("http://localhost:8080/api/formorbit/image", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed: " + response.statusText);
      const result = await response.text();
      setUploadStatus("✅ Upload successful");
      const parser = new DOMParser();
      const doc = parser.parseFromString(result, "text/html");
      const htmlContent = doc.documentElement.innerHTML.trim();
      setHtmlInput(`<html>${htmlContent}</html>`);
    } catch (e) {
      setImageUploadStatus(`❌ Upload failed: ${e.message}`);
    } finally {
      setIsConverting(false);
    }
  };

  const styles = {
    container: {
      maxWidth: "1100px",
      margin: "2rem auto",
      fontFamily: "'Poppins', sans-serif",
      color: "#c7f0f9",
      padding: "2rem",
      backgroundColor: "#0a0c17",
      borderRadius: "1rem",
    },
    cardContainer: {
      display: "flex",
      gap: "2rem",
      flexWrap: "wrap",
      justifyContent: "center",
      marginBottom: "3rem",
    },
    card: {
      flex: "1 1 320px",
      backgroundColor: "#111427",
      borderRadius: "1rem",
      padding: "24px 20px",
      boxShadow: "0 0 12px #00e5ff66, 0 0 20px #8a2be266",
      color: "#c7f0f9",
      cursor: "default",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    cardHover: {
      transform: "scale(1.03)",
      boxShadow: "0 0 16px #00e5ff88, 0 0 28px #8a2be288",
    },
    icon: {
      fontSize: "3rem",
      marginBottom: "16px",
      textShadow: "0 0 2px #00e5ff, 0 0 5px #8a2be2",
    },
    cardTitle: {
      fontSize: "1.8rem",
      fontWeight: "700",
      marginBottom: "12px",
      color: "#66ffff",
      textAlign: "center",
      textShadow: "0 0 1px #00e5ff, 0 0 3px #66ffff",
    },
    cardDesc: {
      fontSize: "1rem",
      color: "#a0c8ff",
      textAlign: "center",
      marginBottom: "1rem",
      textShadow: "0 0 1px #00e5ff",
    },
   button: {
  marginTop: "1.25rem",
  padding: "10px 20px",
  fontSize: "1.1rem",
  fontWeight: "600",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  color: "#00ffcc",          // <-- Dark neon text color
  backgroundColor: "#0a0c17", // Dark background for contrast
  boxShadow: "0 0 10px #00ffcc, 0 0 20px #00ffcc inset", // Neon glow
  transition: "0.2s ease",
},

    fileInput: {
      marginTop: "1rem",
    },
    textarea: {
      width: "100%",
      height: "300px",
      backgroundColor: "#0f111a",
      color: "#c7f0f9",
      fontFamily: "monospace",
      border: "1px solid #1e40af",
      borderRadius: "0.75rem",
      padding: "12px",
    },
    error: {
      color: "#ff4d4d",
    },
    success: {
      color: "#00ff99",
      fontWeight: "bold",
      fontSize: "1rem",
    },
    outputBox: {
      backgroundColor: "#0f111a",
      color: "#c7f0f9",
      padding: "1rem",
      maxHeight: "300px",
      overflowY: "auto",
      borderRadius: "0.75rem",
      fontSize: "14px",
      marginTop: "1rem",
    },
    mask: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.85)",
      color: "#c7f0f9",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "2rem",
      zIndex: 9999,
    },
  };

  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);

  return (
    <>
      {isConverting && <div style={styles.mask}>Converting File...</div>}

      <div style={styles.container}>
        <h2 style={{ textAlign: "center" }}>Form Importer</h2>

        <div style={styles.cardContainer}>
          <div
            style={{ ...styles.card, ...(hoveredCardIndex === 0 ? styles.cardHover : {}) }}
            onMouseEnter={() => setHoveredCardIndex(0)}
            onMouseLeave={() => setHoveredCardIndex(null)}
          >
            <div style={styles.icon}>📄</div>
            <h3 style={styles.cardTitle}>Convert PDF Forms</h3>
            <p style={styles.cardDesc}>
              Upload a PDF form and convert to HTML.
            </p>
            <input type="file" accept="application/pdf" onChange={handlePdfChange} style={styles.fileInput} />
            <button onClick={handlePdfUpload} style={styles.button}>Convert PDF</button>
            {uploadStatus && <p style={uploadStatus.includes("✅") ? styles.success : styles.error}>{uploadStatus}</p>}
          </div>

          <div
            style={{ ...styles.card, ...(hoveredCardIndex === 1 ? styles.cardHover : {}) }}
            onMouseEnter={() => setHoveredCardIndex(1)}
            onMouseLeave={() => setHoveredCardIndex(null)}
          >
            <div style={styles.icon}>🖼️</div>
            <h3 style={styles.cardTitle}>Convert Images</h3>
            <p style={styles.cardDesc}>
              Upload scanned images of forms to convert to HTML.
            </p>
            <input type="file" accept="image/*" onChange={handleImageChange} style={styles.fileInput} />
            <button onClick={handleImageUpload} style={styles.button}>Upload Image</button>
            {imageUploadStatus && <p style={imageUploadStatus.includes("✅") ? styles.success : styles.error}>{imageUploadStatus}</p>}
          </div>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <h3>Section B - Results</h3>
          <textarea value={htmlInput} onChange={(e) => setHtmlInput(e.target.value)} style={styles.textarea} />
          <button onClick={handleImport} style={styles.button}>Template Conversion</button>
          {error && <p style={styles.error}>Error: {error}</p>}
          {importedJson && <div>
            <p style={styles.success}>✅ FormOrbit Template created! Load it in Form Designer.</p>
            <pre style={styles.outputBox}>{JSON.stringify(importedJson, null, 2)}</pre>
          </div>}
        </div>
      </div>
    </>
  );
};

export default FormImporter;
