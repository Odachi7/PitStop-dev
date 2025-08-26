import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { Search } from "lucide-react";

export function SearchAvanced() {
    const [ categoria, setIsCategoria ] = useState(false)
    const [ marcas, setIsmarcas ] = useState(false)
    const [ precos, setIsprecos ] = useState(false)
    const [ isFiltro, setIsFiltro ] = useState(false)
    const [ isMobile, setIsMobile ] = useState(false)

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth <= 768) {
                setIsMobile(true)
            }
        }

        handleResize(); 
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [])

    function toggleMenu(type: "categoria" | "marcas" | "precos") {
        setIsCategoria(type === "categoria" ? !categoria : false);
        setIsmarcas(type === "marcas" ? !marcas : false);
        setIsprecos(type === "precos" ? !precos : false);
    }

    /* 
    const filteredVehicles = vehicles.filter((vehicle) => {
        const matchesSearch = vehicle.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === "all" || vehicle.category === selectedCategory
        const matchesBrand = selectedBrand === "all" || vehicle.brand === selectedBrand
        const matchesPrice =
        priceRange === "all" ||
        (priceRange === "under-20k" && vehicle.price < 20000) ||
        (priceRange === "20k-40k" && vehicle.price >= 20000 && vehicle.price <= 40000) ||
        (priceRange === "over-40k" && vehicle.price > 40000)

        return matchesSearch && matchesCategory && matchesBrand && matchesPrice
    })
    */ 


    return (
        <section className="w-full pt-7 px-4 pb-8 bg-white/85 shadow-md shadow-black/20">
            <AnimatePresence>
            <div className="w-full max-w-[1380px] mx-auto flex flex-col items-center justify-center">
                <div className="relative w-2/3 lg:w-full">
                    <input 
                        type="text"
                        placeholder="Pesquisar Veículos..."
                        className="w-full pl-10 pr-4 py-2 border-1 border-black/30 rounded-lg focus:border-black/70 focus:outline-none" 
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/60 w-5 h-5" />
                </div>

                <button className="md:hidden mt-5 bg-zinc-200 px-4 py-2 rounded-lg border-1 border-zinc-300/40 font-medium cursor-pointer" onClick={() => setIsFiltro(!isFiltro)}>
                    Filtros
                </button>

                <AnimatePresence initial={false}>
                    {(isFiltro || !isMobile) && (
                        <motion.div  
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{
                                opacity: 0,
                                y: 20,
                                scale: 0.95,
                                transition: {
                                    duration: 0.2,
                                    ease: [0.4, 0, 1, 1],
                                },
                            }}
                            transition={{
                                duration: 0.4,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="w-full flex max-md:flex-col items-center justify-center mt-4 gap-4">
                            <div className="w-full relative">
                                <Button
                                    size={"lg"}
                                    className="w-full flex items-center justify-between px-2 py-1 cursor-pointer border-1 border-black/20 rounded-lg"
                                    onClick={() => toggleMenu("categoria")}
                                >
                                    <p className="block px-3 py-2 text-black">
                                        Todas Categorias
                                    </p>

                                    <motion.button
                                        animate={{ rotate: categoria ? 180 : 0 }}
                                        transition={{ duration: 0.4 }}
                                        >
                                        <i className="ri-arrow-down-s-line text-black/70 text-2xl cursor-pointer"></i>
                                    </motion.button>
                                </Button>

                                <AnimatePresence initial={false}>
                                    {categoria && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{
                                            opacity: 0,
                                            y: 20,
                                            scale: 0.95,
                                            transition: {
                                                duration: 0.2,
                                                ease: [0.4, 0, 1, 1],
                                            },
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                        className="absolute top-full mt-2 left-0 z-50 w-full flex flex-col bg-white rounded-lg border-1 border-black/30 shadow-md"
                                        >
                                        <ul className="w-full p-2">
                                            {["Moto", "Carro", "Caminhão"].map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="py-2 px-5 hover:bg-zinc-200 cursor-pointer rounded-lg text-black/90"
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="w-full relative">
                                <Button
                                    size={"lg"}
                                    className="w-full flex items-center justify-between px-2 py-1 cursor-pointer border-1 border-black/20 rounded-lg"
                                    onClick={() => toggleMenu("marcas")}
                                >
                                    <p className="block px-3 py-2 text-black">
                                        Todas Marcas
                                    </p>

                                    <motion.button
                                        animate={{ rotate: marcas ? 180 : 0 }}
                                        transition={{ duration: 0.4 }}
                                        >
                                        <i className="ri-arrow-down-s-line text-black/70 text-2xl cursor-pointer"></i>
                                    </motion.button>
                                </Button>

                                <AnimatePresence initial={false}>
                                    {marcas && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{
                                            opacity: 0,
                                            y: 20,
                                            scale: 0.95,
                                            transition: {
                                                duration: 0.2,
                                                ease: [0.4, 0, 1, 1],
                                            },
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                        className="absolute top-full mt-2 left-0 z-50 w-full flex flex-col bg-white rounded-lg border-1 border-black/30 shadow-md"
                                        >
                                        <ul className="w-full p-2">
                                            {["Moto", "Carro", "Caminhão"].map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="py-2 px-5 hover:bg-zinc-200 cursor-pointer rounded-lg text-black/90"
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>


                            <div className="w-full relative">
                                <Button
                                    size={"lg"}
                                    className="w-full flex items-center justify-between px-2 py-1 cursor-pointer border-1 border-black/20 rounded-lg"
                                    onClick={() => toggleMenu("precos")}
                                >
                                    <p className="block px-3 py-2 text-black">
                                        Todos Preços
                                    </p>

                                    <motion.button
                                        animate={{ rotate: precos ? 180 : 0 }}
                                        transition={{ duration: 0.4 }}
                                        >
                                        <i className="ri-arrow-down-s-line text-black/70 text-2xl cursor-pointer"></i>
                                    </motion.button>
                                </Button>

                                <AnimatePresence initial={false}>
                                    {precos && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{
                                            opacity: 0,
                                            y: 20,
                                            scale: 0.95,
                                            transition: {
                                                duration: 0.2,
                                                ease: [0.4, 0, 1, 1],
                                            },
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                        className="absolute top-full mt-2 left-0 z-50 w-full flex flex-col bg-white rounded-lg border-1 border-black/30 shadow-md"
                                        >
                                        <ul className="w-full p-2">
                                            {["Moto", "Carro", "Caminhão"].map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="py-2 px-5 hover:bg-zinc-200 cursor-pointer rounded-lg text-black/90"
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Button size={"lg"} className="w-full flex items-center justify-center py-2.5 cursor-pointer border-1 border-black/20 rounded-lg">
                                Limpar Filtros
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            </AnimatePresence>
        </section>
    )
}