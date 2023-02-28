/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";

// components

import OfferCard from "../components/offerCard";

const CreatedOffers = ({ token }) => {
  const [fetchError, setFetchError] = useState(null); // Fetch error, zmienna
  const [offers, setOffers] = useState(null); // główna baza
  const [orderBy, setOrderBy] = useState("created_at"); // created_at jest nazwa kolumny w bazie
  const [orderLocaly, setOrderLocaly] = useState("Sortowanie ");
  const [orderAscd, setOrderAscd] = useState(true);
  const [foundUsers, setFoundUsers] = useState("");
  const [query, setQuery] = useState("");
  let zmiennaEffect = "none";

  //Funkcja usuwająca wpis lokalnie
  const handleDelete = (id) => {
    setOffers((pervOffers) => {
      return pervOffers.filter((sm) => sm.id !== id);
    });
  };
  //Funcjka sortująca
  function handleSortEffect(e) {
    //setSortEffect(e.target.id);
    zmiennaEffect = e.target.id;
    switch (zmiennaEffect) {
      case "az":
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
    const fetchOffers = async () => {
      const { data, error } = await supabase
        .from("offers")
        .select()
        .order(orderBy, { ascending: false }); // const { data, error } -> destrukturyzacja obiektu po lewej

      if (error) {
        setFetchError("Can;t fetch ");
        setOffers(null);
        console.log(error);
      }
      if (data) {
        setOffers(data);
        setFetchError(null);
      }
    };

    fetchOffers();
  }, []); //[orderBy] powoduje wywołanie Hooka useEffect za każdym użyciem orderby // brak tylko pojedyncze wywołanie

  return (
    <div className="page">
      {/*Wrapper*/}
      <div className="home">
        <h1 className="home__title">Twoje Oferty</h1>
        {fetchError && <p>{fetchError}</p>}
        {offers && (
          <div className="offers">
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
                    offers.sort(function (a, b) {
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
                      setOffers(offers.reverse());
                      setOrderLocaly("Najstarsze najpierw ");
                      setOrderAscd(!orderAscd);
                    } else if (!orderAscd) {
                      setOrderLocaly("Najnowsze najpierw");
                      setOffers(offers);
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
                    offers.sort(function (a, b) {
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
                      setOffers(offers.reverse());
                      setOrderLocaly("Alfabetycznie rosnoąco");
                      setOrderAscd(!orderAscd);
                    } else if (!orderAscd) {
                      setOrderLocaly("Alfabetycznie malejąco");
                      setOffers(offers);
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
                    offers.sort(function (a, b) {
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
                      setOffers(offers.reverse());
                      setOrderLocaly("widełki rosnoąco");
                      setOrderAscd(!orderAscd);
                    } else if (!orderAscd) {
                      setOffers(offers);
                      setOrderLocaly("widełki malejąco");
                      setOrderAscd(!orderAscd);
                    }
                  }}
                >
                  STAWKA
                </button>
                <p className="searchbar_dsc">
                  Obecne sortowanie: {orderLocaly}
                </p>
              </div>
            </div>
            {/*WYSWIETLANIE POSTÓW Z FILTREM I SORTOWANIEM  */}
            <div className="offers_list">
              {offers
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
                      <OfferCard
                        key={post.id}
                        offer={post}
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
    </div>
  );
};

export default CreatedOffers;
/*  INSERT IN 219 LINE IF YOU WANT TO BACKUP OLD SHOW METHOD 

          <div className="offer-grid">
            {offers.map((offer) => (
              //<p>{offer.title}</p> //
              <SmoothieCard
                key={offer.id}
                offer={offer}
                onDeleteProp={handleDelete}
              /> //offer={offer} -> offer jest to prop do którego przekazujemy zmienna offer tak jak w Svelte
            ))}
          </div>


*/

/*     SHOW FOO 

<div className="offer-grid">
            foo2
            {foundUsers && foundUsers.length > 0 ? (
              foundUsers.map((foundSmoothies) => {
                if (foundSmoothies.created_by === token.user.id) {
                  return (
                    <SmoothieCard
                      key={foundSmoothies.id}
                      offer={foundSmoothies}
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
          <div className="offer-grid">
            foo3
            {offers.map((offer) => {
              if (offer.created_by === token.user.id) {
                return (
                  <SmoothieCard
                    key={offer.id}
                    offer={offer}
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
                foundUsers.map((offers) => (
                  <li key={offers.id} className="user">
                    <span className="user-id">{offers.id}</span>
                    <span className="user-name">{offers.title}</span>
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
      console.log(offers);
      const results = offers.filter((user) => {
        return user.title.toLowerCase().includes(name.toLowerCase());
        // Use the toLowerCase() description to make it case-insensitive
      });
      setFoundUsers(results);
    } else {
      setFoundUsers(offers);
      // If the text field is empty, show all users
    }
  };
  */
/*POMOCNY DEBUG  

            <div className="debug">
            <button
              onClick={() => {
                console.log(offers);
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
