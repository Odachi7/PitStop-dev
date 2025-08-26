import { createContext, useState, type ReactNode } from "react";

interface UserProviderProps {
    children: ReactNode;
}

type UserContextData = {    
    menu: () => void;
    isMenuOpen: boolean;
    setIsMenuOpen: (boolean: boolean) => void;
}

export const Usercontext = createContext({} as UserContextData)

function UserProvider({children}: UserProviderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    function menu() {
        setIsMenuOpen(!isMenuOpen)
    }


    return (
        <Usercontext.Provider value={{ menu, isMenuOpen, setIsMenuOpen }}>
            {children}
        </Usercontext.Provider>
    )
}

export default UserProvider;