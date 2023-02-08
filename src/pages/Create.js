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
  const [salary_low, setSalaryLow] = useState("");
  const [salary_top, setSalaryTop] = useState("");
  const [url, setUrl] = useState("");
  const [location, setLocation] = useState("");
  const [position_level, setPosition_Level] = useState("Mid"); // zmienna przechowująca radio buttons state
  const [inputError, setInputError] = useState("false"); // zmienna obsługująca errory
  const [inputErrordsc, setInputErrordDsc] = useState(""); // zmiena zaiwerajaca opisy errorów
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
  //DEBUG SPRAWDZAJACY UUID DEPRECATED
  /*
  function checkID() {
    console.log("checkid");
    if (x === 2) {
      console.log("x == 2 ");
    }
    console.log(" po ifie ");
    const funkcjaTest = () => {
      if (x === 1) {
        return 1;
      } else {
        return 2;
      }
    };
    if (funkcjaTest() === 1) {
      console.log("funkcja test zwraca jeden");
      console.log(funkcjaTest());
    } else {
      console.log("funkcja test zwraca inna liczbe");
      console.log(funkcjaTest());
    }
  }
*/
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
    created_by = user.id;

    const submitValidation = () => {
      //walidacja danych
      setInputError("false");
      setInputErrordDsc("");

      //sprawdzanie tytułu
      if (!title || title.length >= 100) {
        alert("Sprawdź poprawność formularza");
        console.log("called");
        setInputError("title");
        setInputErrordDsc(
          "Upewnij się że został wprowadzony tytuł oraz jest on krótszy niż 100 znaków "
        );
        return 0;
      }
      //sprawdzanie Firmy
      if (!company_name || company_name.length >= 80) {
        alert("Sprawdź poprawność formularza");
        setInputError("company_name");
        setInputErrordDsc(
          "Upewnij się że została wprowadzona nazwa firmy oraz jest ona krótsza niż 80 znaków "
        );
        return 0;
      }
      //sprawdzanie Miesjsca pracy
      if (!location || location.length >= 128) {
        alert("Błąd, sprawdź poprawność formularza");
        setInputError("location");
        setInputErrordDsc(
          "Upewnij się że została wprowadzona miejscowość zatrudnia"
        );
        return 0;
      }
      //sprawdzanie widełek
      if (salary_low > salary_top || salary_low <= 0 || salary_top <= 0) {
        console.log(salary_low > salary_top);
        console.log(salary_low <= 0);
        console.log(salary_top <= 0);
        console.log(salary_low);
        console.log(typeof salary_top);
        alert("Sprawdź poprawność formularza");
        setInputError("salary");
        setInputErrordDsc(
          "Upewnij się że wprowadzone widełki są prawidłowe oraz większe od zera "
        );
        return 0;
      }
      //sprawdzanie texztarea
      if (!method || method.length <= 40 || method.length >= 2500) {
        alert("Sprawdź poprawność formularza");
        setInputError("method");
        setInputErrordDsc(
          "Upewnij się że opis jest wprowadzony i zawiera przynajmniej 40 znaków "
        );
        return 0;
      }
      //sprawdzanie linku
      if (
        !link_url ||
        (link_url.startsWith("https://") === false &&
          link_url.startsWith("http://") === false) ||
        link_url.length >= 1000
      ) {
        alert("Sprawdź poprawność formularza");
        setInputError("link");
        setInputErrordDsc(
          "Proszę wprowadzić pełny link zaczynający się od http:// lub https:// "
        );
        return 0;
      } else {
        return 1;
      }
    };

    if (submitValidation() === 1) {
      console.log("debug");
      // wywołanie funkcji w ifie
      const { data, error } = await supabase
        .from("smoothies") // wyszukuje z supabase tabli o nazwie "smoothies"
        .insert([
          {
            title,
            company_name,
            category,
            category_logo,
            recepie,
            location,
            created_by,
            link_url,
            position_level,
            salary_low,
            salary_top,
          },
        ])
        .select();

      // wprowadza do tabeli tablice z obiektami, każdy obiekt to jedna linijka w tabeli
      if (data) {
        alert("Dodano ogłoszenie ");
        navigate("/");
      }
      if (error) {
        console.log("Error po stronie Supabase");
        console.log(error);
      }
    }
  };

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

  // funkcja obługująca submit formularza, async ponieważ w środku będziemy używać awaita i promisa
  return (
    <div className="page update">
      <h1 className="update__title">NOWA OFERTA</h1>
      <form className="update_form" onSubmit={handleSubmit}>
        {/* wstawić onSubmit={handleSubmit} */}
        <label htmlFor="title">Tytuł: </label>{" "}
        <span className="error_dsc">
          {inputError === "title" ? inputErrordsc : ""}
        </span>
        {/* to tworzy label który jest wyświetlany na stronie  */}
        <input
          className={inputError === "title" ? "error_border" : ""}
          type="text"
          id="title"
          value={title /* wartość inputu przechowywana w Hooku useState*/}
          onChange={(e) => {
            setTitle(e.target.value);
            setInputError("");
            setInputErrordDsc("");
          }}
          placeholder="np. Java Fullstack Developer"
        />
        {/* Reactowy event handler który reaguje w momencie zmiany value danego elementu, w tym wypadku input*/}
        <span>Katergoria:</span>
        <Select
          placeholder="Wybierz kategorie..."
          options={options}
          className="update_select"
          onChange={handleChange}
        />
        <label htmlFor="company_name">Firma zatrudniająca:</label>
        <span className="error_dsc">
          {inputError === "company_name" ? inputErrordsc : ""}
        </span>
        <input
          className={inputError === "company_name" ? "error_border" : ""}
          type="text"
          id="company_name"
          value={company_name}
          onChange={(e) => {
            setCompany_Name(e.target.value);
            setInputError("");
            setInputErrordDsc("");
          }}
          placeholder="CD Project Red"
        />
        <label htmlFor="location">Miejscowość Firmy/Zatrudnienia:</label>
        <span className="error_dsc">
          {inputError === "location" ? inputErrordsc : ""}
        </span>
        <input
          className={inputError === "location" ? "error_border" : ""}
          type="text"
          id="location"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setInputError("");
            setInputErrordDsc("");
          }}
          placeholder="Warszawa"
        />
        <div>
          <h3>Poziom Stanowiska</h3>
          <div className="update_radios">
            <div>
              <label htmlFor="staż">Intern</label>
              <input
                type="radio"
                name="position_level"
                value="intern"
                id="staż"
                checked={position_level === "intern"}
                onChange={onOptionChange}
              />
            </div>
            <div>
              <label htmlFor="junior">Junior</label>
              <input
                type="radio"
                name="position_level"
                id="junior"
                value="Junior"
                checked={position_level === "Junior"}
                onChange={onOptionChange}
              />
            </div>
            <div>
              <label htmlFor="mid">Mid</label>
              <input
                type="radio"
                name="position_level"
                id="mid"
                value="Mid"
                checked={position_level === "Mid"}
                onChange={onOptionChange}
              />
            </div>
            <div>
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
          </div>
        </div>
        <h3>Zarobki</h3>
        <span className="error_dsc">
          {inputError === "salary" ? inputErrordsc : ""}
        </span>
        <div className="update_salary">
          <div>
            <label htmlFor="salaryLow">Od:</label>
            <input
              className={inputError === "salary" ? "error_border" : ""}
              type="number"
              id="salaryLow"
              value={salary_low}
              onChange={(e) => {
                setSalaryLow(parseInt(e.target.value));
                setInputError("");
                setInputErrordDsc("");
              }}
            />
            PLN
          </div>
          <div>
            <label htmlFor="salaryTop">Do:</label>
            <input
              className={inputError === "salary" ? "error_border" : ""}
              type="number"
              id="salaryTop"
              value={salary_top}
              onChange={(e) => {
                setSalaryTop(parseInt(e.target.value));
                setInputError("");
                setInputErrordDsc("");
              }}
            />
            PLN
          </div>
        </div>
        <label htmlFor="method">Opis:</label>
        <span className="error_dsc">
          {inputError === "method" ? inputErrordsc : ""}
        </span>
        <textarea
          rows="20"
          className={
            inputError === "method"
              ? "update_textarea error_border"
              : "update_textarea"
          }
          id="method"
          value={method}
          onChange={(e) => {
            setMethod(e.target.value);
            setInputError("");
            setInputErrordDsc("");
          }}
          placeholder="Opis Stanowiska"
        />
        <label htmlFor="url">Link do Formularza zgłoszeniowego</label>
        <span className="error_dsc">
          {inputError === "link" ? inputErrordsc : ""}
        </span>
        <input
          className={inputError === "link" ? "error_border" : ""}
          type="text"
          id="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setInputError("");
            setInputErrordDsc("");
          }}
          placeholder="https://twojastrona.pl"
        />
        <button>Zatwierdź </button>
        {/*linijka pozwalająca wyrzucić error zamiast formularza, warunek if formError === true*/}
      </form>
    </div>
  );
};

export default Create;
