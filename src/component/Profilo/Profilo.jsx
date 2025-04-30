import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
/* import { BsFillCameraFill, BsPlus} from "react-icons/bs"; */


const Profilo = () => {
  
  return (
    <>
     <Container className="cardBox rounded-3 px-0">
      <Card>
        <Card.Img
          variant="top"
          src="https://media.istockphoto.com/id/1456569914/it/vettoriale/illustrazione-di-sfondo-colorata-nello-stile-della-vernice-acrilica.jpg?s=612x612&w=0&k=20&c=XE8IFwSzLv1-upLoyi4cOVAU6IRQfAw6L4iej80JoU4="
          className="imgTeam position-relative"
        />
        <Button className="position-absolute cameraDiv bg-white rounded-circle p-2">
          {/* <BsFillCameraFill className="camera"></BsFillCameraFill> */}
        </Button>
        <div className="userImg">
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsynwv-5qtogtOwJbIjaPFJUmHpzhxgqIAug&s"
            fluid
            className="rounded-circle position-relative"
            style={{
              width: "152px",
              height: "152px",
              objectFit: "cover",
            }}
          ></Image>
         {/*  <BsPlus
            className="position-absolute bottom-0 end-0 rounded-circle bg-white plusImg"
            onClick={() => setModalPictureShow(true)}
          ></BsPlus> */}
        </div>
        <Card.Body className="mt-5 px-4 position-relative">
        {/*   <BiPencil className="position-absolute pencil" onClick={() => setModalShow(true)}></BiPencil> */}
          <Row>
            <Col xs={8}>

            <Card.Title className="fs-2 mb-0 pointer">Manuel Casanuova</Card.Title>
              <Card.Text className="fs-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni voluptates temporibus ullam veniam dignissimos earum minima, itaque iste, magnam dolorum quasi sapiente esse beatae tenetur similique quia explicabo, omnis in.</Card.Text>
              <Card.Text className="text-secondary">
               {/*  {user.area} */} <a href="#">Informazioni di contatto</a>



              {/* <Card.Title className="fs-2 mb-0 pointer">{user.name + " " + user.surname}</Card.Title>
              <Card.Text className="fs-5">{user.title}</Card.Text>
              <Card.Text className="text-secondary">
                {user.area} <a href="#">Informazioni di contatto</a> */}


              </Card.Text>
            </Col>
            {/* <Col className="pointer2">
              <img
                src="https://media.licdn.com/dms/image/v2/C4E0BAQHYgix-Ynux1A/company-logo_100_100/company-logo_100_100/0/1646830188798/epicodeschool_logo?e=1748476800&amp;v=beta&amp;t=doTFJx0D6s9OjWg9ZXuLy9TSWloZEUtDzU0J_gPyBJs"
                width={32}
              ></img>
              EPICODE
            </Col> */}
          </Row>
          {/* <div className="mt-4">
            <Button variant="primary" className="rounded-pill fw-bold my-1">
              Disponibile per
            </Button>
            <Button variant="outline-primary" className="rounded-pill fw-bold my-1 mx-2">
              Aggiungi sezione del profilo
            </Button>
            <Button variant="outline-primary" className="rounded-pill fw-bold my-1 me-2">
              Migliora profilo
            </Button>
            <Button variant="outline-secondary" className="rounded-pill fw-bold my-1">
              Risorse
            </Button>
          </div> */}
         
        </Card.Body>
      </Card>
      {/* <EditProfilo show={modalShow} onHide={() => setModalShow(false)} />
      <PictureModal show={modalPictureShow} onHide={() => setModalPictureShow(false)} /> */}
    </Container>
    </>
  );
}
export default Profilo;