import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { appRoutes } from "./routes/appRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {appRoutes.map(({ path, element }, index) => (
          <Route key={index} path={path} element={element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
