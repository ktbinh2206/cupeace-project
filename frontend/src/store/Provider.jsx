import { useReducer } from "react";
import reducer, { initState } from "./reducer";
import GlobalContext from "./Context";

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initState)
  return (
    <GlobalContext.Provider value={[state, dispatch]}>
      {children}
    </GlobalContext.Provider>
  )
}

export default Provider
