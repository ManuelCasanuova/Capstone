import { useDispatch, useSelector } from "react-redux";
import { fetchNews } from "../../redux/actions";
import { Container, Image } from "react-bootstrap";
import { ChevronCompactRight, InfoSquareFill } from "react-bootstrap-icons";
import NotiziePrimoPiano from "./NotiziePrimoPiano";
import MyCollapse from "./MyCollapse";
import { useEffect } from "react";



const PrimoPiano = () => {
  const dispatch = useDispatch();
  const notizie = useSelector((state) => state.news.content.data);

  useEffect(() => {
    dispatch(fetchNews());
  }, []);

  return (
    <Container fluid className="bg-white border rounded-3 d-none d-lg-block px-0 mt-3 shadow-sm">
      <div className="d-flex align-items-center pt-3 px-3 ">
        <h3 className="mb-1 pointer">Notizie in tempo reale</h3>
        
      </div>
      

      {notizie?.slice(0, 5).map((notizia, index) => {
        return (
          <NotiziePrimoPiano
            key={index}
            titolo={notizia.title}
            aggiornamento={notizia.published_at.slice(0, 10)}
            url={notizia.url}
          />
        );
      })}
      <MyCollapse />
    
    </Container>
  );
};
export default PrimoPiano;