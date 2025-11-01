import React, { useState, useEffect } from "react";
import TextInput from "./TextInput";
import Toggle from "./Toggle";
import Checkbox from "./Checkbox";
import FormElement from "./FormElement";
import Slider from "./Slider";
import TextArea from "./TextArea";
import { v4 as uuidv4 } from "uuid";
import DropDown from "./DropDown";
import Radio from "./Radio";
import DatePicker from "./DatePicker";
import StarRating from "./StarRating";
import NumberSpinner from "./NumberSpinner";
import SmartSuggestionsModal from "./SmartSuggestionsModal";
import DigitalSignature from "./DigitalSignature";
import { motion, AnimatePresence } from "framer-motion";
import "./styles.css";

const FormBuilder = ({ tasks, setTasks, formJson }) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOverId, setDraggedOverId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const generateUniqueID = () => uuidv4();
  const [localFormJson, setLocalFormJson] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [score, setScore] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [templates, setTemplates] = useState([]);
  const helpText = `FormOrbit Designer Help:

FormOrbit Designer allows you to create, manage, and publish rich, single-page forms using a powerful drag-and-drop interface.

Key Features and Workflow:

- Create Form: Start a brand-new form from scratch. Use this to build a fresh single-page form.

- Suggestions: Get AI-driven recommendations to improve your form design, layout, and question structure.

- Preview: Instantly view how your form will look on mobile and desktop devices, ensuring an accurate representation before publishing.

- Save: Save your current form as a reusable template. Only templates in Draft state can be selected for editing from the dropdown.

- Publish: Make your form live and available to end users.

- Load from HTML: Import an existing HTML form to quickly create a new template in FormOrbit.

Draft Templates Dropdown:
- Select a template in Draft state to load and edit it.  
- Choosing "-- Clear Form --" will clear the Form Structure panel on the left, allowing you to start fresh.  
- To add a form to Draft state, use the Template Manager. Only templates in Draft state appear in this dropdown.

Form Structure Panel (Left Column):
- Displays the current form’s pages and questions.  
- Drag components from the Form Components panel to build your form.  
- Click on any page or question to edit, move, or delete it.

Form Components Panel (Right Column):
- Contains all available form elements (TextInput, TextArea, Dropdown, etc.)  
- Drag elements from this panel into the Form Structure panel to add them to your form.

Top Bar:
- Displays the current form name so you always know which form you are working on.  
- Red help icon provides access to guidance anytime.

Tip:
- Organize your form by dragging and nesting questions within pages.  
- Use the Draft state to safely experiment before publishing.`;

  // Fetch draft templates when component mounts
  useEffect(() => {
  const fetchDrafts = async () => {
    const username = "scottm";
    console.log("Fetching drafts for", username);

    try {
      const res = await fetch(
        `https://localhost:8443/api/formorbit/alldrafts?username=${username}`
      );
      console.log("Fetch response:", res.status, res.statusText);

      if (!res.ok) throw new Error("Failed to fetch draft templates");

      const data = await res.json();
      console.log("Raw data from API:", data);

      // Wrap each string in an object with a 'name' property
      const parsed = data.map((item) => ({ name: item }));

      console.log("Parsed data:", parsed);
      setTemplates(parsed); // now your dropdown should get [{name: '...'}, ...]
    } catch (err) {
      console.error("Error fetching draft templates:", err);
    }
  };

  fetchDrafts();
}, []);

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

  const handleTemplateChange = async (event) => {
    const value = event.target.value;
    setSelectedTemplate(value);

    // Exit early if no template selected or placeholder
    if (!value || value === "-- Clear Form --") {
      setSelectedTemplate(""); // Clear selection
      setTasks([]); // Clear left column
      return;
    }

    try {
      // Fetch template JSON asynchronously
      const response = await fetch(
        `https://localhost:8443/api/formorbit/template/${value}`
      );

      if (!response.ok) {
        // Handle HTTP errors
        console.error("Fetch failed:", response.status, response.statusText);
        alert(`Failed to load template: ${response.statusText}`);
        return;
      }

      const formJson2 = await response.json();

      if (!formJson2 || formJson2.length === 0) {
        // Handle empty JSON
        console.warn("No form data found in template:", value);
        alert("No form data found in the template.");
        return;
      }

      // Map JSON to Designer tasks asynchronously
      const importedTasks = mapJsonToTasks(formJson2);
      setTasks(importedTasks); // Update Designer
    } catch (error) {
      // Handle network or parsing errors
      console.error("Error loading template:", error);
      alert(`Error loading template: ${error.message}`);
    }
  };

  const showTemplateAlert = (templateName) => {
    alert(`Selected Template: ${templateName}`);
  };

  const toId = (prefix, text) => {
    if (!text) return `${prefix}Unknown`;
    const words = text
      .trim()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .map((word, i) =>
        i === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1)
      );
    const id = prefix + words.join("");
    console.log(
      `toId generated: prefix='${prefix}', text='${text}' => id='${id}'`
    );
    return id;
  };

  // Reads the Left col and produces JSON
  const generateFormJsonFromTasks = (tasks) => {
    return tasks.map((task, index) => {
      console.log(`Processing task #${index}:`, task);
      const label = task.label || task.text || "";

      const idToUse = (prefix) =>
        task.id && task.id.trim() !== "" ? task.id : toId(prefix, label);

      switch (task.type) {
        case "FormElement":
          return {
            type: "FormElement",
            id: task.id,
            formIcon: task.formIcon,
            formSubtitle: task.formSubtitle,
            formName: task.formName,
            formIdentifier: task.formIdentifier,
            formStyle: task.formStyle,
          };

        case "TextInput":
          return {
            type: "TextInput",
            id: idToUse("id"),
            label,
            icon: task.icon,
          };

        case "TextArea":
          return {
            type: "TextArea",
            id: idToUse("textarea"),
            label,
            required: task.required || false,
            icon: task.icon || "",
          };

        case "Checkbox":
          return {
            type: "Checkbox",
            id: idToUse("checkbox"),
            label,
            checkedValue: task.checkedValue || "Checked",
            uncheckedValue: task.uncheckedValue || "Unchecked",
          };

        case "Toggle":
          return {
            type: "Toggle",
            id: idToUse("toggle"),
            label,
            toggleOn: task.toggleOn || "Yes",
            toggleOff: task.toggleOff || "No",
          };

        case "DropDown":
          return {
            type: "DropDown",
            id: idToUse("dropdown"),
            label,
            options: task.options || [],
          };

        case "Radio":
          return {
            type: "Radio",
            id: task.id,
            label,
            options: task.options || [],
          };

        case "Slider":
          return {
            type: "Slider",
            id: idToUse("slider"),
            label: label || "Slider",
            min: typeof task.min === "number" ? task.min : 0,
            max: typeof task.max === "number" ? task.max : 10,
            step: typeof task.step === "number" ? task.step : 1,
            defaultValue:
              typeof task.defaultValue === "number" ? task.defaultValue : 5,
          };

        case "NumberSpinner":
          return {
            type: "NumberSpinner",
            id: idToUse("spinner"),
            label: label || "Spinner",
            min: task.min ?? 0,
            max: task.max ?? 100,
            step: task.step ?? 1,
            defaultValue: task.defaultValue ?? 0,
          };

        case "DigitalSignature":
          return {
            type: "DigitalSignature",
            id: idToUse("signature"),
            label: label || "Signature",
            required: task.required || false,
          };

        case "StarRating":
          return {
            type: "StarRating",
            id: idToUse("rating"),
            label: label || "Rating",
            maxStars: typeof task.maxStars === "number" ? task.maxStars : 5,
          };

        case "DatePicker":
          return {
            type: "DatePicker",
            id: idToUse("date"),
            label: label || "Select Date",
            icon: task.icon || "📅",
            required: task.required || false,
            defaultValue: task.defaultValue || "", // e.g., "2025-01-01"
          };

        default:
          return {
            type: task.type || "Unknown",
            id: task.id,
          };
      }
    });
  };

  // ONE at line 156
  const mapJsonToTasks = (json) => {
    return json
      .map((item) => {
        const base = {
          id: item.id || uuidv4(),
          label: item.label || "",
          status: "New Order",
        };

        switch (item.type) {
          case "FormElement":
            return {
              id: item.id || uuidv4(),
              formName: item.formName || "Untitled Form",
              formIdentifier: item.formIdentifier || uuidv4(),
              formStyle: item.formStyle || "A",
              formSubtitle: item.formSubtitle || "", // ✅ ADD THIS
              type: "FormElement",
              status: "New Order",
            };

          case "TextInput":
            return { ...base, icon: item.icon || "", type: "TextInput" };

          case "TextArea":
            return {
              ...base,
              required: item.required || false,
              icon: item.icon || "",
              type: "TextArea",
            };

          case "Toggle":
            return {
              ...base,
              toggleOn: item.toggleOn || "On",
              toggleOff: item.toggleOff || "Off",
              type: "Toggle",
            };

          case "NumberSpinner":
            return {
              ...base,
              min: item.min ?? 0,
              max: item.max ?? 100,
              step: item.step ?? 1,
              defaultValue: item.defaultValue ?? 0,
              type: "NumberSpinner",
            };

          case "Slider":
            return {
              ...base,
              min: item.min ?? 0,
              max: item.max ?? 10,
              step: item.step ?? 1,
              defaultValue: item.defaultValue ?? 0,
              type: "Slider",
            };

          case "Checkbox":
            return {
              ...base,
              checkedValue: item.checkedValue || "Checked",
              uncheckedValue: item.uncheckedValue || "Unchecked",
              type: "Checkbox",
            };

          case "DigitalSignature":
            return {
              ...base,
              signerName: item.signerName || "", // Optional signer metadata
              signatureUrl: item.signatureUrl || "", // Optional saved image or blob URL
              type: "DigitalSignature",
            };

          case "DropDown":
            return {
              ...base,
              options: Array.isArray(item.options) ? item.options : [],
              type: "DropDown",
            };

          case "StarRating":
            return {
              ...base,
              maxStars: typeof item.maxStars === "number" ? item.maxStars : 5,
              type: "StarRating",
            };

          default:
            console.warn("Unknown type:", item.type);
            return null;
        }
      })
      .filter(Boolean);
  };

  // This is the method your button needs
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  // Also define a close handler if needed
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Sends form JSON to Smart Suggestions API
  const FetchFeedback = async () => {
    try {
      const leftTasks = tasks.filter((task) => task.status === "New Order");

      const mappedJson = generateFormJsonFromTasks(leftTasks); // Reuse shared logic
      const jsonString = JSON.stringify(mappedJson, null, 2);
      setLocalFormJson(jsonString);

      const response = await fetch(
        "https://localhost:8443/api/formorbit/smart",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formJson: jsonString }),
        }
      );

      const data = await response.json();
      console.log("Smart suggestions data:", data);
      setFeedbackList(data.feedback);
      setScore(data.score);
      setShowModal(true);
    } catch (error) {
      console.error("Error updating JSON and fetching feedback:", error);
    }
  };

  const handleUpdateForm = (taskId, updates) => {
    console.log("Updating task:", taskId, updates); // <-- check this logs subtitle and icon
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    setTasks(updatedTasks);
  };

  // Method for moving up
  const moveTaskUp = (taskId) => {
    const leftTasks = tasks.filter((task) => task.status === "New Order");
    const rightTasks = tasks.filter((task) => task.status === "In Progress");

    const index = leftTasks.findIndex((t) => t.id === taskId);

    if (index > 0) {
      const reordered = [...leftTasks];
      const [movedItem] = reordered.splice(index, 1);
      reordered.splice(index - 1, 0, movedItem);
      setTasks([...reordered, ...rightTasks]);
    }
  };

  // Method for moving dowm
  const moveTaskDown = (taskId) => {
    const leftTasks = tasks.filter((task) => task.status === "New Order");
    const rightTasks = tasks.filter((task) => task.status === "In Progress");

    const index = leftTasks.findIndex((t) => t.id === taskId);

    if (index !== -1 && index < leftTasks.length - 1) {
      const reordered = [...leftTasks];
      const [movedItem] = reordered.splice(index, 1);
      reordered.splice(index + 1, 0, movedItem);
      setTasks([...reordered, ...rightTasks]);
    }
  };

  const onDragStart = (evt, task) => {
    evt.dataTransfer.setData("text/plain", task.id);
    setDraggedTask(task);
  };

  const onDragEnd = () => {
    setDraggedTask(null);
    setDraggedOverId(null);
  };

  const handleLoadJson = () => {
    if (!formJson || formJson.length === 0) {
      alert(
        "No form data found. Please use the FormImporter to load form JSON."
      );
      return;
    }

    const generateTaskBase = (item, type) => ({
      id: item.id || uuidv4(),
      label: item.label || item.text || "",
      type,
      status: "New Order",
    });

    const mappedTasks = mapJsonToTasks(formJson);
    setTasks(mappedTasks);
  };

  const onDragEnterTask = (evt, targetTask) => {
    evt.preventDefault();
    if (
      draggedTask &&
      draggedTask.status === "New Order" &&
      targetTask.status === "New Order" &&
      draggedTask.id !== targetTask.id
    ) {
      setDraggedOverId(targetTask.id);
    }
  };

  const onDragOver = (evt) => {
    evt.preventDefault();
  };

  // THE ONDROP METHOD
  const onDrop = (evt, targetStatus) => {
    evt.preventDefault();
    if (!draggedTask) return;

    const isFromLeft = draggedTask.status === "New Order";
    const isFromRight = draggedTask.status === "In Progress";

    const leftTasks = tasks.filter((t) => t.status === "New Order");
    const rightTasks = tasks.filter((t) => t.status === "In Progress");

    const toCamelCase = (text) => {
      return text
        .trim()
        .replace(/[^\w\s]/g, "") // remove punctuation
        .split(/\s+/)
        .map((word, i) =>
          i === 0
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join("");
    };

    if (targetStatus === "New Order") {
      if (isFromRight) {
        let defaultText = "Subscribe";
        let idPrefix = "";
        let extraFields = {};

        switch (draggedTask.type) {
          case "Toggle":
            idPrefix = "toggle";
            extraFields = { toggleOn: "Yes", toggleOff: "No" };
            break;
          case "Checkbox":
            idPrefix = "checkbox";
            break;
          default:
            idPrefix = "field";
            defaultText = "Text Field";
        }

        const readableId = idPrefix + toCamelCase(defaultText);
        const guid = uuidv4(); // Generate a unique ID

        const newTask = {
          ...draggedTask,
          id: guid, // Use the GUID
          text: defaultText,
          status: "New Order",
          ...extraFields,
        };

        const dropIndex = draggedOverId
          ? leftTasks.findIndex((t) => t.id === draggedOverId)
          : leftTasks.length;

        const updatedLeft = [...leftTasks];
        updatedLeft.splice(dropIndex, 0, newTask);

        setTasks([...updatedLeft, ...rightTasks]);
      } else if (isFromLeft) {
        const fromIndex = leftTasks.findIndex((t) => t.id === draggedTask.id);
        const toIndex = leftTasks.findIndex((t) => t.id === draggedOverId);

        if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
          const reordered = [...leftTasks];
          const [moved] = reordered.splice(fromIndex, 1);
          reordered.splice(toIndex, 0, moved);
          setTasks([...reordered, ...rightTasks]);
        }
      }
    }

    setDraggedTask(null);
    setDraggedOverId(null);
  };

  const toCamelCase = (text) => {
    return text
      .trim()
      .replace(/[^\w\s]/g, "") // remove punctuation
      .split(/\s+/)
      .map((word, i) =>
        i === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join("");
  };

  const openDeleteConfirmation = (task) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.text || task.formName}"?`
    );
    if (confirmed) {
      setTasks(tasks.filter((t) => t.id !== task.id));
    }
  };

  const handleCreateForm = () => {
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

  // Update this method for each element type
  // Left column stays mostly the same (using 'DropDown')
  const renderLeftColumn = () => {
    const leftTasks = tasks.filter((t) => t.status === "New Order");

    return (
      <div
        className="new-order-column"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, "New Order")}
      >
        <h4>Form Structure</h4>

        {leftTasks.length > 0 ? (
          <AnimatePresence>
            {leftTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onDragEnter={(e) => onDragEnterTask(e, task)}
              >
                {task.type === "FormElement" ? (
                  <FormElement
                    task={task}
                    onDragStart={(e) => onDragStart(e, task)}
                    onDragEnd={onDragEnd}
                    openDeleteConfirmation={openDeleteConfirmation}
                    onUpdateForm={handleUpdateForm}
                  />
                ) : task.type === "Checkbox" ? (
                  <Checkbox
                    task={task}
                    onDragStart={(e) => onDragStart(e, task)}
                    onDragEnd={onDragEnd}
                    openDeleteConfirmation={openDeleteConfirmation}
                    onSaveText={handleSaveText}
                    onMoveUp={moveTaskUp}
                    onMoveDown={moveTaskDown}
                  />
                ) : task.type === "Toggle" ? (
                  <Toggle
                    task={task}
                    onDragStart={(e) => onDragStart(e, task)}
                    onDragEnd={onDragEnd}
                    openDeleteConfirmation={openDeleteConfirmation}
                    onSaveText={handleSaveText}
                    onMoveUp={moveTaskUp}
                    onMoveDown={moveTaskDown}
                  />
                ) : task.type === "Slider" ? (
                  <Slider
                    task={task}
                    onDragStart={(e) => onDragStart(e, task)}
                    onDragEnd={onDragEnd}
                    openDeleteConfirmation={openDeleteConfirmation}
                    onSaveText={handleSaveText}
                    isInLeftColumn={true}
                    onMoveUp={moveTaskUp}
                    onMoveDown={moveTaskDown}
                  />
                ) : task.type === "DropDown" ? (
                  <DropDown
                    task={task}
                    onDragStart={(e) => onDragStart(e, task)}
                    onDragEnd={onDragEnd}
                    openDeleteConfirmation={openDeleteConfirmation}
                    onSaveText={handleSaveText}
                    isInLeftColumn={true}
                    onMoveUp={moveTaskUp}
                    onMoveDown={moveTaskDown}
                  />
                ) : task.type === "Radio" ? (
                  <Radio
                    task={task}
                    onDragStart={(e) => onDragStart(e, task)}
                    onDragEnd={onDragEnd}
                    openDeleteConfirmation={openDeleteConfirmation}
                    onSaveText={handleSaveText}
                    isInLeftColumn={true}
                    onMoveUp={moveTaskUp}
                    onMoveDown={moveTaskDown}
                  />
                ) : task.type === "NumberSpinner" ? (
                  <NumberSpinner
                    task={task}
                    onDragStart={(e) => onDragStart(e, task)}
                    onDragEnd={onDragEnd}
                    openDeleteConfirmation={openDeleteConfirmation}
                    onSaveText={handleSaveText}
                    isInLeftColumn={true}
                    onMoveUp={moveTaskUp}
                    onMoveDown={moveTaskDown}
                  />
                ) : task.type === "TextArea" ? (
                  <TextArea
                    task={task}
                    onDragStart={(e) => onDragStart(e, task)}
                    onDragEnd={onDragEnd}
                    onSaveText={handleSaveText}
                    openDeleteConfirmation={openDeleteConfirmation}
                    onMoveUp={moveTaskUp}
                    onMoveDown={moveTaskDown}
                  />
                ) : task.type === "StarRating" ? (
                  <StarRating
                    task={task}
                    onDragStart={(e) => onDragStart(e, task)}
                    onDragEnd={onDragEnd}
                    openDeleteConfirmation={openDeleteConfirmation}
                    onSaveText={handleSaveText}
                    onMoveUp={moveTaskUp}
                    onMoveDown={moveTaskDown}
                  />
                ) : task.type === "DatePicker" ? (
                  <DatePicker
                    task={task}
                    onDragStart={(e) => onDragStart(e, task)}
                    onDragEnd={onDragEnd}
                    openDeleteConfirmation={openDeleteConfirmation}
                    onSaveText={handleSaveText}
                    onMoveUp={moveTaskUp}
                    onMoveDown={moveTaskDown}
                  />
                ) : task.type === "DigitalSignature" ? (
                  <DigitalSignature
                    task={task}
                    onDragStart={(e) => onDragStart(e, task)}
                    onDragEnd={onDragEnd}
                    openDeleteConfirmation={openDeleteConfirmation}
                    onSaveText={handleSaveText}
                    onMoveUp={moveTaskUp}
                    onMoveDown={moveTaskDown}
                  />
                ) : (
                  <TextInput
                    task={task}
                    onDragStart={(e) => onDragStart(e, task)}
                    onDragEnd={onDragEnd}
                    onSaveText={handleSaveText}
                    openDeleteConfirmation={openDeleteConfirmation}
                    onMoveUp={moveTaskUp}
                    onMoveDown={moveTaskDown}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <p style={{ fontStyle: "italic", color: "#888" }}>
            No form elements added yet.
          </p>
        )}
      </div>
    );
  };

  // Right column updated:
  // 1. Filter for 'DropDown' (capital D) to match left column.
  // 2. Render rightTasks instead of only templates.
  // 3. Optionally keep templateElements separate for adding new components (if needed).

  const renderRightColumn = () => {
    const rightTasks = tasks.filter(
      (t) =>
        t.status === "In Progress" &&
        (t.type === "TextInput" ||
          t.type === "TextArea" ||
          t.type === "Checkbox" ||
          t.type === "Toggle" ||
          t.type === "Slider" ||
          t.type === "DropDown" ||
          t.type === "Radio" ||
          t.type === "NumberSpinner" ||
          t.type === "StarRating" ||
          t.type === "DatePicker" ||
          t.type === "DigitalSignature")
    );

    const templateElements = [
      { id: "template-text-element", type: "TextInput", status: "In Progress" },
      {
        id: "template-textarea-element",
        type: "TextArea",
        status: "In Progress",
      },
      {
        id: "template-checkbox-element",
        type: "Checkbox",
        status: "In Progress",
      },
      { id: "template-toggle-element", type: "Toggle", status: "In Progress" },
      { id: "template-slider-element", type: "Slider", status: "In Progress" },
      { id: "template-dropdown", type: "DropDown", status: "In Progress" },
      { id: "template-radio", type: "Radio", status: "In Progress" },
      { id: "template-spinner", type: "NumberSpinner", status: "In Progress" },
      { id: "template-star-rating", type: "StarRating", status: "In Progress" },
      { id: "template-date-picker", type: "DatePicker", status: "In Progress" },
      {
        id: "template-digital-signature",
        type: "DigitalSignature",
        status: "In Progress",
      }, // ✅ Added this
    ];

    const getIconForType = (type) => {
      switch (type) {
        case "TextInput":
          return "✏️";
        case "TextArea":
          return "📄";
        case "Checkbox":
          return "☑️";
        case "Toggle":
          return "🔁";
        case "Slider":
          return "🎚️";
        case "DropDown":
          return "🔽";
        case "Radio":
          return "🔘";
        case "Checkbox":
          return "☑️";
        case "DatePicker":
          return "📅";
        case "NumberSpinner":
          return "🧮";
        case "StarRating":
          return "⭐️";
        case "DigitalSignature":
          return "🖋️";
        default:
          return "❓";
      }
    };

    return (
      <div
        className="in-progress-column"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, "In Progress")}
      >
        <h4>Form Components</h4>

        {rightTasks.map((task) => (
          <div
            key={task.id}
            className="element-card dark-card"
            draggable
            onDragStart={(e) => onDragStart(e, task)}
            onDragEnd={onDragEnd}
          >
            <span style={{ marginRight: "8px" }}>
              {getIconForType(task.type)}
            </span>
            {task.type}
          </div>
        ))}

        <h5 style={{ marginTop: "20px" }}></h5>
        {templateElements.map((template) => (
          <div
            key={template.id}
            className="element-card light-card"
            draggable
            onDragStart={(e) => onDragStart(e, template)}
            onDragEnd={onDragEnd}
            style={{ cursor: "grab" }}
          >
            <span style={{ marginRight: "8px" }}>
              {getIconForType(template.type)}
            </span>
            {template.type}
          </div>
        ))}
      </div>
    );
  };

  /**
   * handleSaveDraft
   * ----------------
   * Generates a JSON representation of the current form structure.
   * It:
   *  1. Logs all current tasks (for debug purposes).
   *  2. Filters tasks in the "New Order" column.
   *  3. Converts each to a structured object based on its type.
   *     - TextInput, ToggleElement, DropDown, CheckboxElement, FormElement
   *  4. Outputs the final form as a formatted JSON string.
   */
  const handleSaveDraft = async () => {
  try {
    console.log("Current tasks:");
    tasks.forEach((t) => {
      if (t.type === "Toggle") {
        console.log(
          `Task id=${t.id}, label='${t.text}', toggleOn='${t.toggleOn}', toggleOff='${t.toggleOff}'`
        );
      } else if (t.type === "DatePicker") {
        console.log(
          `Task id=${t.id}, label='${t.text}', type='DatePicker', dateValue='${t.dateValue || "N/A"}'`
        );
      }
    });

    const leftTasks = tasks.filter((task) => task.status === "New Order");
    console.log('Filtered leftTasks (status === "New Order"):', leftTasks);

    const jsonOutput = generateFormJsonFromTasks(leftTasks);
    const jsonString = JSON.stringify(jsonOutput, null, 2);
    console.log("Final Form JSON:", jsonString);

    // 🔥 Send form data to Spring Boot backend over HTTPS and render preview
    const response = await fetch("https://localhost:8443/api/formorbit/preview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonString,
    });

    if (!response.ok) {
      throw new Error(`Backend returned status ${response.status}`);
    }

    const htmlString = await response.text(); // expecting full HTML from backend
    console.log("✅ Backend response received");

    // Open in a new window and render HTML
    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.open();
      previewWindow.document.write(htmlString);
      previewWindow.document.close();
    } else {
      alert("Popup blocked. Please allow popups for this site.");
    }
  } catch (error) {
    console.error("❌ Error posting to backend:", error);
    alert("Failed to submit form preview. Check console for details.");
  }
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
 const handleSaveTemplate = async () => {
  try {
    console.log("Current tasks:");
    tasks.forEach((t) => {
      if (t.type === "Toggle") {
        console.log(
          `Task id=${t.id}, label='${t.text}', toggleOn='${t.toggleOn}', toggleOff='${t.toggleOff}'`
        );
      } else if (t.type === "DatePicker") {
        console.log(
          `Task id=${t.id}, label='${t.text}', type='DatePicker', dateValue='${t.dateValue || "N/A"}'`
        );
      }
    });

    // Filter tasks with status === "New Order"
    const leftTasks = tasks.filter((task) => task.status === "New Order");
    console.log('Filtered leftTasks (status === "New Order"):', leftTasks);

    // Generate JSON from filtered tasks
    const jsonOutput = generateFormJsonFromTasks(leftTasks);
    const jsonString = JSON.stringify(jsonOutput, null, 2);
    console.log("Final Form JSON:", jsonString);

    // 🔥 Send to Spring Boot backend
    const response = await fetch("https://localhost:8443/api/formorbit/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonString,
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    console.log("✅ Backend response received:", text);
    alert(`Backend Response: ${text}`);

  } catch (error) {
    console.error("❌ Error posting to backend:", error);
    alert(`Failed to submit form. Error: ${error.message}`);
  }
};


  /**
   * Updates a task in the task list with new text/label and any element-specific data.
   * Handles different types including ToggleElement and DropDown.
   *
   * @param {string} taskId - The ID of the task to update.
   * @param {string} newText - The updated label or text for the task.
   * @param {any} newOptionsOrOnValue - Either the dropdown options (array) or toggleOn value (string).
   * @param {string} [newOffValue] - The toggleOff value (only used for ToggleElement).
   */
  const handleSaveText = (
    taskId,
    newId,
    newText,
    newOptionsOrOnValue,
    newOffValue,
    newIcon,
    newSubtitle // ✅ Add this
  ) => {
    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        const computedId = newId && newId.trim() !== "" ? newId.trim() : t.id;

        const updates = { id: computedId };

        switch (t.type) {
          case "TextInput":
            updates.label = newText;
            updates.icon = newIcon;
            break;

          case "NumberSpinner":
            updates.label = newText; // PROBLEM HERE
            updates.min = newOptionsOrOnValue?.min ?? t.min;
            updates.max = newOptionsOrOnValue?.max ?? t.max;
            updates.step = newOptionsOrOnValue?.step ?? t.step;
            updates.defaultValue =
              newOptionsOrOnValue?.defaultValue ?? t.defaultValue;
            break;

          case "TextArea":
            updates.label = newText;
            updates.required = newOptionsOrOnValue;
            updates.icon = newIcon;
            break;

          case "Toggle":
            updates.label = newText; // ✅ match what Toggle uses
            updates.toggleOn = newOptionsOrOnValue;
            updates.toggleOff = newOffValue;
            break;

          case "Checkbox":
            updates.label = newText;
            updates.checkedValue = newOptionsOrOnValue;
            updates.uncheckedValue = newOffValue;
            break;

          case "DropDown":
            updates.label = newText;
            updates.options = newOptionsOrOnValue;
            break;

          case "Radio":
            updates.label = newText;
            updates.options = Array.isArray(newOptionsOrOnValue)
              ? newOptionsOrOnValue
              : Array.isArray(newOptionsOrOnValue?.options)
              ? newOptionsOrOnValue.options
              : [];
            break;

          case "Slider":
            updates.label = newText;
            updates.min = newOptionsOrOnValue?.min ?? t.min;
            updates.max = newOptionsOrOnValue?.max ?? t.max;
            updates.step = newOptionsOrOnValue?.step ?? t.step;
            updates.defaultValue =
              newOptionsOrOnValue?.defaultValue ?? t.defaultValue;
            break;

          case "FormElement":
            updates.formName = newText;
            updates.formSubtitle = newSubtitle ?? t.formSubtitle; // use formSubtitle
            updates.formStyle = newOptionsOrOnValue ?? t.formStyle;
            updates.formIcon = newIcon ?? t.formIcon; // use formIcon for consistency
            break;

          case "DigitalSignature":
            updates.label = newText;
            break;

          // ✅ New case for DatePicker
          case "DatePicker":
            updates.label = newText;
            updates.icon = newIcon;
            break;

          case "StarRating":
            updates.label = newText;
            updates.maxStars =
              typeof newOptionsOrOnValue === "number"
                ? newOptionsOrOnValue
                : t.maxStars ?? 5;
            break;

          default:
            break;
        }

        return { ...t, ...updates };
      }

      return t;
    });

    setTasks(updatedTasks);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "https://t2i3dyp8wc.execute-api.us-east-1.amazonaws.com/formv4/formv4",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}`);
      }

      const html = await response.text();

      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.open();
        newWindow.document.write(html);
        newWindow.document.close();
      } else {
        alert("Popup blocked. Please allow popups for this site.");
      }
    } catch (error) {
      console.error("Error fetching HTML form:", error);
      alert("Failed to load form. Check console for details.");
    }
  };

  const formElement = tasks.find(
    (t) => t.status === "New Order" && t.type === "FormElement"
  );

  return (
    <div
      style={{
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: "#1a1a2e",
        color: "#f5f5f5",
        padding: "1rem",
        height: "100vh",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
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
        <button onClick={handleCreateForm} className="designer-button">
          Create Form
        </button>

        <button onClick={FetchFeedback} className="designer-button">
          Suggestions
        </button>

        <button onClick={handleSaveDraft} className="designer-button">
          Preview
        </button>

        <button onClick={handleSaveTemplate} className="designer-button">
          Save
        </button>

        <button onClick={handleSaveTemplate} className="designer-button">
          Publish
        </button>

        <button onClick={handleLoadJson} className="designer-button">
          Load from HTML
        </button>
      </div>

      {/* Smart Suggestions Modal */}
      <SmartSuggestionsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        score={score}
        feedbackList={feedbackList}
      />

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
            Draft Templates:
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
            {/* Always keep your Clear Form option */}
            <option value="-- Clear Form --">-- Clear Form --</option>

            {/* Dynamically render templates from API */}
            {templates.map((t, idx) => (
              <option key={idx} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Centered Current Form Name */}
        {formElement && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontStyle: "italic",
              fontWeight: "bold",
              color: "#ffffff",
            }}
          >
            Current Form: {formElement.formName}
          </div>
        )}

        {/* Help Icon */}
        <div
          style={{
            cursor: "pointer",
            color: "#f32d00ff",
            fontSize: "35px",
            fontWeight: "bold",
          }}
          onClick={() => setHelpOpen(true)}
        >
          ?
        </div>
      </div>

      {/* Form Builder Columns */}
      <div className="container">
        <div className="column-container">
          {renderLeftColumn()}
          {renderRightColumn()}
        </div>
      </div>

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
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setHelpOpen(false)} // click outside to close
        >
          <div
            style={{
              backgroundColor: "#0f0f1f",
              padding: "2rem",
              borderRadius: "0.75rem",
              boxShadow: "0 0 30px #00ffea",
              maxWidth: "600px",
              maxHeight: "70vh",
              overflowY: "auto",
              color: "#ffffff",
              fontFamily: "'Roboto', sans-serif",
              fontSize: "16px",
              lineHeight: "1.5",
              whiteSpace: "pre-wrap",
            }}
            onClick={(e) => e.stopPropagation()} // prevent modal click from closing
          >
            {typedText}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
