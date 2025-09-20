import { Link } from "react-router-dom";




export function NotFound() {
    return (
        <section>
            <div className="w-full flex flex-col items-center mt-50">
                <h1 className="text-8xl text-blue-900 font-bold flex items-start">
                    404
                </h1>

                <p className="text-3xl font-bold text-black/85 mt-2">
                    Página não encontrada :/ 
                </p>
                <p className="text-sm w-3/4 text-center mt-1">
                    Desculpe, A página que você está procurando não existe nesse site.
                </p>
                
                <Link to={"/"} className="mt-15 border-2 border-blue-900/65 px-4 py-2 rounded-xl font-medium text-blue-900 hover:bg-blue-900/85
                hover:text-white duration-300">
                    Página Inicial
                </Link>
            </div>
        </section>
    )
}