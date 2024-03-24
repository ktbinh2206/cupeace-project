import { useEffect } from "react";
import { useNavigate } from "react-router"
import { actions, useStore } from "../../store";

export default function LoginedRoute({ children }) {

  const [state, dispatch] = useStore()

  const user = state.currentUserID

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      dispatch(actions.setNotificationPopup([{
        type:'warning',
        emphasize:'LOGIN REQUIRED',
        content: 'You need login first'
      }]))
      navigate('/login')
    }
  }, [user, navigate])
  return children
}
