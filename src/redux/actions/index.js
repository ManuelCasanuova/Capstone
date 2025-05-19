const SET_USER = "SET_USER";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_FAILURE = "LOGIN_FAILURE";
const LOGOUT = "LOGOUT";
const SET_NEWS = "SET_NEWS";
const SET_UTENTI = "SET_UTENTI";
const AGGIUNGI_PAZIENTE = "AGGIUNGI_PAZIENTE";
const AGGIORNA_PAZIENTE = "AGGIORNA_PAZIENTE";

export{
  SET_UTENTI,
  SET_USER,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  SET_NEWS,
  AGGIUNGI_PAZIENTE,
  AGGIORNA_PAZIENTE}



const apiUrl = import.meta.env.VITE_API_URL;

export const fetchNews = () => {
    return (dispatch) => {
      fetch("http://api.mediastack.com/v1/news?access_key=dd9e12986a01ec71a4448b94a76cf048&sources=it   jjjj ")
        .then((resp) => resp.json())
        .then((news) => {
          if (news) {
            console.log("SONO NEWS", news);
            dispatch({ type: SET_NEWS, payload: news });
          } else {
            alert("Nessuna notizia trovata");
          }
        })
        .catch((err) => console.error(err));
    };
  };


  export const fetchLogin = (username, password) => {
    return async (dispatch) => {
      try {
        const response = await fetch(apiUrl + "/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
  
        const data = await response.json();
  
        if (response.ok && data?.token) {
          dispatch({ type: LOGIN_SUCCESS, payload: data });
          localStorage.setItem("token", data.token);
        } else {
          dispatch({ type: LOGIN_FAILURE, payload: data });
        }
      } catch (error) {
        console.error("Errore nel login:", error);
        dispatch({ type: LOGIN_FAILURE, payload: { error: "Errore di rete" } });
      }
    };
  };


  export const fetchUserDetails = (token) => {
    return async (dispatch) => {
      try {
        const response = await fetch(apiUrl + "/utente/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
  
        if (response.ok && data) {
          dispatch({ type: SET_USER, payload: data });
        } else {
          localStorage.removeItem("token");
          dispatch({ type: LOGOUT });
        }
      } catch (error) {
        console.error("Errore nel recupero dell'utente:", error);
        localStorage.removeItem("token");
        dispatch({ type: LOGOUT });
      }
    };
  };


export const fetchPazienti = (token, page = 0) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `${apiUrl}/pazienti?page=${page}&size=12&sort=utente.cognome&sort=asc`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data) {
        dispatch({ type: SET_UTENTI, payload: data.content });
        return { payload: data };
      } else {
        localStorage.removeItem("token");
        dispatch({ type: LOGOUT });
      }
    } catch (error) {
      console.error("Errore nel recupero degli utenti:", error);
      localStorage.removeItem("token");
      dispatch({ type: LOGOUT });
    }
  };
};



export const postNuovoPaziente = (paziente, token) => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${apiUrl}/pazienti`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paziente),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Paziente creato:", data);

        dispatch({ type: AGGIUNGI_PAZIENTE, payload: data });

        return { success: true, data };
      } else {
        const error = await response.text();
        console.error("Errore nella creazione:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Errore di rete:", error);
      return { success: false, error };
    }
  };
};


export const updatePaziente = (id, pazienteAggiornato, token) => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${apiUrl}/pazienti/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pazienteAggiornato),
      });

      if (response.ok) {
        const data = await response.json();

        // Aggiorna lo stato Redux con il paziente modificato
        dispatch({ type: 
          AGGIORNA_PAZIENTE, payload: data });

        return { success: true, data };
      } else {
        const error = await response.text();
        console.error("Errore nell'aggiornamento:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Errore di rete:", error);
      return { success: false, error };
    }
  };
};



