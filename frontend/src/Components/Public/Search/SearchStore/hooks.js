import { useContext } from "react"
import SearchContext from "./context"

export const useSearchStore = () => {
  const [state, dispatch] = useContext(SearchContext)
  return [state, dispatch]
}
