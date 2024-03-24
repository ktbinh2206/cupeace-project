import { useEffect, useState } from "react"
import { actions, useStore } from "../../../store"

const DANGER = 'text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800'
const WARNING = 'text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800'
const SUCCESS = 'text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800'
const INFOR = 'text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800'

export default function NotificationItem(props) {
  const [isAppear, setIsAppear] = useState(true)

  const notification = props.notification

  const [state, dispatch] = useStore();
  useEffect(() => {
    setIsAppear(true)
    setTimeout(() => {
      setIsAppear(false);
      dispatch(actions.setNotificationPopup(null))
    }, 3000);
  }, [state])

  let type = ''
  switch (notification.type) {
    case 'infor':
      type = INFOR
      break
    case 'danger':
      type = DANGER
      break
    case 'warning':
      type = WARNING
      break
    case 'success':
      type = SUCCESS
      break
    default:
      throw new Error('Invalid type alert')
  }
  return (
    <>
      <div onClick={() => setIsAppear(false)} className={`${isAppear ? "" : " hidden"} flex items-center p-4 mb-4 text-sm animate-fade-left animate-ease-out ${type}`} role="alert">
        <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <div>
          <span className="font-medium">{notification.emphasize}!</span> {notification.content}
        </div>
      </div>

    </>
  )
}
