const SET_USER = "SET_USER";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_FAILURE = "LOGIN_FAILURE";
const LOGOUT = "LOGOUT";
const SET_NEWS = "SET_NEWS";
const SET_UTENTI = "SET_UTENTI";
const AGGIUNGI_PAZIENTE = "AGGIUNGI_PAZIENTE";
const AGGIORNA_PAZIENTE = "AGGIORNA_PAZIENTE";
const SET_APPUNTAMENTI = "SET_APPUNTAMENTI";
const SET_PAZIENTI_RICERCA = "SET_PAZIENTI_RICERCA";
const AGGIUNGI_APPUNTAMENTO = "AGGIUNGI_APPUNTAMENTO";
const ELIMINA_APPUNTAMENTO = "ELIMINA_APPUNTAMENTO";
const AGGIORNA_APPUNTAMENTO = "AGGIORNA_APPUNTAMENTO";

export{
  SET_UTENTI,
  SET_USER,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  SET_NEWS,
  AGGIUNGI_PAZIENTE,
  AGGIORNA_PAZIENTE,
  SET_APPUNTAMENTI,
  SET_PAZIENTI_RICERCA,
  AGGIUNGI_APPUNTAMENTO, 
  ELIMINA_APPUNTAMENTO, 
  AGGIORNA_APPUNTAMENTO}



const apiUrl = import.meta.env.VITE_API_URL;

export const fetchNews = () => {
    return (dispatch) => {
      fetch("http://api.mediastack.com/v1/news?access_key=dd9e12986a01ec71a4448b94a76cf048&sources=it")
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


  export const fetchLogin = (username, password, navigate) => {
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

     
        if (data.changePasswordRequired) {
          navigate("/cambio-password");
        } else {
          navigate("/dashboard");
        }
      } else {
        dispatch({ type: LOGIN_FAILURE, payload: data });
      }
    } catch (error) {
      console.error("Errore nel login:", error);
      dispatch({ type: LOGIN_FAILURE, payload: { error: "Errore di rete" } });
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
      const response = await fetch(`${apiUrl}/register`, {
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



//APPUNTAMENTI (CRUD)

export const fetchAppuntamenti = (token) => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${apiUrl}/appuntamenti`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Errore nel recupero degli appuntamenti");

      const data = await response.json();

      
      dispatch({ type: SET_APPUNTAMENTI, payload: data });

    } catch (error) {
      console.error("Fetch appuntamenti fallita:", error);
      
    }
  };
};


export const createAppuntamento = (token, appuntamento) => {
  return async (dispatch) => {
    const response = await fetch(`${apiUrl}/appuntamenti`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(appuntamento),
    });

    if (!response.ok) {
      throw new Error("Errore nella creazione dell'appuntamento");
    }

    const data = await response.json();
    dispatch({ type: AGGIUNGI_APPUNTAMENTO, payload: data });
    return data;
  };
};

export const updateAppuntamento = (token, id, appuntamento) => {
  return async (dispatch) => {
    const response = await fetch(`${apiUrl}/appuntamenti/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(appuntamento),
    });

    if (!response.ok) {
      throw new Error("Errore nell'aggiornamento dell'appuntamento");
    }

    const data = await response.json();
    dispatch({ type: AGGIORNA_APPUNTAMENTO, payload: data });
    return data;
  };
};

export const deleteAppuntamento = (token, id) => {
  return async (dispatch) => {
    const response = await fetch(`${apiUrl}/appuntamenti/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Errore durante l'eliminazione dell'appuntamento");
    }

    dispatch({ type: ELIMINA_APPUNTAMENTO, payload: id });
  };
};

export const fetchPazientiByNomeCognome = (token, nome, cognome) => {
  return async (dispatch) => {
    try {
      const queryString = `?nome=${encodeURIComponent(nome)}&cognome=${encodeURIComponent(cognome)}`;

      const response = await fetch(`${apiUrl}/pazienti/search${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Errore nella ricerca dei pazienti");
      }

      const data = await response.json();

      dispatch({
        type: SET_PAZIENTI_RICERCA,
        payload: data,
      });

      return data;
    } catch (error) {
      console.error("Errore fetch pazienti by nome e cognome:", error);
      throw error;
    }
  };
};








