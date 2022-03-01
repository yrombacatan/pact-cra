import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css"

import App from "./App";
import Methods from "./routes/Methods";
import Keypair from "./routes/Keypair";
import Contract from "./routes/Contract";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} >
        <Route path="/methods" element={<Methods />} />
        <Route path="/keypair" element={<Keypair />} />
        <Route path="/contract" element={<Contract />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  rootElement
);