import { Outlet, useLocation } from 'react-router'
import StickyNavbar from '../../Public/NavBar/NavBar'
import { Link } from 'react-router-dom'
import router from '../../../router'

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
      <StickyNavbar current='library' />

      <div className='w-full mt-10'>
        <div className='w-[80%] m-auto flex gap-5 border-b-[1px] border-[#b3b5d1] pb-2'>
          {
            libraryItems.map(item => (
              <div key={item.link}>
                <Link to={item.link} className={`font-bold text-2xl  text-[#6768b1]  ${item.link == location && `border-b-[4px] border-[#4b52b1] pb-[5px]`}`}>{item.label}</Link>
              </div>))
          }
        </div>
        <Outlet/>
      </div>
    </div>
  )
}
