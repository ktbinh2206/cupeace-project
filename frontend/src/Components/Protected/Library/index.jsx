import { Outlet, useLocation } from 'react-router'
import { NavLink } from 'react-router-dom'

const libraryItems = [
  {
    label: 'Songs',
    link: '/library/songs'
  },
  // {
  //   label: 'Artist'
  // },
  {
    label: 'Playlist',
    link: '/library/playlists'
  },
]

export default function Library() {
  const location = useLocation().pathname;

  return (
    <div className='mb-32'>
      <div className='w-full mt-10'>
        <div className='w-[80%] m-auto flex gap-5 border-b-[1px] border-[#b3b5d1] pb-2'>
          {
            libraryItems.map(item => (
              <div key={item.link}>
                <NavLink to={item.link} className={`font-bold text-2xl  text-[#6768b1]  ${item.link == location && `border-b-[4px] border-[#4b52b1] pb-[5px]`}`}>
                  {item.label}
                </NavLink>
              </div>))
          }
        </div>
        <Outlet />
      </div>
    </div>
  )
}
