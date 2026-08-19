import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className= "absolute inset-0 flex items-center justify-center bg-gray-400 min-h-screen min-w-screen opacity-60"> 
        <div className="relative  m-auto bg-white opacity-60 h-[75%] w-[25%] border-white rounded-lg border-2 ">
          <div className></div>
        </div>
      </div>
    </>
  )
}

export default App
