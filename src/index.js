import { createRoot } from "react-dom/client";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
// create root converts HTML element to js element

root.render(<App />);
