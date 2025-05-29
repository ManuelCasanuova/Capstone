import { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap-icons/font/bootstrap-icons.css'
import './App.css'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'

import MyNavbar from './component/NavBar/MyNavbar'
import PaginaPazienti from './component/PaginaPazienti/PaginaPazienti'
import Dashboard from './component/Home/Dashboard'
import { Container } from 'react-bootstrap'
import PaginaProfilo from './component/Profilo/PaginaProfilo'
import MyLogin from './component/access/MyLogin'
import AccessPage from './component/access/AccessPage'
import Appuntamenti from './component/Appuntamenti/Appuntamenti'
import CambioPassword from './component/access/CambioPassword'
import AppuntamentiPaziente from './component/Appuntamenti/AppuntamentiPaziente'
import DiagnosiPaziente from './component/diagnosi/DiagnosiPaziente'
import Esami from './component/esami/Esami'
import CatchAll from './component/catchAll/CatchAll'
import MobileNav from './component/NavBar/MobileNav'


function AppWrapper() {
  const location = useLocation();
 
  const mostraNavbar = location.pathname !== "/cambio-password";

  return (
    <>
      {mostraNavbar && (
        <>
       
          <div className="d-block d-md-none">
            <MobileNav />
          </div>

          
          <div className="d-none d-md-block">
            <MyNavbar />
          </div>
        </>
      )}
      <Routes>
        <Route path="/" element={<AccessPage />} />
        <Route path="/login" element={<MyLogin />} />
        <Route path="/cambio-password" element={<CambioPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/pazienti' element={<PaginaPazienti />} />
        <Route path="/appuntamenti/:id" element={<AppuntamentiPaziente />} />
        <Route path='/paginaProfilo/:id' element={<Container className='pt-3'><PaginaProfilo /></Container>} />
        <Route path='/appuntamenti' element={<Appuntamenti />} />
        <Route path="/esami/:pazienteId" element={<Esami />} />
        <Route path="/diagnosi/:pazienteId" element={<DiagnosiPaziente />} />
        <Route path='*' element={<CatchAll />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;

