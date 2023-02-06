import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Login from "../src/pages/Login";
import SignUp from "../src/pages/SignUp";
import Homepage from "../src/pages/Homepage";
// pages
import Home from "./pages/Home";
import Create from "./pages/Create";
import Update from "./pages/Update";
import Offer from "./pages/Offer";
import About from "./pages/About";
import CreatedOffers from "./pages/CreatedOffers";
import React, { useState, useEffect } from "react";

function App() {
  const [token, setToken] = useState(false); // TOKEN PRZECHOWUJACY LOGOWANIE UŻYTKOWNIKA

  const debugtoken = () => {
    console.log(token);
  };

  if (token) {
    sessionStorage.setItem("token", JSON.stringify(token));
  }

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      let data = JSON.parse(sessionStorage.getItem("token"));
      setToken(data);
    }
  }, []);

  return (
    <BrowserRouter>
      <nav>
        <div>
          <Link to="/">
            <h1>DEVOFFERS.IO</h1>
          </Link>
        </div>
        <Link to="/">Oferty</Link>
        {/* Przycisk sprawdzający obecność tokena w aplikcji  */}
        <button className="hidden" onClick={debugtoken}>
          DEBUG TOKEN
        </button>

        {token && <Link to="/create">Nowa oferta</Link>}
        <Link to="/about">O Projekcie</Link>
        {token && <Link to="/homepage">Profil</Link>}
        {!token && <Link to="/login">Login</Link>}
      </nav>

      <Routes>
        <Route path="/" element={<Home token={token} />} />
        {token ? (
          <Route path={"/homepage"} element={<Homepage token={token} />} />
        ) : (
          ""
        )}
        <Route path="/create" element={<Create />} />
        <Route path="/:id/edit" element={<Update />} />
        <Route path="/:id" element={<Offer />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/homepage" element={<Homepage token={setToken} />} />
        <Route
          path="/CreatedOffers"
          element={<CreatedOffers token={token} />}
        />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
