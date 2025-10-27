import { useContext, useEffect, useState } from "react"
import { Usercontext } from "../../context/userContext"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion";
import { Car, Jeep } from "phosphor-react";
import { apiService } from "../../lib/api";

export function HeaderMobile() {
    const { isMenuOpen, setIsMenuOpen, reloadVehicles } = useContext(Usercontext)
    const [ isCompra, setIsCompra ] = useState(false)
    const [ isVenda, setIsVenda ] = useState(false)
    const [ isAssinar, setIsAssinar ] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    
        useEffect(() => {
            const token = localStorage.getItem('auth_token')
            setIsLoggedIn(!!token)
        }, [])
    
        const handleLogout = () => {
            apiService.logout()
            setIsLoggedIn(false)
            reloadVehicles()
        }

    function toggleMenu(type: "compra" | "venda" | "assinar") {
        setIsCompra(type === "compra" ? !isCompra : false);
        setIsVenda(type === "venda" ? !isVenda : false);
        setIsAssinar(type === "assinar" ? !isAssinar : false);
    }

    return (
        <header>
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden border-t border-blue-950/30 bg-white"
                        >
                            <div className="pt-2 pb-3 space-y-1">
                                {!isLoggedIn && (
                                    <Link
                                    to="/login"
                                    className="block px-3 py-2 text-blue-900 font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                    >
                                        Entrar / Cadastrar
                                    </Link>
                                )}

                                <div className="flex flex-col justify-center gap-1 my-2">
                                    <button className="w-full flex items-center justify-between cursor-pointer"  onClick={() => toggleMenu("compra")}>
                                        <p className="block px-3 py-2 text-blue-900 font-medium">
                                            Comprar 
                                        </p>
                                        <motion.button 
                                            animate={{ rotate: isCompra ? 180 : 0 }}
                                            transition={{duration: 0.4}}
                                            >
                                            <i className="ri-arrow-down-s-line text-blue-900 text-2xl cursor-pointer"></i>
                                        </motion.button>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isCompra && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex flex-col bg-gray-100 rounded-lg"    
                                                >
                                                    <Link to={"/"} className="flex items-center gap-4 px-6 py-3 text-blue-900 font-medium mt-2 border-b border-blue-900/15">
                                                        <Car size={24} />  Carros usados
                                                    </Link>
                                                    
                                                    <Link to={"/"} className="flex items-center gap-4 px-6 py-4 text-blue-900 font-medium border-b border-blue-900/15">
                                                        <Jeep size={24}/>  Carros novos
                                                    </Link>
                                                    
                                                    <Link to={"/"} className="flex items-center gap-4 px-6 py-3 text-blue-900 font-medium border-b border-blue-900/15">
                                                        <i className="ri-e-bike-line text-2xl"></i>  Motos usadas
                                                    </Link>
                                                    
                                                    <Link to={"/"} className="flex items-center gap-4 px-6 py-3 text-blue-900 font-medium mb-2">
                                                        <i className="ri-motorbike-line text-2xl"></i> Motos novas
                                                    </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex flex-col justify-center gap-1 my-2">
                                    <button className="w-full flex items-center justify-between cursor-pointer"  onClick={() => toggleMenu("venda")}>
                                        <p className="block px-3 py-2 text-blue-900 font-medium">
                                            Vender
                                        </p>
                                        <motion.button 
                                            animate={{ rotate: isVenda ? 180 : 0 }}
                                            transition={{duration: 0.4}}
                                            >
                                            <i className="ri-arrow-down-s-line text-blue-900 text-2xl cursor-pointer"></i>
                                        </motion.button>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isVenda && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex flex-col bg-gray-100 rounded-lg"    
                                                >
                                                    <Link to={"/"} className="flex items-center gap-4 px-6 py-3 text-blue-900 font-medium mt-2 border-b border-blue-900/15">
                                                        <Car size={24} />  Vender carro
                                                    </Link>
                                                    
                                                    <Link to={"/"} className="flex items-center gap-4 px-6 py-3 text-blue-900 font-medium mb-1">
                                                        <i className="ri-e-bike-line text-2xl"></i>  Vender moto
                                                    </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            
                                <div className="flex flex-col justify-center gap-1 my-2">
                                    <button className="w-full flex items-center justify-between cursor-pointer"  onClick={() => toggleMenu("assinar")}>
                                        <p className="block px-3 py-2 text-blue-900 font-medium">
                                            Assinar
                                        </p>
                                        <motion.button 
                                            animate={{ rotate: isAssinar ? 180 : 0 }}
                                            transition={{duration: 0.4}}
                                            >
                                            <i className="ri-arrow-down-s-line text-blue-900 text-2xl cursor-pointer"></i>
                                        </motion.button>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isAssinar && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex flex-col bg-gray-100 rounded-lg px-4"    
                                                >
                                                    <Link to={"/"} className="flex items-center gap-4 px-3 py-6 text-blue-900 font-medium">
                                                        <Car size={24} />  Carros por assinatura
                                                    </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {isLoggedIn && (
                                    <div className="flex flex-col justify-center gap-1 my-2">
                                        <button className="w-full flex items-center justify-between cursor-pointer"  onClick={() => handleLogout()}>
                                            <p className="block px-3 py-2 text-blue-900 font-medium">
                                                Sair da Conta
                                            </p>
                                        </button>
                                    </div>
                                )}
                            </div>
                    </motion.div>
                 )}
             </AnimatePresence>
         </header>
     )
}