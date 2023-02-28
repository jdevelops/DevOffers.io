import { useParams, useNavigate } from "react-router-dom"; // pozwala na użycie Hooka useParam
import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";

const Offer = () => {
  const { id } = useParams(); // na podstawie routingu z app.js przyjmujemy paratmetr id który możemy użyć w obecnym komponencie jako obiekt
  const navigate = useNavigate();
  //Funkcja wywołana podczas załądowania componentu ma
  const [title, setTitle] = useState("");
  const [company_name, setCompany_Name] = useState("");
  const [location, setLocation] = useState("");
  const [description, setMethod] = useState(""); // potencjalnie zmienić na recepie
  const [url, setUrl] = useState("");
  const [data, setData] = useState("");
  const [salary_low, setSalaryLow] = useState(0);
  const [salary_top, setSalaryTop] = useState(10);
  const [position_level, setPosition_Level] = useState("Mid");
  const [category_logo, setCategoryLogo] = useState("");
  const [fromError, setFormError] = useState(null);

  const redirectFoo = () => {
    window.open(url, "_blank");
  };

  //Inicjalizacja daty
  const time = new Date();
  // FUNKCJA OBLICZAJĄCA CZAS OD DODANIA { KALKULACJA W MINUTACH}
  function timeCalc() {
    let createdTime =
      parseInt(data.slice(0, 4)) * 8760 +
      parseInt(data.slice(5, 7)) * 720 +
      parseInt(data.slice(8, 10)) * 24;
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
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchOffers = async () => {
      const { data, error } = await supabase
        .from("offers") // pobranie z tabeli
        .select() // zwracanie daty
        .eq("id", id) //linijka odpowiedzialna za filtrowanie zwraca jeżeli kolumna "id" jest równa zmiennej id
        .single();

      if (error) {
        navigate("/", { replace: true }); // replace true zamienia ostatnia strone w histori na strone główną
      }
      if (data) {
        setTitle(data.title);
        setMethod(data.description);
        setUrl(data.link_url);
        setCompany_Name(data.company_name);
        setSalaryLow(data.salary_low);
        setSalaryTop(data.salary_top);
        setLocation(data.location);
        setPosition_Level(data.position_level);
        setCategoryLogo(data.category_logo);
        setData(data.created_at);
        //console.log(data);
      }
      /* MOZE ZOSTANIE UŻYTE
      function helperFoo(d, e) {
        if (d !== null) {
          console.log(d, e);
          console.log("data is not null");
        } else if (e !== null) {
          console.log(d, e);
          console.log("error is not null");
          navigate("/", { replace: true });
        } else {
          console.log(d, e);
          console.log("idk what happend");
        }
      }
      helperFoo(data, error);
      */
    };
    fetchOffers(); // invoke funkcji na koniec parsowaniaHooka
  }, [id, navigate]);

  return (
    <div className="page offer-view">
      <div className="offer-view_wrapper">
        <div className="offer-view_header">
          <h2>{title.toUpperCase()}</h2>
        </div>
        <div className="offer-view_topsection">
          <div>
            {/*Style pożyczone z card */}
            <p className="offer_main-company">
              <i className="material-icons offer-icon">business</i>
              {company_name.toUpperCase()}
            </p>
            <p className="offer_main-location">
              <i className="material-icons offer-icon">place</i>
              {location.toUpperCase()}
            </p>
            <p className="offer-view_level">Poziom: {position_level}</p>
          </div>
          <div>
            <p className="offer-view_time">{timeCalc()}</p>
            <p className="offer-view_salary">
              {salary_low} - {salary_top} PLN
            </p>
          </div>
        </div>
      </div>
      <div className="offer-view_wrapper">
        <div className="offer-view_header">
          <h2>OPIS STANOWISKA</h2>
        </div>
        <pre>
          <p>{description}</p>
        </pre>
        <div className="break"></div>
        <button className="update_btn" onClick={redirectFoo}>
          APLIKUJ
        </button>
      </div>
    </div>
  );
};

export default Offer;
