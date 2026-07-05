import { useState } from 'react'
import Navbar from './navbar'
import TodoMain from './todoMain'
import History from './history'
import './App.css'
import {Route, Routes } from 'react-router-dom';

function App() {


  return (
    <>
    <header>
      <nav>
        <Navbar/>
      </nav>
    </header>
    <Routes>
      <Route path='/' element={<TodoMain />} />
      <Route path='/history' element={<History />} />
    </Routes>

    </>
  )
}

export default App
