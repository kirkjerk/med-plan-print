import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";
import "./styles.css";

const domNode = document.getElementById('app');
const root = createRoot(domNode);
root.render(<App name="Worldly" />);