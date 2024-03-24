import { Bars3Icon } from "@heroicons/react/24/solid"
import Profile from "./Profile"
import { useStore } from "../../store"
import NavBarNotification from "../Public/NavBar/NavBarNotification"

export default function NavBar({ setIsSideBarOpen }) {
  return (
    <>
      <div className="border-[#ffffff46] border-b">
        <nav className="bg-[#182235]  shadow ">
          <div className="px-8 mx-auto max-w-full">
            <div className="flex items-center justify-between h-16">
              <div className=" flex items-center">
                <Bars3Icon
                  width={30}
                  height={30}
                  className="text-[#ffffff70] hover:text-[#ffffffad] hover:cursor-pointer lg:hidden"
                  onClick={() => setIsSideBarOpen(true)}
                />
              </div>
              <div className="flex items-center ml-4 md:ml-6">
                <NavBarNotification/>
                <Profile />
              </div>
            </div>
          </div>
        </nav>
      </div>

    </>
  )
};
