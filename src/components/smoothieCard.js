import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";

const SmoothieCard = ({ smoothie, onDeleteProp, token }) => {
  const [favFlag, setFavFlag] = useState(true); // PAMIETAĆ O RÓZNICY MIEDZY WYSWETILANYM STANEM A FALGA W SKRYPCIE
  // USER WIDZI PUSTA GWIAZDKE -> PO KLIKNIECIU DODA DO ULUBIONY
  // UI WYSTWIETLA OBECNY STAN
  // destrukturyzacja, Zawartość obietu otrzymujemy z propa z Home.js

  //zabezpieczenie przed dostępem bez tokenu
  if (!token) {
    token = {
      user: "",
    };
  }

  //useEffect sprawdza polubienia
  useEffect(() => {
    if (token) {
      const checkFav = () => {
        if (smoothie.liked_by.includes(token.user.id)) {
          setFavFlag(true);
          console.log("zawiera id");
          console.log(smoothie.liked_by);
          console.log("flaga :" + favFlag);
        } else if (!smoothie.liked_by.includes(token.user.id)) {
          setFavFlag(false);
          console.log("nie zawiera id");
        }
      };

      checkFav();
    } else {
    }
  }, []);
  //Inicjalizacja daty
  const time = new Date();
  // FUNKCJA OBLICZAJĄCA CZAS OD DODANIA { KALKULACJA W MINUTACH}
  function timeCalc() {
    let createdTime =
      parseInt(smoothie.created_at.slice(0, 4)) * 8760 +
      parseInt(smoothie.created_at.slice(5, 7)) * 720 +
      parseInt(smoothie.created_at.slice(8, 10)) * 24;
    let currentTime =
      time.getFullYear() * 8760 +
      (time.getMonth() + 1) * 720 +
      time.getDate() * 24;
    //funkcja zwraca skonfigurowanego strniga
    let timeDif = currentTime - createdTime;
    let outputValue;

    if (timeDif <= 48) {
      outputValue = "NOWE";
    } else if (timeDif > 48) {
      outputValue = "DODANO " + timeDif / 24 + " DNI TEMU";
    } else {
      outputValue = "error";
    }
    return outputValue;
  }

  // FUNKCJA LIKE
  const handleFav = async () => {
    console.log("call by handleFav " + smoothie.liked_by);

    //console.log(token.user.id); // działą wyswietla user id

    if (favFlag === false && token.user) {
      let likeArr = smoothie.liked_by;
      likeArr.push(token.user.id);
      const { data, error } = await supabase
        .from("smoothies")
        .update({ liked_by: likeArr })
        .eq("id", smoothie.id)
        .select("liked_by");

      if (error) {
        console.log("error przy dodawniu fav");
      }
      if (data) {
        console.log("updated fav");
        console.log(smoothie.liked_by);
        setFavFlag(true);
      }
      setFavFlag(!favFlag);
    } else if (favFlag === true && token.user) {
      let likeArr = smoothie.liked_by;
      let index = likeArr.indexOf(token.user.id);
      likeArr.splice(index, 1); // 2nd parameter means remove one item only
      const { data, error } = await supabase
        .from("smoothies")
        .update({ liked_by: likeArr })
        .eq("id", smoothie.id)
        .select("liked_by");

      if (error) {
        console.log("error przy usuwaniu fav");
      }
      if (data) {
        console.log("usunieto");
        console.log(smoothie.liked_by);
        setFavFlag(false);
      }
    } else if (!token.user) {
      alert("you have to be logged ");
    }
  };

  // FUNKCJA USUWAJĄCA WPIS
  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("smoothies")
      .delete()
      .eq("id", smoothie.id) // przekazanne z SmoothieCard po destrukturyzacji
      .select();

    if (error) {
      console.log(error);
    }
    if (data) {
      console.log("usunieto wpis");
      console.log(data);
      onDeleteProp(smoothie.id);
    }
  };

  return (
    <div className="smoothies_card">
      <div className="smoothies_logo-div">
        <img
          className="smoothies_logo"
          src={smoothie.category_logo}
          alt="LOGO TEST"
        />
      </div>

      <div className="smoothies_main">
        <div>
          <h2>{smoothie.title.toUpperCase()}</h2>

          <span className="smoothies_main-company">
            <i className="material-icons helper-icon">work</i>
            {smoothie.company_name.toUpperCase()}
          </span>

          <div className="position-level">
            {smoothie.position_level.toUpperCase()}
          </div>
        </div>

        <div>
          <span className="smoothies_main-location">
            <i className="material-icons helper-icon">place</i>
            {smoothie.location}
          </span>
          <div className="smoothies_main-data">
            <p>{timeCalc()}</p>
          </div>
        </div>
      </div>

      <div className="smoothies_side">
        <div className="rating">
          <span>{smoothie.salary_low}</span>
          <span>-</span> <span>{smoothie.salary_top}</span> <span> PLN</span>
        </div>
        <div className="smoothies_side-open-helper">
          <Link className="smoothies_side-open" to={"/" + smoothie.id}>
            <i className="material-icons main-icon">arrow_forward_ios</i>
          </Link>
        </div>
        <div className="smoothies_side-buttons">
          {!token && <i className="material-icons main-icon"></i>}

          {smoothie.created_by === token.user.id && (
            <i className="material-icons main-icon" onClick={handleDelete}>
              delete
            </i>
          )}
          {smoothie.created_by === token.user.id && (
            <Link to={"/" + smoothie.id + "/edit"}>
              <i className="material-icons main-icon">edit</i>
            </Link>
          )}

          {token.user && (
            <div onClick={handleFav}>
              {favFlag && (
                <i onClick={handleFav} className="material-icons main-icon">
                  star
                </i>
              )}
              {!favFlag && (
                <i onClick={handleFav} className="material-icons main-icon">
                  star_border
                </i>
              )}
            </div>
          )}
          {!token.user && (
            <div disabled="disabled">
              {favFlag && <i className="material-icons main-icon">star</i>}
              {!favFlag && (
                <i className="material-icons main-icon ">star_border</i>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  ); //return zwraca template
};

export default SmoothieCard; // export componentu na zewnątrz

// WYŚTWIETLANIE TEKSTU W MAŁEJ OFERCIE
// <p>{smoothie.recepie}</p>
