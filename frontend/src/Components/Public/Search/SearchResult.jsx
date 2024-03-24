import { useState } from "react"
import { useSearchStore } from "./SearchStore"
import Artist from "./Artist"
import { logout } from "../../../store/action"
import All from "./All"
import SongFieldData from "./SongFieldData"

const listItems = [
  {
    'label': 'All',

  },
  {
    'label': 'Artist',

  },
  {
    'label': 'Song',

  },
  {
    'label': 'Playlist',

  },
]

const ListField = ({ field, setField }) => {
  return (
    <div className="flex gap-2 justify-center mt-2 ">{

      listItems.map((item) => {
        return <div
          key={item?.label}
          value={item?.label}
          className={` ${field == item.label ? 'bg-slate-100 text-slate-800' : 'bg-slate-600 text-white '} transform duration-300 font-medium px-2 py-1 rounded-xl hover:cursor-pointer`}
          onClick={() => setField(item.label)}
        >
          {item?.label}
        </div>
      })
    }
    </div>
  )
}

const SearchData = ({ field }) => {

  const [state, dispatch] = useSearchStore()
  return (
    <div className="">
      {
        field == 'All'
          ?
          <>
            <All data={state.searchData} />
          </>
          : field == 'Artist'
            ?
            <>
              <Artist artists={state.searchData?.artists} />
            </>
            : field == 'Song'
              ?
              <><div
                className="grid grid-cols-2 items-center hover:bg-slate-700 rounded-lg"
              >

              </div>
                <SongFieldData songs={state.searchData?.songs} />
              </>
              :
              <></>
      }
    </div>
  )
}

export default function SearchResult() {

  const [state, dispatch] = useSearchStore()
  const [field, setField] = useState('All')

  return (
    <div>
      {
        state.searchValue
          ?
          <>
            <ListField field={field} setField={setField} />
            <SearchData field={field} />
          </>
          :
          <>
            Recently Search
          </>
      }
    </div>
  )
};
