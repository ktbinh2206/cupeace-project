import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axiosClient from "../../CommonAction/axios";
import router from "../../router"
import { useStore, actions } from "../../store";
import { ArrowPathIcon } from "@heroicons/react/24/solid"

export default function Login() {
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [state, dispatch] = useStore()

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError('')
    setError('')
    setPasswordError('')
    setLoading(true)
    axiosClient
      .post("/login", {
        email,
        password
      })
      .then(({ data }) => {
        dispatch(actions.setNotificationPopup([{
          type: 'success',
          emphasize: 'LOGIN SUCCESSFULLY',
          content: ' You have just login system'
        }]))
        dispatch(actions.setCurrentToken(data.token));
        dispatch(actions.setCurrentUserID(data.user.id));
        setLoading(false)
        router.navigate("/");
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.data?.errors?.email) {
            setEmailError(error.response.data.errors.email.join(', '));
          } else if (error.response.data?.errors?.password) {
            setPasswordError(error.response.data.errors.password.join(', '))
          } else {
            setError(error.response.data.message)
          }
        } else {
          setError('Something went wrong')
        }
        setLoading(false)
      });
  };
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className=" text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>
        {error && (
          <div className={`p-2 mt-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 sm:mx-auto sm:w-full sm:max-w-sm `} role="alert">
            <span className="font-medium">{error}</span>
          </div>
        )}
        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={e =>
                    setEmail(e.target.value)
                  }
                  className=" p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter email"
                />
              </div>
              {emailError && (
                <div className={`p-2 mt-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 sm:mx-auto sm:w-full sm:max-w-sm `} role="alert">
                  <span className="font-medium">{emailError}</span>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className=" font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e =>
                    setPassword(e.target.value)
                  }
                  className=" p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter password"
                />
              </div>
              {passwordError && (
                <div className={`p-2 mt-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 sm:mx-auto sm:w-full sm:max-w-sm `} role="alert">
                  <span className="font-medium">{passwordError}</span>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                className=" items-center gap-3 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:bg-violet-700"
              >
                <ArrowPathIcon className={`w-4 h-4 absolute animate-spin mr-20 ${loading || 'hidden'} `}/>
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link to={"/signup"}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ">
              Sign up
            </Link>
          </p>
        </div>
      </div >
    </>
  )
}
