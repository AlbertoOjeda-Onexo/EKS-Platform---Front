import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { appRoutes } from "./routes/appRoutes";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={4000} theme="colored"/>
      <Routes>
        {appRoutes.map(({ path, element }, index) => (
          <Route key={index} path={path} element={element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
