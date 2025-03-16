import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";

const NavLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default NavLayout;
