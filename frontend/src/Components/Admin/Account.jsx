import { useEffect, useState } from "react"
import axiosClient from "../../axios"
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
import AddNewUser from "./AddNewUser";

const calculateDuration = (currentDate) => {

  let today = new Date();
  let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let dateTime = date + ' ' + time;

  // Parse strings to Date objects
  let time1 = new Date(dateTime);
  let time2 = new Date(currentDate);

  // Calculate the difference in milliseconds
  let timeDifference = Math.abs(time2 - time1);

  // Convert milliseconds to years, months, days, hours, minutes, and seconds
  let millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25; // User for leap years
  let years = Math.floor(timeDifference / millisecondsInYear);
  let remainingMilliseconds = timeDifference % millisecondsInYear;

  let millisecondsInMonth = millisecondsInYear / 12; // Approximation
  let months = Math.floor(remainingMilliseconds / millisecondsInMonth);
  remainingMilliseconds %= millisecondsInMonth;

  let millisecondsInDay = 1000 * 60 * 60 * 24;
  let days = Math.floor(remainingMilliseconds / millisecondsInDay);
  remainingMilliseconds %= millisecondsInDay;

  let millisecondsInHour = 1000 * 60 * 60;
  let hours = Math.floor(remainingMilliseconds / millisecondsInHour);
  remainingMilliseconds %= millisecondsInHour;

  let millisecondsInMinute = 1000 * 60;
  let minutes = Math.floor(remainingMilliseconds / millisecondsInMinute);
  remainingMilliseconds %= millisecondsInMinute;

  let seconds = Math.floor(remainingMilliseconds / 1000);

  let result = years > 0
    ? <>{years}{years > 1 ? ' years ' : ' year '}ago</>
    : months > 0
      ? <>{months}{months > 1 ? ' months ' : ' month '}ago</>
      : days > 0
        ? <>{days}{days > 1 ? ' days ' : ' day '}ago</>
        : hours > 0
          ? <>{hours}{hours > 1 ? ' hrs ' : ' hr '}ago</>
          : minutes > 0
            ? <>{minutes}{minutes > 1 ? ' mins ' : ' min '}ago</>
            : <>Several secs ago</>

  return result
}

const UserItem = ({ user, selected, setSelected }) => {


  const handleSelect = (e) => {
    let updatedSelected;
    e.target.checked
      ? updatedSelected = [...selected, user]
      : updatedSelected = selected.filter((selected) => selected.id !== user.id)
    setSelected(updatedSelected);
  };

  let timeCreated = calculateDuration(user.created_at)
  let timeUpdated = calculateDuration(user.updated_at)


  return (
    <tr key={user.id} className="border-t-[0.5px] border-slate-700 ">
      <td className="w-[1px] ccr3m cwqwq whitespace-nowrap px-2 py-3">
        <div className="flex items-center">
          <label className="inline-flex">
            <span></span>
            <input
              onChange={e => handleSelect(e)}
              checked={selected?.some((selected) => selected.id === user.id)}
              className="table-item h-4 w-4  hover:cursor-pointer border-[#334155] bg-[#0f172a4d] border border-r-[0.25rem] text-[#6366f1]"
              type="checkbox" />
          </label>
        </div>
      </td>
      <td className="px-2 py-3">
        <div className="flex items-center">
          <div className="mr-2 flex-shrink-0 sm:mr-3 w-14 h-14">
            <img className=" object-cover rounded-full w-14 h-14" src={`${import.meta.env.VITE_API_BASE_URL}/get-image/${user.avatar}`} />
          </div>
          <div className="text-slate-100 font-[500]">
            {user.name}
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap ml-2 px-2 py-3">
        <div className="text-left">{user.email}</div>
      </td>
      <td className="whitespace-nowrap ml-2 px-2 py-3">
        <div className="text-left">{timeCreated}</div>
      </td>
      <td className="whitespace-nowrap ml-2 px-2 py-3">
        <div className="text-left">{timeUpdated}</div>
      </td>
    </tr>
  )
}

