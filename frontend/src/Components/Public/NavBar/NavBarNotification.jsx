import {
  BellIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState, memo } from "react";
import axiosClient from "../../../CommonAction/axios";
import { Avatar, Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react"
import Pusher from "pusher-js";


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

const NotificationItems = ({ notification, setTotal }) => {

  const [isread, setIsread] = useState(notification.read_at == null ? false : true)



  return (
    <div className=" flex gap-2 items-center "
    >
      <Avatar
        variant="circular"
        size="sm"
        alt="tania andrew"
        className="border rounded-full border-gray-900 p-0.5 h-10 w-10  min-h-10 min-w-10  hover:scale-105"
        src={`${import.meta.env.VITE_API_BASE_URL}` + '/get-image/' + `${notification.data.image}`}
      />
      <div>
        {/* Content */}
        <div className="text-slate-200 font-semibold text-wrap text-left">
          {notification.data?.content}
        </div>
        <div className={` text-xs ${isread ? 'text-slate-300' : 'font-bold text-blue-500 '} text-left`}>
          {calculateDuration(notification.created_at)}
        </div>
      </div>
    </div>
  )
}

export default function NavBarNotification() {

  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState()
  const [total, setTotal] = useState(0);

  useEffect(() => {

    const controller = new AbortController()

    localStorage.getItem('USERID') !== null &&
      axiosClient
        .get('/user/notifications', { signal: controller.signal })
        .then(({ data }) => {
          const readNotifications = data.data.filter(notification => notification.read_at === null);
          const readNotificationsCount = readNotifications.length;
          setTotal(readNotificationsCount);
          setNotifications(data.data)
        })
        .catch((err) => {
        })

    const pusher = new Pusher('d52b186e430cb0ef7e01', {
      cluster: 'ap1'
    });

    const channel = pusher.subscribe('notifications-' + localStorage.getItem('USERID'));
    const handleMessage = (data) => {
      setTotal(prev => prev + 1)
      setNotifications(prev => [data, ...prev]); // Update messages state correctly
    };
    channel.bind('new-notification', handleMessage);

    return () => {
      // Unbind the event listener when component is unmounted
      channel.unbind('new-notification', handleMessage);
      // Unsubscribe from the Pusher channel
      pusher.unsubscribe('notifications-' + localStorage.getItem('USERID'));
      // Cleanup any other resources if necessary
      controller.abort();
    }


  }, [])

  const handleRead = () => {

    setTotal(0)
    notifications.forEach(element => {
      element.read_at = true
    });

    axiosClient
      .post('/user/notifications/read')
      .then(({ data }) => {
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <>
      <Menu>
        <MenuHandler>
          <div
            className="bg-slate-700 rounded-full w-10 h-10"
          >
            <div
              className={`box-content absolute bg-red-800 translate-x-6 h-3 min-w-3 p-1 -translate-y-2 flex items-center content-center rounded-full ${total > 0 ? '' : 'hidden'}`}>
              <div className="box-content text-center text-white font-mono font-medium">
                {total > 0 ? total : ''}
              </div>
            </div>
            <BellIcon
              onClick={() => {
                setIsOpen(!isOpen);
                handleRead(); // Call handleRead function
              }}
              className={`w-full h-full p-[5px] ${isOpen ? 'text-[#5261eb]' : 'text-slate-300'} active:scale-90 hover:cursor-pointer`} />

          </div>
        </MenuHandler>
        <MenuList className="max-h-72 z-50 bg-slate-800 border-slate-700 w-80 left-0 right-9">
          <h1 className=" text-slate-300 font-semibold text-2xl p-3">
            Notifications
          </h1>
          <div>
            {
              notifications?.map((notification, index) => {
                return <MenuItem key={index} className="pl-3 px-2 hover:bg-slate-700 rounded-md min-h-14 py-[2px] hover:cursor-pointer">
                  <NotificationItems setTotal={setTotal} notification={notification} setNotifications={setNotifications} notifications={notifications} />
                </MenuItem>
              })
            }
          </div>
        </MenuList>
      </Menu>
    </>
  )
};
