/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";

// components

import SmoothieCard from "../components/smoothieCard";

const CreatedOffers = ({ token }) => {
  const [fetchError, setFetchError] = useState(null); // Fetch error, zmienna
  const [smoothies, setSmoothies] = useState(null); // główna baza
  const [orderBy, setOrderBy] = useState("created_at"); // created_at jest nazwa kolumny w bazie
  const [orderLocaly, setOrderLocaly] = useState("Sortowanie ");
  const [orderAscd, setOrderAscd] = useState(true);
  const [foundUsers, setFoundUsers] = useState("");
  const [query, setQuery] = useState("");
  let zmiennaEffect = "none";

  //Funkcja usuwająca wpis lokalnie
  const handleDelete = (id) => {
    setSmoothies((pervSmoothies) => {
      return pervSmoothies.filter((sm) => sm.id !== id);
    });
  };
  //Funcjka sortująca
  function handleSortEffect(e) {
    console.log(e.target.id);
    //setSortEffect(e.target.id);
    zmiennaEffect = e.target.id;
    switch (zmiennaEffect) {
      case "az":
        console.log(e.target);
        e.target.classList.add("searchbar--active");
        break;
      case "data":
        e.target.classList.add("searchbar--active");
        break;
      case "salary":
        e.target.classList.add("searchbar--active");
        break;
      default:
        console.log("none1");
    }
  }

  //funkcja fetchujaca dane z database
  useEffect(() => {
    const fetchSmoothies = async () => {
      const { data, error } = await supabase
        .from("smoothies")
        .select()
        .order(orderBy, { ascending: false }); // const { data, error } -> destrukturyzacja obiektu po lewej

      if (error) {
        setFetchError("Can;t fetch ");
        setSmoothies(null);
        console.log(error);
      }
      if (data) {
        setSmoothies(data);
        setFetchError(null);
        console.log("POBRANO");
      }
    };

    fetchSmoothies();
  }, []); //[orderBy] powoduje wywołanie Hooka useEffect za każdym użyciem orderby // brak tylko pojedyncze wywołanie

  return (
    <div className="page home">
      <h1>TWOJE OFERTY</h1>
      {fetchError && <p>{fetchError}</p>}
      {smoothies && (
        <div className="smoothies">
          {/*Search/sort bar */}
          <div className="searchbar">
            {/*Search input */}
            <div className="searchbar_search">
              <input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="WYSZUKAJ"
              />
            </div>

            {/*OPCJE SORTOWANIA  */}
            <div className="searchbar_sort">
              <button
                id="data"
                onClick={(obj) => {
                  handleSortEffect(obj);
                  smoothies.sort(function (a, b) {
                    const dateA = a.created_at;
                    const dateB = b.created_at;
                    if (dateA > dateB) {
                      return -1;
                    }
                    if (dateA < dateB) {
                      return 1;
                    }
                    return 0;
                  });
                  if (orderAscd) {
                    setSmoothies(smoothies.reverse());
                    setOrderLocaly("Najstarsze najpierw ");
                    setOrderAscd(!orderAscd);
                  } else if (!orderAscd) {
                    setOrderLocaly("Najnowsze najpierw");
                    setSmoothies(smoothies);
                    setOrderAscd(!orderAscd);
                  }
                }}
              >
                DATA
              </button>

              <button
                id="az"
                onClick={(obj) => {
                  handleSortEffect(obj);
                  smoothies.sort(function (a, b) {
                    const nameA = a.title.toUpperCase(); // ignore upper and lowercase
                    const nameB = b.title.toUpperCase(); // ignore upper and lowercase
                    if (nameA > nameB) {
                      return -1;
                    }
                    if (nameA < nameB) {
                      return 1;
                    }
                    // names must be equal
                    return 0;
                  });
                  if (orderAscd) {
                    setSmoothies(smoothies.reverse());
                    setOrderLocaly("Alfabetycznie rosnoąco");
                    setOrderAscd(!orderAscd);
                  } else if (!orderAscd) {
                    setOrderLocaly("Alfabetycznie malejąco");
                    setSmoothies(smoothies);
                    setOrderAscd(!orderAscd);
                  }
                }}
              >
                A-Z
              </button>
              <button
                id="salary"
                onClick={(obj) => {
                  handleSortEffect(obj);
                  smoothies.sort(function (a, b) {
                    const salaryRangeA = (a.salary_low + a.salary_top) / 2;
                    const salaryRangeB = (b.salary_low + b.salary_top) / 2;
                    if (salaryRangeA < salaryRangeB) {
                      return 1;
                    }
                    if (salaryRangeA > salaryRangeB) {
                      return -1;
                    }
                    return 0;
                  });
                  if (orderAscd) {
                    setSmoothies(smoothies.reverse());
                    setOrderLocaly("widełki rosnoąco");
                    setOrderAscd(!orderAscd);
                  } else if (!orderAscd) {
                    setSmoothies(smoothies);
                    setOrderLocaly("widełki malejąco");
                    setOrderAscd(!orderAscd);
                  }
                }}
              >
                STAWKA
              </button>
              <p className="searchbar_dsc">Obecne sortowanie: {orderLocaly}</p>
            </div>
          </div>
          {/*WYSWIETLANIE POSTÓW Z FILTREM I SORTOWANIEM  */}
          <div className="smoothies_list">
            {smoothies
              .filter((post) => {
                if (query === "") {
                  return post;
                } else if (
                  post.title.toLowerCase().includes(query.toLowerCase())
                ) {
                  return post;
                }
              })
              .map((post) => {
                if (post.created_by === token.user.id) {
                  return (
                    <SmoothieCard
                      key={post.id}
                      smoothie={post}
                      onDeleteProp={handleDelete}
                      token={token}
                    />
                  );
                }
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatedOffers;
/*  INSERT IN 219 LINE IF YOU WANT TO BACKUP OLD SHOW METHOD 

          <div className="smoothie-grid">
            {smoothies.map((smoothie) => (
              //<p>{smoothie.title}</p> //
              <SmoothieCard
                key={smoothie.id}
                smoothie={smoothie}
                onDeleteProp={handleDelete}
              /> //smoothie={smoothie} -> smoothie jest to prop do którego przekazujemy zmienna smoothie tak jak w Svelte
            ))}
          </div>


*/

/*     SHOW FOO 

<div className="smoothie-grid">
            foo2
            {foundUsers && foundUsers.length > 0 ? (
              foundUsers.map((foundSmoothies) => {
                if (foundSmoothies.created_by === token.user.id) {
                  return (
                    <SmoothieCard
                      key={foundSmoothies.id}
                      smoothie={foundSmoothies}
                      onDeleteProp={handleDelete}
                      token={token}
                    />
                  );
                }
              })
            ) : (
              <h1>Nic nie znaleziono </h1>
            )}
            ;
          </div> */

/*  SHOW FOO V3
          <div className="smoothie-grid">
            foo3
            {smoothies.map((smoothie) => {
              if (smoothie.created_by === token.user.id) {
                return (
                  <SmoothieCard
                    key={smoothie.id}
                    smoothie={smoothie}
                    onDeleteProp={handleDelete}
                  />
                );
              }
            })}
          </div> */
/*        FILTER WITH FETCH /// SCRAP THAT 
          <div className="order-by">
            <p>Order by:</p>
            <button onClick={() => setOrderBy("created_at")}>
              Time Created
            </button>
            <button onClick={() => setOrderBy("title")}>Title</button>
            <button onClick={() => setOrderBy("rating")}>rating</button>
            {orderBy}
          </div>
          */

/*PIERWOWZÓR SEARCH BARA
                        <div className="user-list">
              {foundUsers && foundUsers.length > 0 ? (
                foundUsers.map((smoothies) => (
                  <li key={smoothies.id} className="user">
                    <span className="user-id">{smoothies.id}</span>
                    <span className="user-name">{smoothies.title}</span>
                  </li>
                ))
              ) : (
                <h1>No results found!</h1>
              )}
            </div>
            */

/*V2 SEARCH BAR
          
           <div>
            SEARCH:
            <input
              type="search"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                filter();
              }}
              className="input"
              placeholder="Filter"
            />
          </div>
          */

//FUNKCJA FILTRUJACA V1
/*
  const filter = () => {
    console.log("e target z filtr foo");

    if (name !== "") {
      console.log(smoothies);
      const results = smoothies.filter((user) => {
        return user.title.toLowerCase().includes(name.toLowerCase());
        // Use the toLowerCase() method to make it case-insensitive
      });
      setFoundUsers(results);
    } else {
      setFoundUsers(smoothies);
      // If the text field is empty, show all users
    }
  };
  */
/*POMOCNY DEBUG  

            <div className="debug">
            <button
              onClick={() => {
                console.log(smoothies);
                console.log("CONSOL LOG DO WYŚWEITLANIA WARUNKOWEGO ");
              }}
            >
              DEBUG
            </button>
          </div>

*/

/*             {/*KIERUNEK SORTOWANIA SCRAP*
            
                        {orderDirectionAscd && (
              <div>
                Ascnding true
                <button
                  onClick={() => setOrderDirectionAscd(!orderDirectionAscd)}
                >
                  {<i className="material-icons">arrow_drop_up</i>}
                </button>
              </div>
            )}
            {!orderDirectionAscd && (
              <div>
                Ascnding false
                <button
                  onClick={() => setOrderDirectionAscd(!orderDirectionAscd)}
                >
                  {<i className="material-icons">arrow_drop_down</i>}
                </button>
              </div>
            )}
            
            /}
            {orderLocaly} {/*wyświetla rodzaj sortowania 
            
            
            */
