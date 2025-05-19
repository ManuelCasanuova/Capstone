import React from 'react';
import { Card, Container, Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';


function PatientDashboard() {

  const user = useSelector((state) => state.user.user);


  return (
    <Container className="cardBox border bg-white rounded-3 px-0 mb-2">
      
  
    
     <div className='d-flex justify-content-center py-3' >
        <Image
        src= {user.avatar}
        alt= "Immagine profilo"
        fluid
        className='rounded-circle position-relative'
        style= {{ width: '68px', height: '68px', objectFit: 'cover' }}
        ></Image>
     </div>

     <div className='d-flex justify-content-center py-2'>
     <Card.Body>
            <Card.Title className='fs-3 mb-0' >{user.nome}</Card.Title>  
            <Card.Title className='fs-3 mb-0' >{user.cognome}</Card.Title>     
      </Card.Body>
     </div>


    </Container>
  );
}

export default PatientDashboard;