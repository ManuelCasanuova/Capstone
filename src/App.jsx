import { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap-icons/font/bootstrap-icons.css'
import './App.css'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'


import Dashboard from './component/home/Dashboard'

import PaginaProfilo from './component/profilo/PaginaProfilo'
import MyLogin from './component/access/MyLogin'
import AccessPage from './component/access/AccessPage'

import CambioPassword from './component/access/CambioPassword'
import AppuntamentiPaziente from './component/appuntamenti/AppuntamentiPaziente'
import DiagnosiPaziente from './component/diagnosi/DiagnosiPaziente'
import Esami from './component/esami/Esami'
import CatchAll from './component/catchAll/CatchAll'
import MobileNav from './component/navBar/MobileNav'
import MyNavbar from './component/NavBar/MyNavbar'
import PaginaPazienti from './component/PaginaPazienti/PaginaPazienti'
import PaginaPianoTerapeutico from './component/pianoTerapeutico/PaginaPianoTerapeutico'
import AnamnesiPage from './component/anamnesi/AnamnesiPage'
import Appuntamenti from './component/Appuntamenti/Appuntamenti'


function AppWrapper() {
  const location = useLocation();

 const nascondiNavbarIn = ["/login", "/cambio-password"];
const mostraNavbar = !nascondiNavbarIn.some(path => location.pathname.startsWith(path));


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
        <Route path='/paginaProfilo/:id' element={<PaginaProfilo />} />
        <Route path='/appuntamenti' element={<Appuntamenti />} />
        <Route path='/anamnesi/:pazienteId' element={<AnamnesiPage />} />
        <Route path="/esami/:pazienteId" element={<Esami />} />
        <Route path="/diagnosi/:pazienteId" element={<DiagnosiPaziente />} />
        <Route path= "/piano-terapeutico/:pazienteId" element={<PaginaPianoTerapeutico/>} />
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

