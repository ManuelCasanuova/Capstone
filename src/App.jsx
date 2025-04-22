import { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css'
import Header from './component/Header'
import PatientDashboard from './component/Paziente/PatientDashboard'
import Home from './component/Home/Home'

function App() {
 

  return (
    <>
    <Header />
    <Home />
    </>
  )
}

export default App
