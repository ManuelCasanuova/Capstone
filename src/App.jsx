import { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import '@progress/kendo-theme-default/dist/all.css';
import './App.css'
import Header from './component/Header'

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
