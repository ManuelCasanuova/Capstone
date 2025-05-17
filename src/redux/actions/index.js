const SET_USER = "SET_USER";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_FAILURE = "LOGIN_FAILURE";
const LOGOUT = "LOGOUT";
const SET_NEWS = "SET_NEWS";


export{
  SET_USER,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  SET_NEWS}



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