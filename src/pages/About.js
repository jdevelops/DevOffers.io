import React from "react";

const About = () => {
  return (
    <div className="page about">
      <h1 className="">O Projekcie</h1>
      <p>
        Devoffers.io jest aplikacją webową, która działa jako tablica ogłoszeń
        pracy z branży IT. Umożliwia ona prosty kontakt z firmami oferującymi
        wakaty na stanowiskach z działu IT, jak również darmowe i proste
        umieszczenie ofert pracy, dla firm poszukujących nowych pracowników.
      </p>

      <h2>Wykorzystane Technologie</h2>
      <ul>
        <h3>Frontend</h3>
        <li>Javascript - W technologi ES6+</li>
        <li>React - wersja 18.2 Biblioteka (Framework) języka Javascript</li>
        <li>react-router-dom: 6.3.0</li>
        <li>react-scripts: 5.0.1</li>
        <li>react-select: 5.7.0</li>
        <li>Css</li>

        <h3>Backend</h3>
        <li>
          Supabase — Kompleksowy zestaw narzędzi do tworzenia i wdrażania
          aplikacji oraz gier mobilnych, bazującym na usługach chmurowych
        </li>
        <h4>Dodatkowe zasoby</h4>
        <li>
          Ikony kategorii -
          <a href="https://www.flaticon.com/free-icons/php" title="php icons">
            Php icons created by Nadiinko - Flaticon
          </a>
        </li>
        <li>
          ico file -
          <a
            href="https://www.flaticon.com/free-icons/letter-d"
            title="letter d icons"
          >
            Letter d icons created by moniruldislam - Flaticon
          </a>
        </li>
      </ul>
      <br />
      <br />
      <h4>Kontakt </h4>
      <p>
        Jeśli potrzebujesz pomocy, skontaktuj się z administratorem:
        kontakt@Devoffers.pl
      </p>
    </div>
  );
};

export default About;
