import { Col, Container, Image, Row } from "react-bootstrap";
import PrimoPiano from "./PrimoPiano";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { fetchUserDetails, LOGOUT } from "../../redux/actions";
import logo from "../../assets/Logo.png";
import AppuntamentiOggi from "../Appuntamenti/AppuntamentiOggi";




const Dashboard = () => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      dispatch(fetchUserDetails(token));
    } else {
      dispatch({ type: LOGOUT });
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [dispatch, token, navigate]);

  if (!user) {
    return <p>Caricamento in corso...</p>;
  }

  return (
    <>
      <Container>

        <div className="d-flex ">

        <div className="mt-5">
          <h2>Dashboard</h2>
          <p>Benvenuto {user.nome}</p>
          
       </div>  

       
        
        <div className="ms-auto">
          <Image src={logo} alt="Logo" fluid style={{ width: "150px" }} />
        </div>

        </div>

        <Row xs={2}>
          <Col>
            
            <AppuntamentiOggi />
            
          </Col>

          <Col> 
          <PrimoPiano />
          </Col>


        </Row>
      </Container>
    </>
  );
};

export default Dashboard;