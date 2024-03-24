import { useEffect } from "react";
import { useStore } from "../../../store"
import NotificationItem from "./NotificationItem"

export default function NotificationPopup() {
  const [state] = useStore()
  useEffect(() => {

  }, [state.notification])
  return (
    <>
      <div className="fixed right-5 top-11 w-64 z-[100]">
        {
          state.notification ? state.notification.map((notification, index) => (
            <NotificationItem key={index} notification={notification} />
          )) : (<></>)
        }
      </div>
    </>
  )
}
