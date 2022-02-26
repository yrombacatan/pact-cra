import React from "react";
import { Outlet } from "react-router-dom";
import { NavUI } from "./layout/Nav";
import Footer from "./layout/Footer";

function App() {
  return (
    <div>
      <NavUI />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