export default function User() {
  const [page, setPage] = useState()
  const [selected, setSelected] = useState([])
  const [openAddUserModal, setOpenAddUserModal] = useState(false)

  const handleChangePage = (link) => {

    axiosClient
      .get(link + '&order=desc&field=id&per_page=15')
      .then(({ data }) => {
        setPage(data)
        setSelected([])
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const handleSelectAll = (e) => {
    !e.target.checked
      ? setSelected([])
      : setSelected(page.data)
  }

  useEffect(() => {

    const controller = new AbortController()
    const signal = controller.signal
    axiosClient
      .get('/users/roles?order=desc&field=id&per_page=15', { signal })
      .then(({ data }) => {
        setPage(data)
      })
      .catch((err) => {
        console.log(err);
      })

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <>
      <main className="flex-grow h-full max-h-screen pb-16 overflow-y-auto">
        <div className="px-6 py-8 lg:px-8 lg:py-8 max-w-[96rem] mx-auto w-full">
          {/* Page Header */}
          <div className="sm:flex sm:justify-between sm:items-center mb-8">
            {/* Left */}
            <div className="sm:mb-0 mb-4">
              <h1 className="text-slate-100 font-bold sm:text-2xl text-xl">Users</h1>
            </div>
            {/* Right */}
            <div className="sm:justify-end sm:auto-cols-max gap-2 justify-start grid-flow-col grid">
              <button>Filter</button>
              <button className="hover:bg-[#3c3e92] active:scale-95 rounded-md pl-1 pr-2 py-1 inline-flex items-center content-center border border-transparent font-[500] text-xs bg-[#6366f1] text-white">
                <PlusIcon className="w-6 h-6" />
                <span
                  className="hidden sm:block ml-2 text-nowrap text-[1.1rem]"
                  onClick={() => { setOpenAddUserModal(true) }}
                >
                  {'Add User'}
                </span>
              </button>
            </div>
          </div>
          {/* Table */}
          <div className="bg-slate-800 rounded-sm border border-slate-700">
            <header className="py-4 px-5">
              <h2 className="text-slate-100 font-[600]">
                {"All Users "}
                <span className="font-[500] text-opacity-100 text-[#64748b]">{page?.total || 0}</span>
              </h2>
            </header>
            <div className="overflow-auto">
              <table className="text-[#cbd5e1] table-auto w-full ">
                <thead className="border-slate-700 text-slate-400 uppercase font-[600] text-sm border-y">
                  <tr className="bg-[#1a2633]">
                    <th className="">
                      <label>
                        <span></span>
                        <input
                          id="parent-checkbox"
                          onChange={(e) => handleSelectAll(e)}
                          className="h-4 w-4 border-[#334155] bg-[#0f172a4d] border border-r-[0.25rem] text-[#6366f1] hover:cursor-pointer"
                          type="checkbox" />
                      </label>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="font-[600] text-left">
                        User
                      </div>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="font-[600] text-left">
                        Email
                      </div>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="font-[600] text-left">
                        Created
                      </div>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="font-[600] text-left">
                        Updated
                      </div>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {page &&
                    page?.data?.map((user) => (
                      <UserItem
                        key={user.id}
                        user={user}
                        selected={selected}
                        setSelected={setSelected} />
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-8 ">
            <div className="flex sm:justify-between sm:items-center sm:flex-row flex-col">
              <nav className="sm:order-1 sm:mb-0 mb-4" role="navigation" aria-label="Navigation">
                <ul className="flex justify-center">
                  <li className="ml-3 first:ml-0">
                    <span className={` flex items-center px-3 py-2 bg-slate-800 border border-slate-700 rounded-sm  ${page?.prev_page_url ? 'text-indigo-500 hover:border-slate-200 active:scale-95 hover:cursor-pointer' : 'text-[#475569] hover:cursor-default'}`}
                      onClick={() => handleChangePage(page?.prev_page_url)}>
                      <ArrowLeftIcon className="w-5 h-5" /> Previous
                    </span>
                  </li>
                  <li className="ml-3 first:ml-0 flex items-center w-28 box-border px-3 py-1">
                    <select className="h-full w-full rounded-md bg-slate-600 text-slate-300 text-center font-semibold"
                      onChange={(e) => {
                        handleChangePage(e.target.value)
                      }}
                      value={page?.links.filter((link) => link.active)[0].url}
                    >
                      {
                        page?.links?.map((link) => {
                          let num = parseInt(link.label)
                          if (!isNaN(num)) {
                            return <option key={link.label} value={link.url} className="text-center">{link.label}</option>
                          }
                        })
                      }
                    </select>
                  </li>
                  <li className="ml-3 first:ml-0">
                    <a className={` flex items-center px-3 py-2 bg-slate-800 border border-slate-700 rounded-sm ${page?.next_page_url ? 'text-indigo-500 hover:border-slate-200 active:scale-95 hover:cursor-pointer' : 'text-[#475569] hover:cursor-default'}`}
                      onClick={() => handleChangePage(page?.next_page_url)}>
                      Next <ArrowRightIcon className="w-5 h-5" />
                    </a>
                  </li>
                </ul>
              </nav>
              <div className=" text-sm text-slate-400 sm:text-left text-center">
                Showing
                <span className=" text-[#cbd5e1] font-medium">&nbsp;{page?.from || 0}&nbsp;</span>
                to
                <span className=" text-[#cbd5e1] font-medium">&nbsp;
                  {page?.to || 0}
                  &nbsp;</span>
                of <span className=" text-[#cbd5e1] font-medium">&nbsp;{page?.total || 0}&nbsp;</span>
                results
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Modal Add User */}
      <div
        className={`absolute h-screen w-screen bg-[#ffffff0e] top-0 right-0 z-40  ${openAddUserModal || 'hidden'}`}
        onClick={() => setOpenAddUserModal(false)}
      ></div>
      <AddNewUser openAddUserModal={openAddUserModal} />
    </>
  )
};
