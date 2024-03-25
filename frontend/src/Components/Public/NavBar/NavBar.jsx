import { Link, NavLink } from "react-router-dom";
import logo from "../../../assets/logo.svg"
import {
  Button,
} from "@material-tailwind/react";
import {
  BookOpenIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";
import { createElement, memo, useEffect, useMemo, useState } from "react";
import Profile from "./Profile";
import { useStore } from "../../../store";
import axiosClient from "../../../axios";
import NavBarNotification from "./NavBarNotification";

function SearchIcon() {
  return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
  </svg>
  )
}

const navigation = [
  { name: 'Home', href: '/', current: 'home', icon: HomeIcon },
  { name: 'Search', href: '/search', current: 'search', icon: SearchIcon },
  { name: 'Library', href: '/library/songs', current: 'library', icon: BookOpenIcon }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Example() {
  const currentUser = localStorage.getItem('USERID')
  
  return (
    <>
      <div className=" max-w-full px-2 sm:px-6 lg:px-8 bg-[black] sticky top-0 z-40 border-b border-slate-700">
        <div className="relative flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <NavLink
                to={'/'}>
                <img
                  className="h-12 w-auto hover:scale-105"
                  src={logo}
                  alt="Your Company"
                />
              </NavLink>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}

                    className={({ isActive }) => (
                      classNames(
                        isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white  hover:scale-105',
                        'rounded-md h-12 px-3 py-2 text-xl font-medium flex items-center '
                      )
                    )}
                    aria-current={({ isActive }) => isActive ? 'page' : undefined}
                  >
                    {createElement(item.icon, {
                      className: 'h-6 w-6 mt-3 mb-3',
                      strokeWidth: 2,
                    })}
                    <span className='ml-2'>
                      {item.name}
                    </span>
                  </NavLink>
                ))
                }
              </div>
            </div>
          </div>


          <div className={`flex items-center  gap-5 ${currentUser ? '' : 'hidden'}`}>
            <NavBarNotification />
            <Profile />
          </div>

          <div className={`absolute inset-y-0 right-0 justify-between pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 flex ${currentUser ? 'hidden' : ''}`}>
            <NavLink to={"/login"}>
              <Button className="h-10 mr-3 hover:bg-slate-700 hover:scale-105 ">
                Login
              </Button>
            </NavLink>
            <NavLink to={"/signup"}>
              <Button className="h-10 hover:bg-slate-700 hover:scale-105">Signup</Button>
            </NavLink>
          </div>

        </div>
      </div>
    </>
  )

}
export default (Example)
