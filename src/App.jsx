import { useState } from 'react'
import React from 'react'
import Sidebar from './components/Sidebar.jsx'
import Player from './components/Player.jsx'    


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='h-screen bg-black'>
      <div className='h-[90%} flex'>
        <Sidebar/>

      </div>
      
    </div>
  )
}

export default App
