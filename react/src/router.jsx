import { createBrowserRouter } from "react-router-dom";
import Login from "./Components/Public/Login";
import Signup from "./Components/Public/Signup";
import Homepage from "./Components/Public/Homepage";
import GuestLayout from "./Components/Layouts/GuestLayout";
import Search from "./Components/Public/Search";
import DefaultLayout from "./Components/Layouts/DefaultLayout";
import Library from "./Components/Protected/Library";
import LoginedRoute from "./Components/Protected/LoginedRoute";
import UploadSong from "./Components/Protected/UploadSong";
import Songs from "./Components/Protected/Library/Songs";
import Playlists from "./Components/Protected/Library/Playlists";
import AdminLayout from "./Components/Layouts/AdminLayout";
import Dashboard from "./Components/Admin/Dashboard";
import Account from "./Components/Admin/Account";
import Song from "./Components/Admin/Song";
import ArtistProfile from "./Components/Public/ArtistProfile";


const router = createBrowserRouter([

  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: <Homepage />
      },
      {
        path: '/search',
        element: <Search />
      },
      {
        path: '/library',
        element:
          <LoginedRoute>
            <Library />
          </LoginedRoute>,
        children: [
          {
            path: '/library/songs',
            element: <Songs />
          },
          {
            path: '/library/playlists',
            element: <Playlists />
          },
        ]
      },
      {
        path: '/artist/:id',
        element:
          <ArtistProfile />
      },
    ]
  },
  {
    path: '/upload-song',
    element:
      <LoginedRoute>
        <UploadSong />
      </LoginedRoute>
  },
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Signup />
      },
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: '/admin/accounts',
        element: <Account />
      },
      {
        path: '/admin/songs',
        element: <Song />
      },
    ]
  }
])
export default router;
