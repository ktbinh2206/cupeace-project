import { useReducer } from "react";
import StickyNavbar from "../NavBar/NavBar";
import SearchBar from "./SearchBar";
import SearchResult from "./SearchResult";
import reducer, { initState } from "./SearchStore/reducer";
import SearchContext from "./SearchStore/context";

export default function Search() {
  const [state, dispatch] = useReducer(reducer, initState)

  return (
    <SearchContext.Provider value={[state, dispatch]}>
      <StickyNavbar current='search' />
      <div className="mt-3">
        <SearchBar />
        <SearchResult />
      </div>
    </SearchContext.Provider>
  )
}
