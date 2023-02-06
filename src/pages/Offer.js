import { useParams, useNavigate } from "react-router-dom"; // pozwala na użycie Hooka useParam
import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";

const Offer = () => {
  const { id } = useParams(); // na podstawie routingu z app.js przyjmujemy paratmetr id który możemy użyć w obecnym komponencie jako obiekt
  const navigate = useNavigate();
  //Funkcja wywołana podczas załądowania componentu ma
  const [title, setTitle] = useState("");
  const [company_name, setCompany_Name] = useState("");
  const [method, setMethod] = useState(""); // potencjalnie zmienić na recepie
  const [url, setUrl] = useState("");
  const [salary_low, setSalaryLow] = useState(0);
  const [salary_top, setSalaryTop] = useState(10);
  const [position_level, setPosition_Level] = useState("Mid");
  const [category_logo, setCategoryLogo] = useState("");
  const [fromError, setFormError] = useState(null);
  let recepie = method;

  const redirectFoo = () => {
    window.open(url, "_blank");
  };

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
        setPosition_Level(data.position_level);
        setCategoryLogo(data.category_logo);
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
          <h2>{title}</h2>
        </div>

        <p>Firma: {company_name} </p>
        <p>Pozycja: {position_level}</p>
        <p>Text: {method}</p>

        <div>
          Widełki: {salary_low} - {salary_top}zł
        </div>
        <button onClick={redirectFoo}>APLIKUJ</button>
      </div>
    </div>
  );
};

export default Offer;
