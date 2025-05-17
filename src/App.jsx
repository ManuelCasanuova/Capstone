import { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap-icons/font/bootstrap-icons.css'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'

import MyNavbar from './component/NavEFooter/MyNavbar'
import PaginaPazienti from './component/PaginaPazienti/PaginaPazienti'
import Dashboard from './component/Home/Dashboard'
import { Container } from 'react-bootstrap'
import PaginaProfilo from './component/Profilo/PaginaProfilo'
import MyLogin from './component/access/MyLogin'
import AccessPage from './component/access/AccessPage'


function App() {
 

  return (
    <BrowserRouter>
        <MyNavbar />
        <Container fluid className='p-0'>
        <Routes>


      
          <Route path="/" element={<Container className='pt-3'><AccessPage /></Container>} />
          {/* PAGINA LOGIN */}
          <Route path="/login" element={<Container className='pt-3'><MyLogin /></Container>} />

          <Route path="/dashboard" element={<Container className='pt-3'><Dashboard /></Container>} />




          {/* PAGINA PAZIENTI */}
          <Route path='/pazienti' element={<Container className='pt-3'><PaginaPazienti /></Container>} />

         

          {/* PAGINA PROFILO */}
          <Route path="/profilo" element={<PaginaProfilo />} />
          <Route path= '/paginaProfilo' element={<Container className='pt-3'><PaginaProfilo /></Container>} />
        





        </Routes>
        </Container>
    </BrowserRouter>
   
    
  )
}

export default App
