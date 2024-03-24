import { createElement, memo, useEffect, useState } from "react";
import { actions, useStore } from "../../../store";
import axiosClient from "../../../axios";
import { Avatar, Button, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react";
import { ChevronDownIcon, PowerIcon, UserCircleIcon, ArrowUpTrayIcon, ComputerDesktopIcon } from "@heroicons/react/24/solid";
import router from "../../../router";



const Profile = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const [state, dispatch] = useStore();
  const [user, setUser] = useState();

  const profileMenuItems = [
    {
      label: user?.name,
      icon: UserCircleIcon,
    },
    {
      label: 'Dashboard',
      icon: ComputerDesktopIcon,
    },
    {
      label: "Upload Song",
      icon: ArrowUpTrayIcon,
    },
    {
      label: "Sign Out",
      icon: PowerIcon,
    },
  ];
  useEffect(() => {
    localStorage.getItem('USERID') !== null &&
      axiosClient
        .get('/user')
        .then(({ data }) => {
          setUser(data[0])
        })
        .catch((err) => {
          console.log(err);
        })
  }, [])

  const handleLogout = e => {
    e.preventDefault();
    dispatch(actions.setCurrentSong())

    axiosClient
      .post("/logout")
      .then(() => {
        dispatch(actions.logout())
        dispatch(actions.setNotificationPopup([{
          type: 'success',
          emphasize: 'LOGOUT',
          content: ' You have just logout system'
        }]))
        router.navigate('/')
      }
      )
      .catch((error) => {
        dispatch(actions.setNotificationPopup([{
          type: 'danger',
          emphasize: 'LOGOUT FAIL',
          content: 'Internal System Error'
        }]))
        console.log(error);
        e.preventDefault();

      });
  }

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end" >
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <Avatar

            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border rounded-full border-gray-900 p-0.5 h-10 w-10 hover:scale-105"
            src="http://127.0.0.1:8000/api/get-image/0.jpg"
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-2 z-50">
        {profileMenuItems.map(({ label, icon }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <MenuItem
              key={key}
              onClick={e => {
                switch (label) {
                  case user?.name:
                    closeMenu
                    break
                  case "Upload Song":
                    router.navigate('/upload-song')
                    break
                  case "Dashboard":
                    router.navigate('/admin')
                    break
                  case "Sign Out":
                    handleLogout(e)
                    break
                  default:
                    console.log('Invalid Action')

                }
              }}
              className={`flex items-center gap-4 rounded ${isLastItem
                ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                : "hover:bg-blue-500/10 focus:bg-blue-500/10 active:bg-blue-500/10 "
                }`}
            >
              {createElement(icon, {
                className: `h-6 w-6 mt-3 mb-3  ${isLastItem ? "text-red-500" : "text-[#232a66] "}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-bold"
                color={isLastItem ? "red" : "inherit"}
              >
                {label ? label : <></>}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
})

export default Profile
