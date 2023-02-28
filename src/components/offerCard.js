import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";

const OfferCard = ({ offer, onDeleteProp, token }) => {
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
        if (offer.liked_by.includes(token.user.id)) {
          setFavFlag(true);
        } else if (!offer.liked_by.includes(token.user.id)) {
          setFavFlag(false);
        }
      };

      checkFav();
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //Inicjalizacja daty
  const time = new Date();
  // FUNKCJA OBLICZAJĄCA CZAS OD DODANIA { KALKULACJA W MINUTACH}
  function timeCalc() {
    let createdTime =
      parseInt(offer.created_at.slice(0, 4)) * 8760 +
      parseInt(offer.created_at.slice(5, 7)) * 720 +
      parseInt(offer.created_at.slice(8, 10)) * 24;
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
    //console.log("call by handleFav " + offer.liked_by); wyswietlanie callbacka funkcji

    //console.log(token.user.id); // działą wyswietla user id

    if (favFlag === false && token.user) {
      let likeArr = offer.liked_by;
      likeArr.push(token.user.id);
      const { data, error } = await supabase
        .from("offers")
        .update({ liked_by: likeArr })
        .eq("id", offer.id)
        .select("liked_by");

      if (error) {
        console.log("error przy dodawniu fav");
      }
      if (data) {
        setFavFlag(true);
      }
      setFavFlag(!favFlag);
    } else if (favFlag === true && token.user) {
      let likeArr = offer.liked_by;
      let index = likeArr.indexOf(token.user.id);
      likeArr.splice(index, 1); // 2nd parameter means remove one item only
      const { data, error } = await supabase
        .from("offers")
        .update({ liked_by: likeArr })
        .eq("id", offer.id)
        .select("liked_by");

      if (error) {
        console.log("error przy usuwaniu fav");
      }
      if (data) {
        setFavFlag(false);
      }
    } else if (!token.user) {
      alert("you have to be logged ");
    }
  };

  // FUNKCJA USUWAJĄCA WPIS
  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("offers")
      .delete()
      .eq("id", offer.id) // przekazanne z Offecard  po destrukturyzacji
      .select();

    if (error) {
      console.log(error);
    }
    if (data) {
      console.log("usunieto wpis");
      onDeleteProp(offer.id);
    }
  };

  return (
    <div className="offers_card">
      <div className="offers_logo-div">
        <img
          className="offers_logo"
          src={offer.category_logo}
          alt="LOGO TEST"
        />
      </div>

      <div className="offers_main">
        <div>
          <h2>{offer.title.toUpperCase()}</h2>

          <span className="offers_main-company">
            <i className="material-icons helper-icon">work</i>
            {offer.company_name.toUpperCase()}
          </span>

          <div className="position-level">
            {offer.position_level.toUpperCase()}
          </div>
        </div>

        <div>
          <span className="offers_main-location">
            <i className="material-icons helper-icon">place</i>
            {offer.location}
          </span>
          <div className="offers_main-data">
            <p>{timeCalc()}</p>
          </div>
        </div>
      </div>

      <div className="offers_side">
        <div className="rating">
          <span>{offer.salary_low}</span>
          <span>-</span> <span>{offer.salary_top}</span> <span> PLN</span>
        </div>
        <div className="offers_side-open-helper">
          <Link className="offers_side-open" to={"/" + offer.id}>
            <i className="material-icons main-icon">arrow_forward_ios</i>
          </Link>
        </div>
        <div className="offers_side-buttons">
          {!token && <i className="material-icons main-icon"></i>}

          {offer.created_by === token.user.id && (
            <i className="material-icons main-icon" onClick={handleDelete}>
              delete
            </i>
          )}
          {offer.created_by === token.user.id && (
            <Link to={"/" + offer.id + "/edit"}>
              <i className="material-icons main-icon">edit</i>
            </Link>
          )}

          {token.user && (
            <div onClick={handleFav}>
              {favFlag && <i className="material-icons main-icon">star</i>}
              {!favFlag && (
                <i className="material-icons main-icon">star_border</i>
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

export default OfferCard; // export componentu na zewnątrz
