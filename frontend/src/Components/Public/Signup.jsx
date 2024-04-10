import { useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/signup.css";
import axiosClient from "../../CommonAction/axios";
import router from "../../router";
import { actions, useStore } from "../../store";
import { ArrowPathIcon } from "@heroicons/react/24/solid"

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [loading, setLoading] = useState()

  const [state, dispatch] = useStore();

  const handleSumit = (e) => {
    e.preventDefault();
    setLoading(true)
    setErrors({
      ...errors,
      others: '',
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    })
    axiosClient
      .post('/signup', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      .then(({ data }) => {
        dispatch(actions.setNotificationPopup([{
          type: 'success',
          emphasize: 'ACCOUNT CREATED',
          content: 'Your account is created'
        }]))
        setLoading(false)
        router.navigate('/login')
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.data?.errors?.name) {
            setErrors({ ...errors, name: error.response.data.errors.name.join(', ') })
          } else if (error.response.data?.errors?.email) {
            setErrors({ ...errors, email: error.response.data.errors.email.join(', ') })
          } else if (error.response.data?.errors?.password) {
            setErrors({ ...errors, password: error.response.data.errors.password.join(', ') })
          } else if (error.response.data?.errors?.password_confirmation) {
            setErrors({ ...errors, password_confirmation: error.response.data.errors.password_confirmation.join(', ') })
          } else {
            dispatch(actions.setNotificationPopup([
              {
                type: 'danger',
                emphasize: 'INTERNAL SERVER ERROR',
                content: 'Please try later'
              }
            ]))
          }
        } else {
          dispatch(actions.setNotificationPopup([
            {
              type: 'danger',
              emphasize: 'SYSTEM ERROR',
              content: 'Something go wrong'
            }
          ]))
        }
        setLoading(false)
      })
  }
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className=" text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Sign up new account
          </h2>
        </div>
        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSumit} className="space-y-6" action="#" method="POST">

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="full-name"
                  name="name"
                  type="text"
                  value={name}
                  className=" p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {errors.name && (
                <div className={`p-2 mt-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 sm:mx-auto sm:w-full sm:max-w-sm `} role="alert">
                  <span className="font-medium">{errors.name}</span>
                </div>
              )}
            </div>
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
                  className=" p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && (
                <div className={`p-2 mt-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 sm:mx-auto sm:w-full sm:max-w-sm `} role="alert">
                  <span className="font-medium">{errors.email}</span>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  autoComplete="current-password"
                  className=" p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {errors.password && (
                <div className={`p-2 mt-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 sm:mx-auto sm:w-full sm:max-w-sm `} role="alert">
                  <span className="font-medium">{errors.password}</span>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password_confirmation" className="block text-sm font-medium leading-6 text-white">
                  Password Confirmation
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password-confirmation"
                  name="password-confirmation"
                  type="password"
                  autoComplete="current-password"
                  value={passwordConfirmation}
                  className=" p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter Password Confirmation"
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                />
              </div>
              {errors.password_confirmation && (
                <div className={`p-2 mt-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 sm:mx-auto sm:w-full sm:max-w-sm `} role="alert">
                  <span className="font-medium">{errors.password_confirmation}</span>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="flex items-center w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:bg-violet-700"
              >
                <ArrowPathIcon className={`w-4 h-4 absolute animate-spin mr-20 ${loading || 'hidden'} `} />
                Sign Up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already has account?{' '}
            <Link to={"/login"}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
