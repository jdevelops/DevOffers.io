import React, { useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";

const SignUp = () => {
  // przechowywanie danych ionputu
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  // Obsługa inputu
  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });
      if (error) throw error;
      alert("Check your email for verification link");
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div>
      <h1 className="login__title">Zarejestruj się</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nazwa użytkownika"
          name="fullName"
          onChange={handleChange}
        />

        <input placeholder="Email" name="email" onChange={handleChange} />

        <input
          placeholder="Hasło"
          name="password"
          type="password"
          onChange={handleChange}
        />

        <button type="submit">Zarejestruj się </button>
      </form>
      <div className="login_footer">
        <span>
          Posiadasz już konto? <Link to="/Login">Zaloguj się </Link>
        </span>
      </div>
    </div>
  );
};

export default SignUp;
