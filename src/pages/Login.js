import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";

const Login = ({ setToken }) => {
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Dunckja obsługująca formularz
  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }
  // submit formularz
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      console.log(data);
      setToken(data);
      navigate("/homepage");

      //   alert('Check your email for verification link')
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div className="page">
      <h1 className="login__title">Zaloguj się</h1>
      <form className="login_form" onSubmit={handleSubmit}>
        <input placeholder="Email" name="email" onChange={handleChange} />

        <input
          placeholder="Hasło"
          name="password"
          type="password"
          onChange={handleChange}
        />

        <button type="submit">Zaloguj się</button>
      </form>
      <div className="login_footer">
        <span>
          Nie masz jeszcze konta ? <Link to="/signup">Zajerejstruj się </Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
