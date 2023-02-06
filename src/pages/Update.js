import { useParams, useNavigate } from "react-router-dom"; // pozwala na użycie Hooka useParam
import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";

const Update = () => {
  const { id } = useParams(); // na podstawie routingu z app.js przyjmujemy paratmetr id który możemy użyć w obecnym komponencie jako obiekt
  const navigate = useNavigate();
  //Funkcja wywołana podczas załądowania componentu ma

  const [title, setTitle] = useState("");
  const [company_name, setCompany_Name] = useState("");
  const [method, setMethod] = useState(""); // potencjalnie zmienić na recepie
  const [salary_low, setSalaryLow] = useState(0);
  const [salary_top, setSalaryTop] = useState(10);
  const [position_level, setPosition_Level] = useState("Mid");
  const [url, setUrl] = useState("");
  const [fromError, setFormError] = useState();
  let recepie = method;
  let link_url = url;
  // UPDATE formularza

  // RADIO INNPUT FOO
  const onOptionChange = (e) => {
    setPosition_Level(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !method || !salary_low || !salary_top) {
      /* !title oznacza if title === null or reszta */
      setFormError("Please fill all fields ");
      return;
    }

    const { data, error } = await supabase
      .from("smoothies")
      .update({
        title,
        company_name,
        recepie,
        link_url,
        position_level,
        salary_low,
        salary_top,
      })
      .eq("id", id)
      .select();

    if (error) {
      setFormError("Please fill all fields  thrown by handleSubmit()");
      console.log(error);
    }
    if (data) {
      setFormError("null");
      navigate("/");
    }
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
        setCompany_Name(data.company_name);
        setMethod(data.recepie);
        setUrl(data.link_url);
        setPosition_Level(data.position_level);
        setSalaryLow(data.salary_low);
        setSalaryTop(data.salary_top);
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
    <div className="page update">
      <h2>ZAKTUALIZUJ OGŁOSZENIE</h2>
      <form onSubmit={handleSubmit}>
        {/* wstawić onSubmit={handleSubmit} */}
        <label htmlFor="title">Tytuł: </label>{" "}
        {/* to tworzy label który jest wyświetlany na stronie  */}
        <input
          type="text"
          id="title"
          value={title /* wartość inputu przechowywana w Hooku useState*/}
          onChange={(e) => setTitle(e.target.value)}
        />
        {/* Reactowy event handler który reaguje w momencie zmiany value danego elementu, w tym wypadku input*/}
        <label htmlFor="company_name">Firma:</label>
        <input
          type="text"
          id="company_name"
          value={company_name}
          onChange={(e) => setCompany_Name(e.target.value)}
          placeholder="CD Project Red"
        />
        <label htmlFor="method">Opis:</label>
        <textarea
          id="method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        />
        <div>
          <h3>Wybierz poziom stanowiska</h3>

          <label htmlFor="staż">stażysta</label>
          <input
            type="radio"
            name="position_level"
            value="intern"
            id="staż"
            checked={position_level === "intern"}
            onChange={onOptionChange}
          />

          <label htmlFor="junior">Junior</label>
          <input
            type="radio"
            name="position_level"
            id="junior"
            value="Junior"
            checked={position_level === "Junior"}
            onChange={onOptionChange}
          />

          <label htmlFor="mid">Mid</label>
          <input
            type="radio"
            name="position_level"
            id="mid"
            value="Mid"
            checked={position_level === "Mid"}
            onChange={onOptionChange}
          />

          <label htmlFor="senior">Senior</label>
          <input
            type="radio"
            name="position_level"
            id="senior"
            value="Senior"
            checked={position_level === "Senior"}
            onChange={onOptionChange}
          />
        </div>
        <h3>Zarobki</h3>
        <div className="salary-div">
          <label htmlFor="salaryLow">Od:</label>
          <input
            type="number"
            id="salaryLow"
            value={salary_low}
            onChange={(e) => setSalaryLow(e.target.value)}
          />
          <label htmlFor="salaryTop">Do:</label>
          <input
            type="number"
            id="salaryTop"
            value={salary_top}
            onChange={(e) => setSalaryTop(e.target.value)}
          />
        </div>
        <label htmlFor="url">Link do Formularza zgłoszeniowego</label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://twojastrona.pl"
        />
        <button>Zaktualizuj </button>
        {fromError && <p className="error">{fromError}</p>}{" "}
        {/*linijka pozwalająca wyrzucić error zamiast formularza, warunek if formError === true*/}
      </form>
    </div>
  );
};

export default Update;
