import React, { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import Page from "./Page";
import FormElement from "./FormElement";
import Question from "./Question"; // Your new Question component
import "./styles.css";

const MPDesigner = ({
  tasks,
  setTasks,
  handleCreateForm,
  handleSaveDraft,
  handleLoadJson,
  handleLoadJson2,
  handleSmartSuggestionsClick,
}) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOverId, setDraggedOverId] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [leftColumn, setLeftColumn] = useState([]);
const helpText = `🎯 Multi-Page Designer Help

Welcome to the Multi-Page Designer! This powerful tool allows you to build advanced multi-page forms that are structured, user-friendly, and business-ready. Here's how to make the most of it:

1️⃣ Why Multi-Page Forms Matter:
- **Better User Experience:** Breaking forms into steps reduces overwhelm, increases completion rates, and improves data accuracy.
- **Business Insights:** Collect structured responses page by page, making it easier to analyze trends and derive actionable insights.
- **Conditional Workflows:** Different pages can be shown based on prior answers, creating a dynamic experience tailored to each respondent.

2️⃣ How Multi-Page Forms Solve Real Business Needs:
- Customer feedback surveys that adapt to responses.
- Employee onboarding forms that guide users step by step.
- Order or registration forms that need approval or multi-step validation.
- Market research surveys where each page focuses on a specific topic.

3️⃣ Using Pages and Nested Questions:
- **Pages** act as containers for related questions. For example:
  - Page 1: Customer Info (Name, Email, Phone)
  - Page 2: Product Feedback (Satisfaction, Features Used)
  - Page 3: Recommendations (Future Product Requests, Comments)
- **Nested Questions:** Questions inside a page are logically grouped. You can:
  - Add new questions to a page by dragging from the right column.
  - Move questions up or down within a page to prioritize them.
  - Delete or edit questions as your form evolves.
  
4️⃣ Quick Tips:
- Click on a page to edit its title or questions.
- Drag Pages or Questions from the right column to build your form.
- Use the top buttons to Create, Preview, Save, or Load templates.
- Click the '?' icon anytime to view this guide again.

💡 Pro Tip: Plan your pages before adding questions. Group related topics together for clarity and faster completion.

With this approach, you can create highly effective, professional forms that collect structured data, reduce user frustration, and provide actionable insights for your business.`;

  const generateUniqueID = () => uuidv4();

  const [templateElements] = useState([
    {
      id: "template-page",
      type: "Page",
      title: "Untitled Page",
      status: "In Progress",
      icon: "📄", // Example: page icon
    },
    {
      id: "template-question",
      type: "Question",
      label: "Untitled Question",
      status: "In Progress",
       icon: "📝",
    },
  ]);

  const formElement = tasks.find((t) => t.type === "FormElement");

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

  const clearLeftColumn = () => {
  setLeftColumn([]); // clear the left column array
};


  const handleTemplateChange = async (event) => {
  const value = event.target.value;
   // If no template selected or placeholder selected
  if (!value || value === "-- Clear Form --") {
    setSelectedTemplate("");   // clear the selected template
    setTasks([]);         // clear left column
    return;                    // exit the function
  }
 
  setSelectedTemplate(value);
 
  try {
    const response = await fetch(
      `https://localhost:8443/api/formorbit/templatemp/${value}`
    );

    if (!response.ok) {
      alert(`Failed to load template: ${response.statusText}`);
      return;
    }

    const formJson2 = await response.json();

    if (!formJson2 || formJson2.length === 0) {
      alert("No form data found in the template.");
      return;
    }

 // Convert JSON into flat tasks array for left-hand column
    const newTasks = [];

    formJson2.forEach((form) => {
      // Add FormElement at top level
      newTasks.push({
        id: form.id,
        type: form.type,
        formName: form.formName,
        formSubtitle: form.formSubtitle,
        status: "Loaded",
      });

      // Add each Page under Form
      form.pages.forEach((page) => {
        newTasks.push({
          id: page.id,
          type: page.type,
          title: page.pageTitle,
          status: "Loaded",
          questions: page.questions.map((q) => ({ ...q })),
        });
      });
    });

    // Set tasks state to populate left-hand column
    setTasks(newTasks);
  } catch (error) {
    alert(`Error loading template: ${error.message}`);
  }
};

  
  
  
  
  
  /**
   * handleSaveMPDTemplate
   * ---------------------
   * Reads all tasks sequentially and generates a hierarchical JSON:
   * FormElement -> Pages -> Questions
   */
  const handleSaveMPDTemplate = () => {
    const formsJson = [];
    let currentForm = null;

    tasks.forEach((task) => {
      if (task.type === "FormElement") {
        // Start a new Form
        currentForm = {
          id: task.id,
          type: task.type,
          formName: task.formName,
          formSubtitle: task.formSubtitle,
          pages: [],
        };
        formsJson.push(currentForm);
      } else if (task.type === "Page" && currentForm) {
        // Add Page under current Form
        const pageJson = {
          id: task.id,
          type: task.type,
          pageTitle: task.title,
          questions: (task.questions || []).map((q) => ({
            id: q.id,
            label: q.label,
            icon: q.icon || "person",
            required: q.required ?? false,
            type: q.type,
            ...q,
          })),
        };
        currentForm.pages.push(pageJson);
      }
    });

    console.log(
      "The MPDesigner Form JSON:",
      JSON.stringify(formsJson, null, 2)
    );

    // 🔥 Send to Spring Boot backend
    fetch("https://localhost:8443/api/formorbit/previewmp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
       body: JSON.stringify(formsJson), // ✅ stringify the array
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to POST to backend");
        }
        return response.text(); // expecting full HTML string from backend
      })
      .then((htmlString) => {
        console.log("✅ Backend response received");
        const previewWindow = window.open("", "_blank");
        if (previewWindow) {
          previewWindow.document.open();
          previewWindow.document.write(htmlString);
          previewWindow.document.close();
        } else {
          alert("Popup blocked. Please allow popups for this site.");
        }
      })
      .catch((error) => {
        console.error("❌ Error posting to backend:", error);
        alert("Failed to submit form preview.");
      });
  };

  // Move question up
  const handleMoveQuestionUp = (pageId, questionId) => {
    const updatedTasks = tasks.map((page) => {
      if (page.id === pageId) {
        const index = page.questions.findIndex((q) => q.id === questionId);
        if (index > 0) {
          const newQuestions = [...page.questions];
          [newQuestions[index - 1], newQuestions[index]] = [
            newQuestions[index],
            newQuestions[index - 1],
          ];
          return { ...page, questions: newQuestions };
        }
      }
      return page;
    });
    setTasks(updatedTasks);
  };

  // Move question down
  const handleMoveQuestionDown = (pageId, questionId) => {
    const updatedTasks = tasks.map((page) => {
      if (page.id === pageId) {
        const index = page.questions.findIndex((q) => q.id === questionId);
        if (index < page.questions.length - 1) {
          const newQuestions = [...page.questions];
          [newQuestions[index + 1], newQuestions[index]] = [
            newQuestions[index],
            newQuestions[index + 1],
          ];
          return { ...page, questions: newQuestions };
        }
      }
      return page;
    });
    setTasks(updatedTasks);
  };

  // Create a new Form
  const handleCreateFormMP = () => {
    const hasFormElement = tasks.some(
      (t) => t.status === "New Order" && t.type === "FormElement"
    );

    if (hasFormElement) {
      alert("Only one Form element is allowed in the Form Structure.");
      return;
    }

    const newTask = {
      id: generateUniqueID(),
      text: "New Form Element",
      formName: "Untitled",
      formId: generateUniqueID(),
      formStyle: "",
      type: "FormElement",
      status: "New Order",
    };

    setTasks([...tasks, newTask]);
  };

    /**
   * handleSaveTemplate
   * ----------------
   * Generates a JSON representation of the current form structure.
   * It:
   *  1. Logs all current tasks (for debug purposes).
   *  2. Filters tasks in the "New Order" column.
   *  3. Converts each to a structured object based on its type.
   *     - TextInput, ToggleElement, DropDown, CheckboxElement, FormElement
   *  4. Saves the Templaye in AWS.
   */
  const handleSaveTemplate = () => {
    console.log("Current tasks:");
    const formsJson = [];
    let currentForm = null;

    tasks.forEach((task) => {
      if (task.type === "FormElement") {
        // Start a new Form
        currentForm = {
          id: task.id,
          type: task.type,
          formName: task.formName,
          formSubtitle: task.formSubtitle,
          pages: [],
        };
        formsJson.push(currentForm);
      } else if (task.type === "Page" && currentForm) {
        // Add Page under current Form
        const pageJson = {
          id: task.id,
          type: task.type,
          pageTitle: task.title,
          questions: (task.questions || []).map((q) => ({
            id: q.id,
            label: q.label,
            icon: q.icon || "person",
            required: q.required ?? false,
            type: q.type,
            ...q,
          })),
        };
        currentForm.pages.push(pageJson);
      }
    });

    console.log(
      "The MPDesigner Form JSON:",
      JSON.stringify(formsJson, null, 2)
    );
    // 🔥 Send to Spring Boot backend
    fetch("https://localhost:8443/api/formorbit/savemp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formsJson), // ✅ serialize to JSON string,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to POST to backend");
        }
        return response.text(); // expecting full HTML string from backend
      })
      .then((htmlString) => {
        console.log("✅ Backend response received");
        const previewWindow = window.open("", "_blank");
        if (previewWindow) {
          previewWindow.document.open();
          previewWindow.document.write(htmlString);
          previewWindow.document.close();
        } else {
          alert("Popup blocked. Please allow popups for this site.");
        }
      })
      .catch((error) => {
        console.error("❌ Error posting to backend:", error);
        alert("Failed to submit form preview.");
      });
  };
  
  
  
  
  
  //Load Multi Page JSON
  const loadMPJSON = () => {
    // Full hard-coded JSON for MPDesigner
    const mpJson = [
      {
        id: "5623814d-c2a8-4573-a12a-d4c1a25b87ff",
        type: "FormElement",
        formName: "Customer Survey",
        formSubtitle: "",
        pages: [
          {
            id: "2f7531d3-cc60-417e-bc43-67a4223d8218",
            type: "Page",
            pageTitle: "Page 1: Customer Information",
            questions: [
              {
                id: "idName",
                label: "Full Name",
                icon: "person-fill",
                required: false,
                type: "Question",
              },
              {
                id: "idEmail",
                label: "Email Address",
                icon: "envelope",
                required: false,
                type: "Question",
              },
              {
                id: "idPhone",
                label: "Phone Number",
                icon: "telephone-fill",
                required: false,
                type: "Question",
              },
              {
                id: "idAge",
                label: "Enter your Age",
                icon: "person-lines-fill",
                required: false,
                type: "Question",
              },
            ],
          },
          {
            id: "006feedb-d19f-44fb-a402-8b4afc946952",
            type: "Page",
            pageTitle: "Page 2 Purchase Experience",
            questions: [
              {
                id: "idHearAboutIs",
                label: "How did you hear about our company",
                icon: "chat-dots",
                required: false,
                type: "Question",
              },
              {
                id: "idProduct",
                label: "Which product/service did you purchase?",
                icon: "clipboard",
                required: false,
                type: "Question",
              },
              {
                id: "idSatisfaction ",
                label: "Overall satisfaction with the purchase process",
                icon: "star",
                required: false,
                type: "Question",
              },
              {
                id: "idhelpful ",
                label: "Was our staff helpful and courteous?",
                icon: "star",
                required: false,
                type: "Question",
              },
            ],
          },
          {
            id: "c8c3d62f-135b-461f-a30f-8e924f982c03",
            type: "Page",
            pageTitle: "Page 3 Product/Service Feedback",
            questions: [
              {
                id: "idExpectations",
                label: "Did the product/service meet your expectations?",
                icon: "person",
                required: false,
                type: "Question",
              },
              {
                id: "idFeatures",
                label: "Which features do you value most?",
                icon: "star",
                required: false,
                type: "Question",
              },
              {
                id: "idRecommend ",
                label:
                  "How likely are you to recommend us to a friend or colleague?",
                icon: "person",
                required: false,
                type: "Question",
              },
              {
                id: "iDSuggestions",
                label: "Suggestions for product/service improvements",
                icon: "clipboard",
                required: false,
                type: "Question",
              },
            ],
          },
          {
            id: "4e39abb1-cdaa-4d3f-b51c-02de20027549",
            type: "Page",
            pageTitle: "Page 4 Overall Experience",
            questions: [
              {
                id: "idPurchase ",
                label: "How likely are you to purchase from us again?",
                icon: "person",
                required: false,
                type: "Question",
              },
              {
                id: "idOtherProducts",
                label:
                  "Are there other products/services you’d like us to offer?",
                icon: "person",
                required: false,
                type: "Question",
              },
              {
                id: "idRateWebsite",
                label: "How would you rate our website or store navigation?",
                icon: "person",
                required: false,
                type: "Question",
              },
              {
                id: "idRateCompany",
                label:
                  "Overall, how would you rate your experience with our company?",
                icon: "star",
                required: false,
                type: "Question",
              },
            ],
          },
        ],
      },
    ];

    // Convert JSON into flat tasks array for left-hand column
    const newTasks = [];

    mpJson.forEach((form) => {
      // Add FormElement at top level
      newTasks.push({
        id: form.id,
        type: form.type,
        formName: form.formName,
        formSubtitle: form.formSubtitle,
        status: "Loaded",
      });

      // Add each Page under Form
      form.pages.forEach((page) => {
        newTasks.push({
          id: page.id,
          type: page.type,
          title: page.pageTitle,
          status: "Loaded",
          questions: page.questions.map((q) => ({ ...q })),
        });
      });
    });

    // Set tasks state to populate left-hand column
    setTasks(newTasks);
  };

  // Start dragging: set draggedTask with full info including type
  const onDragStart = useCallback((evt, task) => {
    evt.dataTransfer.setData("text/plain", task.id);
    setDraggedTask(task);
  }, []);

  const onDragEnd = useCallback(() => {
    setDraggedTask(null);
    setDraggedOverId(null);
  }, []);

  const onDragOver = useCallback((evt) => {
    evt.preventDefault();
  }, []);

  // Drop on left column: only accept Pages to add new page
  const onDropLeftColumn = useCallback(
    (evt) => {
      evt.preventDefault();
      if (!draggedTask) return;

      if (draggedTask.type === "Page") {
        const newPage = {
          id: uuidv4(),
          type: "Page",
          status: "New Order",
          title: `Page ${tasks.filter((t) => t.type === "Page").length + 1}`,
          questions: [],
        };
        setTasks((prev) => [...prev, newPage]);
      }

      // Ignore dropping Question on whole left column

      setDraggedTask(null);
      setDraggedOverId(null);
    },
    [draggedTask, tasks, setTasks]
  );

  // Drop a question onto a specific page
  const onDropQuestion = useCallback(
    (pageId) => {
      if (!draggedTask) return;
      if (draggedTask.type === "Question") {
        const updatedTasks = tasks.map((page) =>
          page.id === pageId
            ? {
                ...page,
                questions: [
                  ...page.questions,
                  {
                    id: uuidv4(),
                    type: "Question",
                    label: "Untitled Question",
                    required: false,
                  },
                ],
              }
            : page
        );
        setTasks(updatedTasks);
      }
      setDraggedTask(null);
      setDraggedOverId(null);
    },
    [draggedTask, tasks, setTasks]
  );

  // Update a question within a page
  const handleUpdateQuestion = (pageId, questionId, updates) => {
    const updatedTasks = tasks.map((page) => {
      if (page.id === pageId) {
        const updatedQuestions = page.questions.map((q) =>
          q.id === questionId ? { ...q, ...updates } : q
        );
        return { ...page, questions: updatedQuestions };
      }
      return page;
    });
    setTasks(updatedTasks);
  };

  // Update page title
  const handleUpdatePageTitle = (pageId, newTitle) => {
    const updatedTasks = tasks.map((page) =>
      page.id === pageId ? { ...page, title: newTitle } : page
    );
    setTasks(updatedTasks);
  };

  // Additional page actions
  const handleDeletePage = (pageId) => {
    const updatedTasks = tasks.filter((page) => page.id !== pageId);
    setTasks(updatedTasks);
  };

  const handleMovePageUp = (pageId) => {
    const index = tasks.findIndex((page) => page.id === pageId);
    if (index > 0) {
      const newTasks = [...tasks];
      [newTasks[index - 1], newTasks[index]] = [
        newTasks[index],
        newTasks[index - 1],
      ];
      setTasks(newTasks);
    }
  };

  const handleMovePageDown = (pageId) => {
    const index = tasks.findIndex((page) => page.id === pageId);
    if (index < tasks.length - 1) {
      const newTasks = [...tasks];
      [newTasks[index], newTasks[index + 1]] = [
        newTasks[index + 1],
        newTasks[index],
      ];
      setTasks(newTasks);
    }
  };

  const pages = tasks.filter((t) => t.type === "Page");

  return (
    <div className="designer-container">
      <h4 style={{ color: "#ccc", padding: "15px", margin: 0 }}>
        Multi-page forms help break complex data collection into simpler, more
        user-friendly steps.
      </h4>

      {/* Top Button Panel */}
      <div
        className="top-button-panel"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          backgroundColor: "#343a40",
          borderBottom: "1px solid #222",
          gap: "10px",
        }}
      >
        <button onClick={handleCreateFormMP} className="designer-button">
          Create Form
        </button>
        <button onClick={loadMPJSON} className="designer-button">
          Suggestions
        </button>
        <button onClick={handleSaveMPDTemplate} className="designer-button">
          Preview Form
        </button>
        <button onClick={handleLoadJson} className="designer-button">
          Load from HTML
        </button>
        
        <button
          onClick={handleSaveTemplate}
          className="designer-button"
        >
          Save template
        </button>
      </div>

      {/* Template Selector, Current Form Name & Help Icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px",
          gap: "20px",
          position: "relative",
        }}
      >
        {/* Template Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontWeight: "bold", color: "#ffffff" }}>
            Your Templates:
          </span>
          <select
            value={selectedTemplate}
            onChange={handleTemplateChange}
            style={{
              fontSize: "16px",
              padding: "6px 12px",
              backgroundColor: "#1e1e2f",
              color: "#00f0ff",
              border: "1px solid #00f0ff",
              borderRadius: "5px",
              outline: "none",
            }}
          >
            <option value="-- Clear Form --">-- Clear Form --</option>
            <option value="Customer Survey">Customer Survey</option>
          </select>
        </div>

        
        {/* Help Icon */}
        <div
          style={{
            cursor: "pointer",
            color: "#00ffea",
            fontSize: "24px",
            fontWeight: "bold",
          }}
          onClick={() => setHelpOpen(true)}
        >
          ?
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="column-container" style={{ display: "flex" }}>
        {/* Left: Form Structure (accept Page drops) */}
        <div
          className="new-order-column"
          onDragOver={onDragOver}
          onDrop={onDropLeftColumn}
          style={{ flex: 1, padding: "15px", backgroundColor: "#1f1f1f" }}
        >
          <h4>Multi Page Form Structure</h4>

          {/* Render FormElement at top */}
          {tasks
            .filter((t) => t?.type === "FormElement")
            .map(
              (form) =>
                form && (
                  <FormElement
                    key={form.id}
                    task={form} // Pass the correct prop
                    onUpdateForm={(id, updates) => {
                      setTasks(
                        tasks.map((t) =>
                          t.id === id ? { ...t, ...updates } : t
                        )
                      );
                    }}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    openDeleteConfirmation={(taskToDelete) => {
                      const confirmed = window.confirm(
                        "Delete this form element?"
                      );
                      if (confirmed) {
                        setTasks(tasks.filter((t) => t.id !== taskToDelete.id));
                      }
                    }}
                  />
                )
            )}

          {/* Render Pages */}
          {pages.length > 0 ? (
            <AnimatePresence>
              {pages.map((page) => (
                <motion.div
                  key={page.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={draggedOverId === page.id ? "dragged-over" : ""}
                >
                  <Page
                    page={page}
                    onUpdateQuestion={handleUpdateQuestion}
                    onUpdateTitle={handleUpdatePageTitle}
                    onDeletePage={handleDeletePage}
                    onMoveUp={handleMovePageUp}
                    onMoveDown={handleMovePageDown}
                    onMoveQuestionUp={handleMoveQuestionUp} // NEW
                    onMoveQuestionDown={handleMoveQuestionDown} // NEW
                    onDropQuestion={onDropQuestion}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <p className="empty-message">No pages added yet.</p>
          )}
        </div>

        {/* Right: Drag Components */}
        <div
          className="in-progress-column"
          onDragOver={onDragOver}
          onDrop={(e) => {
            e.preventDefault();
            // Optionally ignore drop here or handle differently
          }}
          style={{
            width: "300px",
            padding: "15px",
            backgroundColor: "#2c2c2c",
          }}
        >
          <h4>Form Components</h4>
          {templateElements.map((template) => (
            <div
              key={template.id}
              className="element-card light-card"
              draggable
              onDragStart={(e) => onDragStart(e, template)}
              onDragEnd={onDragEnd}
              style={{
                backgroundColor: "#444",
                color: "#fff",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                cursor: "grab",
              }}
            >
              <span>{template.icon}</span>
              <span>{template.type}</span>
            </div>
          ))}
        </div>
      </div>

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
};

const baseButtonStyle = {
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  fontWeight: "bold",
  cursor: "pointer",
  color: "#fff",
};

const greenButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: "#28a745",
};

const redButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: "#D8000C",
};

const blueButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: "#007bff",
};

export default MPDesigner;
