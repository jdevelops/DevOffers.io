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
  const [method, setMethod] = useState(""); // potencjalnie zmienić na recepie
  const [url, setUrl] = useState("");
  const [data, setData] = useState("");
  const [salary_low, setSalaryLow] = useState(0);
  const [salary_top, setSalaryTop] = useState(10);
  const [position_level, setPosition_Level] = useState("Mid");
  const [category_logo, setCategoryLogo] = useState("");
  const [fromError, setFormError] = useState(null);
  let recepie = method;

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
    const fetchSmoothie = async () => {
      const { data, error } = await supabase
        .from("smoothies") // pobranie z tabeli
        .select() // zwracanie daty
        .eq("id", id) //linijka odpowiedzialna za filtrowanie zwraca jeżeli kolumna "id" jest równa zmiennej id
        .single();

      if (error) {
        navigate("/", { replace: true }); // replace true zamienia ostatnia strone w histori na strone główną
      }
      if (data) {
        setTitle(data.title);
        setMethod(data.recepie);
        setUrl(data.link_url);
        setCompany_Name(data.company_name);
        setSalaryLow(data.salary_low);
        setSalaryTop(data.salary_top);
        setLocation(data.location);
        setPosition_Level(data.position_level);
        setCategoryLogo(data.category_logo);
        setData(data.created_at);
        console.log(data);
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
    fetchSmoothie(); // invoke funkcji na koniec parsowaniaHooka
  }, [id, navigate]);

  return (
    <div className="page offer-view">
      <div className="offer-view_wrapper">
        <div className="offer-view_header">
          <h2>{title.toUpperCase()}</h2>
        </div>
        <div className="offer-view_topsection">
          <div>
            {/*Style pożyczone ze smoothie card */}
            <p className="smoothies_main-company">
              <i className="material-icons offer-icon">business</i>
              {company_name.toUpperCase()}
            </p>
            <p className="smoothies_main-location">
              <i className="material-icons offer-icon">place</i>
              {location.toUpperCase()}
            </p>
            <p>Poziom stanowiska: {position_level}</p>
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
          <p>
            Text: {method}
            Laboris non pariatur nostrud amet reprehenderit culpa pariatur
            consectetur aliquip. Ullamco eu qui ipsum Lorem Lorem qui aliqua
            tempor ut ullamco occaecat amet non. Tempor velit id duis duis esse
            irure mollit. Ex fugiat exercitation qui qui eu deserunt proident
            Lorem. Duis esse incididunt tempor in occaecat pariatur sint
            officia. Sint eiusmod cillum minim deserunt fugiat eiusmod do
            ullamco non. Magna minim esse id laboris nostrud velit deserunt eu
            id dolore sit excepteur non. Nulla ex proident id dolore Lorem anim
            ipsum nostrud exercitation amet ea. Sit officia in laborum esse
            dolore cupidatat minim incididunt ad nulla. Id occaecat sint
            reprehenderit nulla. Aliquip occaecat veniam mollit ut cupidatat
            excepteur labore qui officia irure aute ipsum. Commodo est enim
            fugiat sunt. Cupidatat sint nulla amet pariatur cillum ullamco
            officia. Officia eu quis qui ullamco excepteur. Qui incididunt ipsum
            proident adipisicing consequat velit deserunt sit amet eu. Culpa
            duis eiusmod minim id labore velit laboris exercitation. Do anim
            enim nostrud eiusmod id sunt. Eu ut voluptate velit anim fugiat
            excepteur aliqua magna minim. Aute irure dolor exercitation dolor
            proident consectetur aute quis. Incididunt in exercitation fugiat
            aute occaecat ad. Irure sit Lorem mollit excepteur ipsum incididunt
            irure duis consequat non. Duis sint officia voluptate irure labore.
            Sunt cupidatat occaecat cillum aliqua Lorem duis excepteur ullamco
            enim.
          </p>
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
