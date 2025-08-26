import { Outlet } from "react-router-dom";
import { Header } from "../header";
import UserProvider from "../../context/user";

export function Layout() {
    return (
        <>
            <UserProvider>
                <Header />
                <Outlet />
            </UserProvider>
        </>
    )
}