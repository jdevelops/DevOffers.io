import React from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Homepage = ({ token }) => {
  const [createDate, setCreateDate] = useState("");
  const [email, setEmail] = useState("");
  let navigate = useNavigate();

  const profilInfo = () => {
    setCreateDate(token.user.created_at.substring(0, 10));
    let emailArr = token.user.email.split("");
    for (let i = 0; i < 5; i++) {
      emailArr[i + 3] = "*";
    }
    let x = emailArr.join("");
    setEmail(x);
  };
  //funkcja sprawdzajaca id przy ponownym fetchu
  async function checkID() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    //console.log(user);
    console.log(email);
  }

  //funkcja logout
  function handleLogout() {
    sessionStorage.removeItem("token");
    supabase.auth.signOut();
    token = false;
    navigate("/", { token });
    window.location.reload(true);
  }

  useEffect(() => {
    profilInfo();
  }, []);
  return (
    <div className="page">
      <h1 className="login__title">Profil</h1>
      <div className="profile_card">
        <img
          className="profile_img"
          src="https://lzjwjilirbqiypntnadj.supabase.co/storage/v1/object/public/logos/user.webp"
          alt="profile_picture"
        />
        <h3>Witaj, {token.user.user_metadata.full_name}</h3>
        <ul>
          <li>Profil utworzono: {createDate}</li>
          <li>Adres mailowy: {email}</li>
        </ul>
        <div className="profile_footer">
          <button className="hidden" onClick={checkID}>
            Check uuid
          </button>
          <Link to="/CreatedOffers">Twoje oferty</Link>

          <button onClick={handleLogout}>Wyloguj się</button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
