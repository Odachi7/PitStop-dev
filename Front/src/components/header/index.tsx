import { Link } from "react-router-dom"
import { useContext } from "react"
import { Usercontext } from "../../context/user"
import { AnimatePresence, motion } from "framer-motion"

import { HeaderMobile } from "../headerMobile"
import { UserCircle } from "phosphor-react"

export function Header() {
    const { menu, isMenuOpen } = useContext(Usercontext)

    return (
        <header className="bg-white shadow-sm border-b border-zinc-300 sticky top-0 z-50">
            <AnimatePresence>
                <div className="px-3 lg:px-6">
                    <div className="flex justify-between items-center h-17">
                        <Link to={"/"} className="flex items-center gap-2 text-blue-900">
                            <i className="ri-roadster-fill text-2xl md:text-3xl"></i>
                            <h1 className="text-xl md:text-2xl font-black">
                                PitStop
                            </h1>
                        </Link>

                        <div className="hidden lg:flex items-center space-x-4">
                            <Link to={"/login"} className="text-md text-blue-900 font-medium cursor-pointer p-2 hover:text-blue-950 hover:rotate-2 duration-100 transition-all">
                                Comprar
                            </Link>

                            <Link to={"/vender"} className="text-md text-blue-900 font-medium cursor-pointer p-2 hover:text-blue-950 hover:rotate-2 duration-100 transition-all">
                                Vender
                            </Link>
                             
                            <Link to={"/assinar"} className="text-md text-blue-900 font-medium cursor-pointer p-2 hover:text-blue-950 hover:rotate-2 duration-100 transition-all">
                                Assinar
                            </Link>

                            <Link to={"/assinar"} className="text-md text-blue-900 font-medium cursor-pointer p-2 hover:text-blue-950 hover:rotate-2 duration-100 transition-all">
                                Ajuda
                            </Link>
                         
                        </div>

                        
                        <Link to={"/login"} className="hidden lg:flex items-center justify-center gap-1 border-l border-blue-900/40 h-17 pl-3">
                            <span className="text-blue-900"><UserCircle size={28} /></span>
                            
                            <p  className="text-blue-900">
                                Entrar
                            </p>
                        </Link>
                

                        {/* Button Mobile */}
                        <motion.button
                            animate={{ rotate: isMenuOpen ? 180 : -180 }}
                            transition={{duration: 0.4}}
                            className="lg:hidden text-3xl text-blue-900 cursor-pointer " 
                            onClick={menu}
                        >
                            {!isMenuOpen ? <i className="ri-menu-line"></i> : <i className="ri-close-fill"></i>}
                         </motion.button>                    
                    </div>

                    <HeaderMobile/>
                </div>
            </AnimatePresence>
        </header>
    )
}