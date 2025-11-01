import React from "react";
import ReactDOM from "react-dom";
import "./components/styles.css";
import TaskList from "./App";
import { TASKS } from "./json";

// Dynamically add favicon link
const setFavicon = (href) => {
  const link =
    document.querySelector("link[rel*='icon']") ||
    document.createElement("link");
  link.type = "image/png";
  link.rel = "icon";
  link.href = href;
  document.head.appendChild(link);
};

// Use the public folder path (CRA's %PUBLIC_URL%)
setFavicon(`${process.env.PUBLIC_URL}/FormOrbit-favicon-48x48`);

function App() {
  return (
    <div className="App">
      <TaskList tasks={TASKS} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);


