import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css"

import App from "./App";
import Users from "./routes/Users";
import Methods from "./routes/Methods";
import Keypair from "./routes/Keypair";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} >
        <Route path="/users" element={<Users />} />
        <Route path="/methods" element={<Methods />} />
        <Route path="/keypair" element={<Keypair />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  rootElement
);