import StickyNavbar from "../NavBar/NavBar";
import SearchBar from "./SearchBar";
import SearchResult from "./SearchResult";

export default function Search() {
  return (
    <>
      <StickyNavbar current='search' />
      <div className="mt-3">
        <SearchBar />
        <SearchResult />
      </div>
    </>
  )
}
