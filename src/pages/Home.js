/* eslint-disable array-callback-return */
import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";

// components

import OfferCard from "../components/offerCard";

const Home = ({ token }) => {
  const [fetchError, setFetchError] = useState(null); // miejsce przechowywania danych  Tzw. State Reacta
  const [offers, setOffers] = useState(null); // miejsce przechowywania danych  Tzw. State Reacta
  const [orderLocaly, setOrderLocaly] = useState("domyślne");
  const [favFlag, setFavFlag] = useState(false);
  const [orderAscd, setOrderAscd] = useState(true);
  const [query, setQuery] = useState(""); // zmienna przechowująca string do wyszukania
  let zmiennaEffect = "none";

  const orderBy = "created_at"; // zmienna wskazująca na jakiej podstawie fetch sortuje dane
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
        .order(orderBy, { ascending: false });

      if (error) {
        setFetchError("Can't fetch");
        setOffers(null);
        console.log(error, fetchError);
      }
      if (data) {
        console.log(data);
        setOffers(data);
        setFetchError(null);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="page">
      {/*Wrapper*/}
      <div className="home">
        <h1 className="home__title">OFERTY</h1>
        {fetchError && <p>{fetchError}</p>}
        {offers && (
          <div className="offers">
            {/*debug */}
            <div className="debug hidden">
              <button
                onClick={() => {
                  console.log("found offers: ");
                  console.log(offers);
                }}
              >
                DEBUG
              </button>
            </div>

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
                    console.log(obj);
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
                      setOrderLocaly("widełki rosnąco");
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

              {/*przycisk ulubionych  */}
              <div className="searchbar_liked">
                {token.user && (
                  <button
                    onClick={() => {
                      setFavFlag(!favFlag);
                    }}
                  >
                    ULUBIONE
                  </button>
                )}
              </div>
            </div>

            {/*WYSWIETLANIE POSTÓW Z FILTREM I SORTOWANIEM */}
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
                  if (favFlag) {
                    if (post.liked_by.includes(token.user.id)) {
                      return (
                        <OfferCard
                          key={post.id}
                          offer={post}
                          onDeleteProp={handleDelete}
                          token={token}
                        />
                      );
                    }
                  } else {
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

export default Home;

/*  STARA FUNKCJA WYSZUKUJĄCA
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  if (searchInput.length > 0) {
    offers.filter((offer) => {
      return offer.title.match(searchInput);
    });
  }
  /// */

/*
            /*FILTER WITH FETCH /// SCRAP THAT 
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
