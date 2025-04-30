export const SET_NEWS = "SET_NEWS";

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