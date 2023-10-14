// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

function countReducer(state, action) {
  console.log({state})
  if (action.type === "increment") {
    return state + action.step
  }
  console.log(`${action} action not recognized.`)

}

function Counter({initialCount = 0, step = 1}) {

  const [count, dispatch] = React.useReducer(countReducer, initialCount)


  const increment = () => dispatch({type: "increment", step})
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
