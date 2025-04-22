import React from 'react';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';


function PatientDashboard() {
  return (
    <Container className="cardBox border bg-white rounded-3 px-0 mb-2">
      
    {/*  <Card className=''>
        <Card.Img viaririant="top" src="https://via.placeholder.com/150" className='imgStudio position-relative' />
     </Card> */}
    
     <div >
        <Image
        src= "https://via.placeholder.com/150"
        fluid
        className='rounded-circle position-relative'
        style= {{ width: '68px', height: '68px', objectFit: 'cover' }}
        ></Image>
     </div>
     <Card.Body className='mt-4 px-2'>
        
            <Card.Title className='fs-3 mb-0'>Nome Paziente</Card.Title>

           
            </Card.Body>
      </Container>
  );
}

export default PatientDashboard;