import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { Search } from "lucide-react";

interface SearchAvancedProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: "all" | "Carro" | "Moto";
  setSelectedCategory: (value: "all" | "Carro" | "Moto") => void;
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
  priceRange: "all" | "Menos de 20k" | "20k-40k" | "Mais de 40k";
  setPriceRange: (value: "all" | "Menos de 20k" | "20k-40k" | "Mais de 40k") => void;
}

export function SearchAvanced({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  priceRange,
  setPriceRange
}: SearchAvancedProps) {
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

    const resetFilters = () => {
        setSearchTerm("");
        setSelectedCategory("all");
        setSelectedBrand("all");
        setPriceRange("all");
    };

    return (
        <section className="w-full pt-7 px-4 pb-8 bg-white/85 shadow-md shadow-black/20">
            <AnimatePresence>
            <div className="w-full max-w-[1380px] mx-auto flex flex-col items-center justify-center">
                <div className="relative w-2/3 lg:w-full">
                    <input 
                        type="text"
                        placeholder="Pesquisar Veículos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-1 border-black/30 rounded-lg focus:border-black/70 focus:outline-none" 
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/60 w-5 h-5" />
                </div>

                <button className="lg:hidden mt-5 bg-zinc-200 px-4 py-2 rounded-lg border-1 border-zinc-300/40 font-medium cursor-pointer" onClick={() => setIsFiltro(!isFiltro)}>
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
                                        {selectedCategory === "all" ? "Todas Categorias" : 
                                         selectedCategory === "Carro" ? "Carros" : "Motos"}
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
                                            <li
                                                className={`py-2 px-5 hover:bg-zinc-200 cursor-pointer rounded-lg text-black/90 ${selectedCategory === "all" ? "bg-zinc-200" : ""}`}
                                                onClick={() => {
                                                    setSelectedCategory("all");
                                                    setIsCategoria(false);
                                                }}
                                            >
                                                Todas Categorias
                                            </li>
                                            <li
                                                className={`py-2 px-5 hover:bg-zinc-200 cursor-pointer rounded-lg text-black/90 ${selectedCategory === "Carro" ? "bg-zinc-200" : ""}`}
                                                onClick={() => {
                                                    setSelectedCategory("Carro");
                                                    setIsCategoria(false);
                                                }}
                                            >
                                                Carros
                                            </li>
                                            <li
                                                className={`py-2 px-5 hover:bg-zinc-200 cursor-pointer rounded-lg text-black/90 ${selectedCategory === "Moto" ? "bg-zinc-200" : ""}`}
                                                onClick={() => {
                                                    setSelectedCategory("Moto");
                                                    setIsCategoria(false);
                                                }}
                                            >
                                                Motos
                                            </li>
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
                                        {selectedBrand === "all" ? "Todas Marcas" : selectedBrand}
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
                                            <li
                                                className={`py-2 px-5 hover:bg-zinc-200 cursor-pointer rounded-lg text-black/90 ${selectedBrand === "all" ? "bg-zinc-200" : ""}`}
                                                onClick={() => {
                                                    setSelectedBrand("all");
                                                    setIsmarcas(false);
                                                }}
                                            >
                                                Todas Marcas
                                            </li>
                                            {["Toyota", "Honda", "Ford", "Chevrolet", "BMW", "Mercedes", "Audi", "Volkswagen"].map((brand) => (
                                                <li
                                                    key={brand}
                                                    className={`py-2 px-5 hover:bg-zinc-200 cursor-pointer rounded-lg text-black/90 ${selectedBrand === brand ? "bg-zinc-200" : ""}`}
                                                    onClick={() => {
                                                        setSelectedBrand(brand);
                                                        setIsmarcas(false);
                                                    }}
                                                >
                                                    {brand}
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
                                        {priceRange === "all" ? "Todos Preços" : 
                                         priceRange === "Menos de 20k" ? "Abaixo de $20k" :
                                         priceRange === "20k-40k" ? "$20k - $40k" : "Acima de $40k"}
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
                                            <li
                                                className={`py-2 px-5 hover:bg-zinc-200 cursor-pointer rounded-lg text-black/90 ${priceRange === "all" ? "bg-zinc-200" : ""}`}
                                                onClick={() => {
                                                    setPriceRange("all");
                                                    setIsprecos(false);
                                                }}
                                            >
                                                Todos Preços
                                            </li>
                                            <li
                                                className={`py-2 px-5 hover:bg-zinc-200 cursor-pointer rounded-lg text-black/90 ${priceRange === "Menos de 20k" ? "bg-zinc-200" : ""}`}
                                                onClick={() => {
                                                    setPriceRange("Menos de 20k");
                                                    setIsprecos(false);
                                                }}
                                            >
                                                Abaixo de $20k
                                            </li>
                                            <li
                                                className={`py-2 px-5 hover:bg-zinc-200 cursor-pointer rounded-lg text-black/90 ${priceRange === "20k-40k" ? "bg-zinc-200" : ""}`}
                                                onClick={() => {
                                                    setPriceRange("20k-40k");
                                                    setIsprecos(false);
                                                }}
                                            >
                                                $20k - $40k
                                            </li>
                                            <li
                                                className={`py-2 px-5 hover:bg-zinc-200 cursor-pointer rounded-lg text-black/90 ${priceRange === "Mais de 40k" ? "bg-zinc-200" : ""}`}
                                                onClick={() => {
                                                    setPriceRange("Mais de 40k");
                                                    setIsprecos(false);
                                                }}
                                            >
                                                Acima de $40k
                                            </li>
                                        </ul>
                                    </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Button 
                                size={"lg"} 
                                className="w-full flex items-center justify-center py-2.5 cursor-pointer border-1 border-black/20 rounded-lg"
                                onClick={resetFilters}
                            >
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