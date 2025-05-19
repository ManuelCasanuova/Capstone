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
        
        <Routes>


      
          <Route path="/" element={<AccessPage />} />
          {/* PAGINA LOGIN */}
          <Route path="/login" element={<MyLogin />}/>

          <Route path="/dashboard" element={<Dashboard />} />

          {/* PAGINA PAZIENTI */}
          <Route path='/pazienti' element={<PaginaPazienti />} />

         

          {/* PAGINA PROFILO */}
          
          <Route path= '/paginaProfilo/:id' element={<Container className='pt-3'><PaginaProfilo /></Container>} />
        





        </Routes>
       
    </BrowserRouter>
   
    
  )
}

export default App
