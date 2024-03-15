import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg"
import { ArrowLeftIcon, MusicalNoteIcon, UserIcon } from "@heroicons/react/24/solid"
function DashboardIcon() {
  return (<svg className="w-9 h-9 text-[#d3d3d3]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700"><path fill="currentColor" d="M443 108q-29-11-60-16t-66 0q-49 6-90 29t-71 58t-46 80t-17 94v15q0 10-7 16t-17 7H23q-10 0-16-7t-7-16v-14q0-66 23-127t63-108t96-79T303 0q58-8 112 3t100 37q5 4 6 10t-5 10q-14 11-33 25t-29 22q-6 4-11 1m218 89q34 70 34 148v23q0 10-7 16t-17 7h-45q-10 0-17-7t-7-16v-23q0-37-11-75q-2-7 2-11l49-64q4-5 11-5t8 7m-87-64q8-6 16-5t14 6t7 14t-5 17L403 433l-3 3l-3 4q-21 20-50 20t-49-20t-20-49t20-49q2-2 4-3t4-3z" /></svg>)
}

const SideBarItem = ({ item }) => {
  return (
    <Link
    to={item.link}
    className="h-14 flex items-center gap-3 pl-10 hover:bg-slate-700 hover:cursor-pointer">
      <div>
        {item.icon}
      </div>
      <div className="text-white font-bold">
        {item.label}
      </div>
    </Link>
  )
}

const sideBarItems = [
  {
    label: 'Dashboard',
    icon: <DashboardIcon />,
    link:'/admin/dashboard',
  },
  {
    label: 'Songs',
    icon: <MusicalNoteIcon className="w-9 h-9 text-[#d3d3d3]" />,
    link:'/admin/songs',
  },
  {
    label: 'Users',
    icon: <UserIcon className="w-9 h-9 text-[#d3d3d3]" />,
    link:'/admin/accounts',
  },
]
export default function SideBar({ setIsSideBarOpen }) {
  return (
    <div className="h-screen w-64 bg-[#1E293B] flex-col z-50 ">
      <div className="pt-2 pl-3 flex items-center justify-around mb-5">
        <ArrowLeftIcon
          width={30}
          height={30}
          className="text-[#ffffff70] hover:text-[#ffffffad] hover:cursor-pointer lg:hidden"
          onClick={() => { setIsSideBarOpen(false) }}
        />
        <Link
          to={'/'}>
          <img
            className="h-16 w-auto mr-11 hover:scale-105"
            src={logo}
            alt="Your Company"
          />
        </Link>
      </div>
      {sideBarItems.map((item) => (
        <SideBarItem key={item.label} item={item} />
      ))}
    </div>
  )
};
