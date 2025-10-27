import { Link } from "react-router-dom";

export function HomeInitialSection() {

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
         <section className="relative bg-[url('/src/assets/PapelParedeHome.jpeg')] bg-cover bg-center h-[460px] min-lg:h-screen">
            <div className="absolute inset-0 bg-black/63 z-0"></div>

            <div className="relative z-10 w-full h-full flex flex-col justify-center items-center p-2 min-lg:h-screen">
                <h1 className="text-4xl md:text-5xl lg:text-6xl text-center max-sm:mt-7 mb-5 lg:mb-7 font-bold text-white select-none">
                    Encontre seu próximo veículo
                </h1>

                <p className="text-center text-lg w-90 md:w-full md:text-xl lg:text-3xl lg:max-w-3xl font-medium text-white select-none">
                    Motos e Carros Premiums de vendedores confiáveis!
                </p>

                <Link to={"/catalogo"}
                    onClick={handleClick}
                    className="mt-10 lg:mt-12 mb-10 text-white text-lg lg:text-3xl border-1 shadow px-4 py-1 rounded-md font-bold cursor-pointer select-none
                    hover:bg-white hover:text-black duration-300"
                >
                    Ver Catálogo
                </Link>
            </div>
        </section>

    )
}