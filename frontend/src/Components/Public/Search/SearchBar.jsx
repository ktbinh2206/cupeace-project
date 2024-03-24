import { useEffect, useRef, useState } from "react"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { actions, useSearchStore } from "./SearchStore"
import axiosClient from "../../../axios"

function SearchIcon() {
  return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
  </svg>
  )
}

export default function SearchBar() {
  const inputSearch = useRef()
  const [state, dispatch] = useSearchStore()

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {

      if (state.searchValue.trim()) {
        axiosClient
          .get('/search?q=' + state.searchValue.trim())
          .then(({ data }) => {
            dispatch(actions.setSearchData(data))
          })
          .catch(err => {
            console.log(err);
          })
      } else {
        dispatch(actions.setSearchData(null))
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn)

  }, [state.searchValue])

  return (
    <>
      <div className="flex justify-center sticky">
        <div className="w-96 rounded-3xl bg-slate-600 px-2 py-1">
          <form className=" w-full flex justify-around rounded-3xl  items-center">
            <SearchIcon />
            <input
              ref={inputSearch}
              value={state.searchValue}
              onChange={e => dispatch(actions.setSearchValue(e.target.value))}
              className="flex-grow p-2 bg-slate-600 text-white font-semibold "
              type="text"
              placeholder="Enter what you want" />
            <XMarkIcon
              className="w-6 h-6 text-white hover:scale-105 hover:cursor-pointer"
              onClick={() => dispatch(actions.setSearchValue(''))} />
          </form>
        </div>
      </div>
    </>
  )
}
