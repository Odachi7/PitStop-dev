import { Link } from "react-router-dom"
import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Car className="h-8 w-8 text-blue-900" />
              <span className="text-xl font-bold">PitStop</span>
            </div>
            <p className="text-gray-400 mb-4">
              Sua plataforma confiável para compra e venda de veículos. Conecte-se com vendedores verificados e encontre o seu
              carro perfeito.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              Links rápidos
            </h3>

            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Navegar por veículos
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-gray-400 hover:text-white">
                  Venda seu Veículo
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Como funciona
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Dicas de segurança
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              Categorias
            </h3>

            <ul className="space-y-2">
              <li>
                <Link to="/?category=car" className="text-gray-400 hover:text-white">
                  Carros
                </Link>
              </li>
              <li>
                <Link to="/?category=motorcycle" className="text-gray-400 hover:text-white">
                  Motos
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Veículos de Luxo
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Veículos Elétricos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Carros Clássicos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              Contate-nos
            </h3>
            
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />

                <span className="text-gray-400">
                  suporte@pitstop.com.br
                </span>
              </li>

              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />

                <span className="text-gray-400">
                  55-0800-PIT-STOP
                </span>
              </li>
              
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />

                <span className="text-gray-400">
                  SÃO PAULO, BRASIL
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 PitStop. Todos direitos Reservados.
            </p>

            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Política de Privacidade
              </a>

              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Termos de Serviço
              </a>

              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Política de Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
