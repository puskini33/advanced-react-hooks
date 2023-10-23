// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'
import {useState} from "react";

const CountContext = React.createContext()

function CountProvider(props) {
    const [count, setCount] = useState(0)

    return <CountContext.Provider value={{count, setCount}} {...props}/>
}

function CountDisplay() {

  const {count} = React.useContext(CountContext)
  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
    const {setCount} = React.useContext(CountContext)
    const increment = () => setCount(c => c + 1)
    return <button onClick={increment}>Increment count</button>
}

function App() {

    return (
    <CountProvider >
      <CountDisplay />
      <Counter />
    </CountProvider>
  )
}

export default App
