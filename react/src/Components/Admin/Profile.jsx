import { Avatar, Button } from "@material-tailwind/react";
import { useState } from "react"

export default function Profile(params) {
  const [isOpen, setIsOpen] = useState(false);

  return (

    <div className="relative ml-3">
      <div className="relative inline-block text-left">
        <div>
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Avatar

              variant="circular"
              size="sm"
              alt="tania andrew"
              className="border rounded-full border-gray-900 p-0.5 h-10 w-10 hover:scale-105"
              src="http://127.0.0.1:8000/api/get-image/0.jpg"
            />
          </Button>
        </div>
        <div className={`${isOpen ? 'scale-100 ' : 'scale-0'} transform duration-200 absolute right-0 w-48 mt-2 origin-top-right  rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5`}>
          <div
            className="py-1 "
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <a
              href="#"
              className="block px-4 py-2 text-md   text-gray-100 hover:text-white hover:bg-gray-600"
              role="menuitem"
            >
              <span className="flex flex-col">
                <span>Settings</span>
              </span>
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-md text-gray-100 hover:text-white hover:bg-gray-600"
              role="menuitem"
            >
              <span className="flex flex-col">
                <span>Account</span>
              </span>
            </a>
            <a
              href="#"
              className="block  px-4 py-2 text-md  text-gray-100 hover:text-white hover:bg-gray-600"
              role="menuitem"
            >
              <span className="flex flex-col">
                <span>Logout</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
};
