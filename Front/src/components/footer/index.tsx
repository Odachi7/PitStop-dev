import { Link } from "react-router-dom"
import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Logo e descrição */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-white">PitStop</span>
          </div>

          <p className="text-gray-400 leading-relaxed mb-6">
            Sua plataforma confiável para compra e venda de veículos.
            Conecte-se com vendedores verificados e encontre o carro perfeito
            para você.
          </p>

          <div className="flex space-x-4">
            <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer" />
            <Twitter className="h-5 w-5 text-gray-400 hover:text-sky-500 transition-colors cursor-pointer" />
            <Instagram className="h-5 w-5 text-gray-400 hover:text-pink-500 transition-colors cursor-pointer" />
          </div>
        </div>

        {/* Links rápidos */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Links rápidos</h3>
          <ul className="space-y-2">
            <li>
              <Link to={"/catalogo"} onClick={handleClick} className="hover:text-white transition-colors">Navegar por veículos</Link>
            </li>
            <li>
              <Link to="/vender" className="hover:text-white transition-colors">Venda seu veículo</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            </li>
            <li>
              <Link to="/imformacoesEmpresa" className="hover:text-white transition-colors">Como funciona</Link>
            </li>
            <li>
              <Link to="/dicas" className="hover:text-white transition-colors">Dicas de segurança</Link>
            </li>
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contate-nos</h3>
          <ul className="space-y-3">
            <li className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span>suporte@pitstop.com.br</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-blue-600" />
              <span>55 0800 PIT STOP</span>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span>São Paulo, Brasil</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Linha inferior */}
      <div className="border-t border-gray-800 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} PitStop. Todos os direitos reservados.</p>
          <div className="flex space-x-6 mt-3 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos de Serviço</a>
            <a href="#" className="hover:text-white transition-colors">Política de Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
