import React from 'react';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';


function PatientDashboard() {
  return (
    <Container className="cardBox border bg-white rounded-3 px-0 mb-2">
      
  
    
     <div className='d-flex justify-content-center py-3' >
        <Image
        src= "https://via.placeholder.com/150"
        fluid
        className='rounded-circle position-relative'
        style= {{ width: '68px', height: '68px', objectFit: 'cover' }}
        ></Image>
     </div>

     <div className='d-flex justify-content-center py-2'>
     <Card.Body>
            <Card.Title className='fs-3 mb-0' >Nome Paziente</Card.Title>     
      </Card.Body>
     </div>


    </Container>
  );
}

export default PatientDashboard;