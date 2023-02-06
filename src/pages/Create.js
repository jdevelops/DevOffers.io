import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import React from "react";
import Select from "react-select";

const Create = () => {
  const navigate = useNavigate(); //  Hook reacta pozwalający na przekierowanie użytkownika na inna strone zgodnie z routerem
  const [title, setTitle] = useState("");
  const [company_name, setCompany_Name] = useState("");
  const [method, setMethod] = useState(""); // potencjalnie zmienić na recepie
  const [salary_low, setSalaryLow] = useState(0);
  const [salary_top, setSalaryTop] = useState(10);
  const [url, setUrl] = useState("");
  const [position_level, setPosition_Level] = useState("Mid"); // zmienna przechowująca radio buttons state
  const [fromError, setFormError] = useState(null);

  let recepie = method; // zmienone aby zgadzała się nazwa z tablica
  let created_by; // zmienone aby zgadzała się nazwa z tablica, w tabeli jest created_by
  let link_url = url; // zmienone aby zgadzała się nazwa z tablica

  ///REACT SELECT
  const [category, setCategory] = useState("");
  const [category_logo, setCategoryLogo] = useState("");
  const options = [
    { value: "admin", label: "Admin" },
    { value: "analytics", label: "Analytics" },
    { value: "cplus", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "devops", label: "Devops" },
    { value: "java", label: "Java" },
    { value: "javascript", label: "Javascript" },
    { value: "mobile", label: "Mobile" },
    { value: "php", label: "php" },
    { value: "pm", label: "PM" },
    { value: "python", label: "Python" },
    { value: "ruby", label: "Ruby" },
    { value: "sql", label: "SQL" },
    { value: "tester", label: "Teseting" },
    { value: "ui", label: "UX/UI" },
  ];

  const handleChange = (selectedOption) => {
    setCategory(selectedOption.value);
    let string =
      "https://lzjwjilirbqiypntnadj.supabase.co/storage/v1/object/public/logos/" +
      selectedOption.value +
      ".webp";
    setCategoryLogo(string);
  };
  ////////
  //DEBUG SPRAWDZAJACY UUID
  async function checkID() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user.id);
  }

  // RADIO INNPUT FOO
  const onOptionChange = (e) => {
    setPosition_Level(e.target.value);
  };

  // Submit formularza
  const handleSubmit = async (e) => {
    e.preventDefault(); // linijka zapobiegająca reloadowi strony

    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user.id); // testowo
    created_by = user.id;

    if (!title || !method || !salary_low || !salary_top) {
      /* !title oznacza if title === null or reszta */
      setFormError("Please fill all fields ");

      return;
    }

    const { data, error } = await supabase
      .from("smoothies") // wyszukuje z supabase tabli o nazwie "smoothies"
      .insert([
        {
          title,
          company_name,
          category,
          category_logo,
          recepie,
          created_by,
          link_url,
          position_level,
          salary_low,
          salary_top,
        },
      ])
      .select(); // wprowadza do tabeli tablice z obiektami, każdy obiekt to jedna linijka w tabeli

    function helperFoo(d, e) {
      if (d !== null) {
        console.log(d, e);
        console.log("data is not null");
        setFormError(null); // resetujemy error
        navigate("/"); // NIE DZIAŁA
      } else if (e !== null) {
        console.log(d, e);
        console.log("error is not null");
      } else {
        console.log(d, e);
        console.log("idk what happend");
      }
    }

    helperFoo(data, error);
    /* CAŁA TA SEKCJA NIE DZIAŁA Z JAKIEGOŚ POWODU, PRZENIESIONE DO FUNKCJI POMOCNICZNEJ 
    if (error !== null) {
      // jeżelei w obieckie wystąpi error
      console.log(error);
      setFormError("Please fill all fields 2");
    }
    if (data) {
      // jeżelei w obieckie wystąpi data, data- zwraca zawartość przesłaną za pomocną await supabase
      navigate("./");
      console.log(data);
      setFormError(null); // resetujemy error
      navigate("./"); // prekierowanie użytkoiwnika na stronę główną po ścieżce ./
    }
    navigate("./");
 */
    // insert musi zgadzać się z nazwami kolumn w tabeli oraz z nazwami zmiennych w komponencie

    //console.log(title, method, rating);
  };
  // funkcja obługująca submit formularza, async ponieważ w środku będziemy używać awaita i promisa
  return (
    <div className="page create">
      <h2>NOWE OGŁOSZENIE</h2>
      <button onClick={() => {}}></button>
      <form onSubmit={handleSubmit}>
        {/* wstawić onSubmit={handleSubmit} */}
        <label htmlFor="title">Tytuł: </label>
        {/* to tworzy label który jest wyświetlany na stronie  */}
        <input
          type="text"
          id="title"
          value={title /* wartość inputu przechowywana w Hooku useState*/}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="np. Java Fullstack Developer"
        />
        {/* Reactowy event handler który reaguje w momencie zmiany value danego elementu, w tym wypadku input*/}
        <span>Katergoria:</span>
        <Select
          options={options}
          className="create_select"
          onChange={handleChange}
        />
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
          placeholder="Opis Stanowiska"
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
        <button>Zatwierdź </button>
        {fromError && <p className="error">{fromError} kkk</p>}{" "}
        {/*linijka pozwalająca wyrzucić error zamiast formularza, warunek if formError === true*/}
      </form>

      <button onClick={checkID}>Check uuid</button>
    </div>
  );
};

export default Create;
