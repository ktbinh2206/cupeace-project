import { Outlet } from "react-router";
import Logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";

function GuestLayout() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link to={"/"}>
            <img
              className="mx-auto mt-10 h-16 w-auto"
              src={Logo}
              alt="Your Company"
            /></Link>
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default GuestLayout;
