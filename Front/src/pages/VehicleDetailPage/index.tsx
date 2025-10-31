"use client"

import { useState, useEffect, useContext } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Palette,
  Car,
  Phone,
  Mail,
  MessageCircle,
  Shield,
  CheckCircle,
  Star,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
  Zap,
  Users,
  Award,
  AlertTriangle,
  Calculator,
} from "lucide-react"
import { Button } from "../../components/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card"
import { Badge } from "../../components/badge"
import { Progress } from "../../components/progress"
import Footer from "../../components/footer"
import { Usercontext } from "../../context/userContext"

type Vehicle = {
    id: number
    title: string
    price: number
    image1?: string  
    image2?: string  
    image3?: string  
    image4?: string  
    image5?: string 
    image6?: string  
    image7?: string  
    image8?: string   
    mileage: string
    transmission: string
    fuel: string
    category: "Carro" | "Moto"
    brand: string
    model?: string
    year: number
    location: string
    color?: string
    doors?: number
    engine?: string
    vin?: string
    description?: string
    seller?: {
        name: string
        phone: string
        email: string
        avatar: string
        memberSince: string
        otherListings: number
    }
}

export function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(false)
  const [viewCount, setViewCount] = useState(0)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  const { veiculos, suggestedVehicles, formatarReal } = useContext(Usercontext)
  
  useEffect(() => {
    if (veiculos) {
      setVehicles(veiculos)
    }
  }, [veiculos])

  console.log(veiculos)

  const vehicle = vehicles.find((v) => v.id === Number.parseInt(id || "0"))

  const getVehicleImages = (vehicle: Vehicle): string[] => {
    const images = [
      vehicle.image1,
      vehicle.image2,
      vehicle.image3,
      vehicle.image4,
      vehicle.image5, 
      vehicle.image6,
      vehicle.image7,
      vehicle.image8
    ].filter(Boolean) as string[] 
    
    return images
  }

  const vehicleImages = vehicle ? getVehicleImages(vehicle) : []

  useEffect(() => {
    setViewCount(Math.floor(Math.random() * 500) + 100)
  }, [id])

  if (!vehicle) {
    return (
      <div className="min-h-full">
        <div className="max-w-7xl h-170 flex justify-center items-center mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mb-8">
              <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Nenhum veículos encontrado!
              </h1>

              <p className="text-gray-600">
                Os veículos que você procura não existem ou foram removidos.
              </p>
            </div>
            
            <Link to="/">
              <Button className="group border-2 border-blue-900/65 px-4 py-2 rounded-xl font-medium text-blue-900 hover:bg-blue-900/85
                hover:text-white duration-300 cursor-pointer">
                <ArrowLeft className="h-4 w-4 mr-2 text-blue-900 group-hover:text-white duration-300" />
                Página Inicial
              </Button>
            </Link>
          </div>
        </div>

      </div>
    )
  }

  const nextImage = () => {
    if (vehicleImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % vehicleImages.length)
    }
  }

  const prevImage = () => {
    if (vehicleImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + vehicleImages.length) % vehicleImages.length)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vehicle.title,
        text: `Check out this ${vehicle.category}: ${vehicle.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  console.log(vehicleImages)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Header */}
            <div>
              <div className="flex flex-col gap-3 mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {vehicle.title}
                </h1>

                <div className="w-full flex items-center">
                  <Badge variant={vehicle.category === "Carro" ? "default" : "secondary"} className="text-gray-600 text-sm font-medium -mb-1 p-0 md:text-lg">
                    {vehicle.category === "Carro" ? <Car className="h-4 w-4 mr-1" /> : <i className="ri-e-bike-line text-2xl"></i>}
                    {vehicle.category === "Carro" ? "Carro" : "Moto"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-600">
                <div className="w-full flex items-center text-[12px]">
                  <MapPin className="h-4 w-4 mr-1" />
                  {vehicle.location}
                </div>

                <div className="w-full flex items-center text-[12px]">
                  <Eye className="h-4 w-4 mr-1" />
                  {viewCount} visualizações
                </div>

                <div className="w-full flex items-center text-[12px]">
                  <Clock className="h-4 w-4 mr-1" />
                  Listado há 3 dias
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold text-blue-900 mb-2">
                {formatarReal(vehicle.price)}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsLiked(!isLiked)}
                  className={`${isLiked ? "bg-red-50 border-red-200 text-red-600" : "bg-white"} cursor-pointer hover:shadow-xl hover:shadow-red-500/15 transition-shadow`}
                >
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                  {isLiked ? "Saved" : "Save"}
                </Button>

                <Button size="sm" variant="outline" onClick={handleShare} className="bg-white cursor-pointer hover:shadow-xl hover:shadow-black/15 transition-shadow">
                  <Share2 className="h-4 w-4 mr-1" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Galeria */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={vehicleImages.length > 0 ? vehicleImages[currentImageIndex] : vehicle.image1 || "/placeholder.svg"}
                    alt={vehicle.title}
                    className="w-full h-96 lg:h-[500px] object-cover"
                  />

                  {/* Navegação Imagem */}
                  {vehicleImages.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>

                      {/* Image Counter - Atualizado */}
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {vehicleImages.length}
                      </div>
                    </>
                  )}

                  {/* Distintivo de Condição */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Excelente condição
                    </Badge>
                  </div>
                </div>

                {/* Thumbnail Galeria */}
                {vehicleImages.length > 1 && (
                  <div className="p-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {vehicleImages.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`${vehicle.title} ${index + 1}`}
                          className={`w-20 h-16 object-cover rounded cursor-pointer border-2 transition-all ${
                            currentImageIndex === index
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Principais características */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-blue-900" />
                  Principais recursos e destaques
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Baixa Quilometragem</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Único proprietário</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Registros de serviço disponíveis</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Sem acidentes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Veículo especificações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-blue-900" />
                  Especificações do veículo
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">
                      Informações Basicas
                    </h4>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />

                          <span className="text-gray-600">
                            Ano
                          </span>
                        </div>

                        <span className="font-semibold">
                          {vehicle.year}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Car className="h-4 w-4 text-gray-400" />

                          <span className="text-gray-600">
                            Marca
                          </span>
                        </div>

                        <span className="font-semibold">
                          {vehicle.brand}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Gauge className="h-4 w-4 text-gray-400" />

                          <span className="text-gray-600">
                            Quilometragem
                          </span>
                        </div>

                        <span className="font-semibold">
                          {vehicle.mileage}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">
                      Desempenho
                    </h4>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Fuel className="h-4 w-4 text-gray-400" />

                          <span className="text-gray-600">
                            Tipo de combustível
                          </span>
                        </div>

                        <span className="font-semibold">
                          {vehicle.fuel}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Settings className="h-4 w-4 text-gray-400" />

                          <span className="text-gray-600">
                            Transmissão
                          </span>
                        </div>

                        <span className="font-semibold">
                          {vehicle.transmission}
                        </span>
                      </div>

                      {vehicle.engine && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4 text-gray-400" />

                            <span className="text-gray-600">
                              Motor
                            </span>
                          </div>

                          <span className="font-semibold">
                            {vehicle.engine}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">
                      Exterior
                    </h4>

                    <div className="space-y-3">
                      {vehicle.color && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Palette className="h-4 w-4 text-gray-400" />

                            <span className="text-gray-600">
                              Color
                            </span>
                          </div>

                          <span className="font-semibold">
                            {vehicle.color}
                          </span>
                        </div>
                      )}

                      {vehicle.doors && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-400" />

                            <span className="text-gray-600">
                              Portas
                            </span>
                          </div>

                          <span className="font-semibold">
                            {vehicle.doors}
                          </span>
                        </div>
                      )}

                      {vehicle.vin && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-gray-400" />

                            <span className="text-gray-600">
                              VIN
                            </span>
                          </div>

                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {vehicle.vin.slice(-6)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
              </CardContent>
            </Card>

            {/* Descrição do veículo */}
            {vehicle.description && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Descrição
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {vehicle.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Histórico do veículo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-blue-900" />
                  Histórico e condições do veículo
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  {/* Pontuação de condição */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        Overall Condition
                      </span>

                      <span className="text-green-600 font-semibold">
                        Excellent (9.2/10)
                      </span>
                    </div>

                    <Progress value={92} className="h-2" />
                  </div>

                  {/* Itens de História */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />

                      <div>
                        <div className="font-medium">
                          Sem acidentes
                        </div>

                        <div className="text-sm text-gray-600">
                          Histórico de acidentes limpo
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />

                      <div>
                        <div className="font-medium">
                          Manutenção regular
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          Registros de serviço disponíveis
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />

                      <div>
                        <div className="font-medium">
                          Único proprietário
                        </div>

                        <div className="text-sm text-gray-600">
                          Propriedade desde novo
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />

                      <div>
                        <div className="font-medium">
                          Não fumante
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          Interior livre de fumo
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Botões de preço e ação */}
            <Card className="sticky">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-blue-900 mb-2">
                    ${vehicle.price.toLocaleString()}
                  </div>

                  <div className="text-sm text-gray-600">
                    Valor de mercado: ${(vehicle.price * 1.1).toLocaleString()} - ${(vehicle.price * 1.2).toLocaleString()}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3"
                    onClick={() => setShowContactInfo(!showContactInfo)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Entre em contato com o vendedor
                  </Button>

                  {showContactInfo && vehicle.seller && (
                    <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Phone className="h-4 w-4 mr-2" />
                        {vehicle.seller.phone}
                      </Button>

                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Mail className="h-4 w-4 mr-2" />
                        {vehicle.seller.email}
                      </Button>
                    </div>
                  )}

                  <Button variant="outline" className="w-full bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agende um test drive
                  </Button>

                  <Button variant="outline" className="w-full bg-transparent">
                    <Shield className="h-4 w-4 mr-2" />
                    Obter relatório do veículo
                  </Button>
                </div>

              </CardContent>
            </Card>

            {/* Informações do vendedor */}
            {vehicle.seller && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-900" />
                    Informações do vendedor
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={vehicle.seller.avatar || "/placeholder.svg"}
                      alt={vehicle.seller.name}
                      className="w-16 h-16 rounded-full border-2 border-gray-200"
                    />

                    <div>
                      <h3 className="font-semibold text-lg">
                        {vehicle.seller.name}
                      </h3>

                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />

                        <span>
                          4.8 (127 reviews)
                        </span>
                      </div>

                      <p className="text-sm text-gray-600">
                        Membro desde {vehicle.seller.memberSince}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Taxa de resposta
                      </span>

                      <span className="font-semibold text-green-600">
                        98%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Tempo de resposta
                      </span>

                      <span className="font-semibold">
                        Dentro de 2 horas
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Listagens ativas
                      </span>

                      <span className="font-semibold">
                        {vehicle.seller.otherListings}
                      </span>
                    </div>
                  </div>

                  {vehicle.seller.otherListings > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <Button variant="outline" className="w-full text-sm bg-transparent">
                        Ver {vehicle.seller.otherListings} outra listagem {vehicle.seller.otherListings > 1 ? "s" : ""}
                      </Button>
                    </div>
                  )}

                </CardContent>
              </Card>
            )}

            {/* Calculadora de Financiamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-blue-900" />
                  Calculadora de Financiamento
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Pagamento inicial
                    </label>

                    <div className="mt-1 relative">
                      <span className="absolute left-3 top-3 text-gray-500">
                        $
                      </span>

                      <input
                        type="number"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="5000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Prazo do empréstimo
                    </label>

                    <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>36 meses</option>
                      <option>48 meses</option>
                      <option>60 meses</option>
                      <option>72 meses</option>
                    </select>
                  </div>


                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Pagamento mensal estimado
                      </span>

                      <span className="text-lg font-bold text-blue-900">
                        R$389/mês
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      *Com base em 6,9% APR
                    </p>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Dicas de segurança */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-900" />
                  Dicas de segurança
                </CardTitle>
              </CardHeader>

              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Encontre-se em um local público e bem iluminado</span>
                  </li>

                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Inspecione o veículo cuidadosamente</span>
                  </li>

                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Verificar documentos de propriedade</span>
                  </li>

                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Faça um test drive completo</span>
                  </li>

                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Considere uma inspeção profissional</span>
                  </li>

                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Nunca transfira dinheiro ou pague adiantado</span>
                  </li>
                </ul>
              </CardContent>

            </Card>
          </div>
        </div>

        {/* Veículos semelhantes */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Veículos semelhantes que você pode gostar
            </h2>

            <Link to="/" className="text-blue-900 hover:text-blue-700 font-medium">
              Veja todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedVehicles(vehicle.id, { category: vehicle.category }).map((suggestedVehicle) => (
              <Card
                key={suggestedVehicle.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={suggestedVehicle.image1 || "/placeholder.svg"}
                      alt={suggestedVehicle.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />


                    <div className="absolute top-3 right-3">
                      <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                        <Heart className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      {suggestedVehicle.title}
                    </h3>


                    <p className="text-2xl font-bold text-blue-900 mb-2">
                      ${suggestedVehicle.price.toLocaleString()}
                    </p>

                    <p className="text-sm text-gray-600 mb-4">
                      {suggestedVehicle.mileage}
                    </p>

                    <Link to={`/vehicle/${suggestedVehicle.id}`}>
                      <Button className="w-full bg-blue-900 hover:bg-blue-800">
                        Ver detalhes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
