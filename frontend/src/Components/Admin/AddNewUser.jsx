import { useEffect, useRef, useState } from "react";
import axiosClient from "../../CommonAction/axios";

export default function AddNewUser({ openAddUserModal }) {

  const labelRef = useRef()
  const input = useRef()

  const [roles, setRoles] = useState()
  const [avatar, setAvatar] = useState()
  const [data, setData] = useState({
    name: '',
    email: '',
    avatarFile: null,
    password: '',
    role: '',
  })

  useEffect(() => {

    const controller = new AbortController()
    const signal = controller.signal
    axiosClient
      .get('/roles', { signal })
      .then(({ data }) => {
        setRoles(data)
      })
      .catch((err) => {
        console.log(err);
      })
    return () => {
      controller.abort()
    }
  }, [])

  const handleChangeSong = (e) => {
    const files = e.target.files[0];
    let image = URL.createObjectURL(files);
    setData({ ...data, avatarFile: files })
    setAvatar(image)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    axiosClient
      .post('/users', { data })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const handleDrop = (e) => {
    const files = e.dataTransfer.files;
    input.current.files = files;
    labelRef.current.className = " flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"

    e.preventDefault()
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    labelRef.current.className = " bg-gray-600 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    labelRef.current.className = " flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
  }

  return (
    <div className={`absolute min-h-60 min-w-96 max-w-[40rem] rounded-md bg-[#0c1046] border border-slate-600 top-[10vh] right-0 left-0 mx-auto z-50 ${openAddUserModal || 'hidden'}`}>
      <form onSubmit={handleSubmit} action="#" method="post">
        <header className=" text-slate-300">
          <h1 className="font-semibold text-center py-2 text-2xl border-b border-slate-600">
            Add New User
          </h1>
          {/* Avatar */}
          <div className="w-full p-2">
            <label htmlFor="name" className="block font-semibold pb-2">Avatar</label>
            <div className="flex items-center gap-2">
              <label
                ref={labelRef}
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-1/2 h-25 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload
                    <br />
                  </span> or drag and drop</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Image File</p>
                </div>
              </label>
              <input
                autoComplete='off'
                id="dropzone-file"
                ref={input}
                type="file"
                hidden
                onChange={handleChangeSong}
                accept="image/*" />
              {
                avatar && (<img className=" object-cover rounded-full w-40 h-40 m-auto" src={avatar} />)
              }
            </div>
          </div>
          {/* Name */}
          <div className="p-2">
            <label htmlFor="name" className="block font-semibold pb-2">Name</label>
            <input
              type="text"
              id="name"
              className="block rounded w-full bg-slate-600 text-white px-2 py-1 "
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>
          {/* Email */}
          <div className="p-2">
            <label htmlFor="email" className="block font-semibold pb-2">Email</label>
            <input
              type="email"
              id="email"
              className="block rounded w-full bg-slate-600 text-white px-2 py-1 "
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })} />
          </div>
          {/* Password */}
          <div className="p-2">
            <label htmlFor="password" className="block font-semibold pb-2">Password</label>
            <input
              type="password"
              id="password"
              className="block rounded w-full bg-slate-600 text-white px-2 py-1 "

              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.pas })} />
          </div>
          <div className="p-2">
            <label htmlFor="role" className="block font-semibold pb-2">Role</label>
            <select
              type="check"
              id="role"
              className="block rounded w-fit bg-slate-600 text-white px-2 py-1 "
              value={data.role}
              onChange={(e) => setData({ ...data, role: e.target.value })}
            >
              {
                roles?.map((role) => (
                  <option key={role.id} value={role.name}>{role.name}</option>
                ))
              }
            </select>
          </div>
          <div className="flex justify-end gap-2 p-3">
            <button
              className="font-bold text-slate-400 hover:text-slate-500 active:scale-95"
              onClick={(e) => { e.preventDefault(); console.log('cancel'); }}
            >Cancle</button>
            <button type="submit" className="hover:bg-[#3c3e92] active:scale-95 rounded-md pl-1 pr-2 py-1 inline-flex items-center content-center border border-transparent font-[500] text-xs bg-[#6366f1] text-white">
              <span
                className="hidden sm:block ml-2 my-1 text-nowrap text-[1.1rem]"
              >
                {'Create User'}
              </span>
            </button>
          </div>
        </header>
      </form>
    </div>
  )
};
