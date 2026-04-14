import { useState } from 'react'
import './App.css'
import LandingPage from './pages/LandingPage'
import { BrowserRouter, Navigate, Route, Router, Routes } from 'react-router-dom'
import AboutPage from './pages/about/AboutPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/about' element={<AboutPage/>}/>
        <Route path='*' element={<Navigate to={"/"} replace/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
