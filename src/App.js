import React from "react";
import { Outlet } from "react-router-dom";
import { NavUI } from "./Nav";
import Footer from "./Footer";

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
