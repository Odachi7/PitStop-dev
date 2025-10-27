import { SearchAvanced } from "../../components/searchAvanced";
import { Card, CardContent } from "../../components/card";
import { Link } from "react-router-dom";
import { Button } from "../../components/button";
import { useContext, useState, useMemo, useEffect } from "react";
import { Usercontext } from "../../context/userContext";
import { Pagination } from "../../components/pagination"; // Componente que vamos criar
import Footer from "../../components/footer";

type Vehicle = {
  id: number;
  title: string;
  category: "Carro" | "Moto";
  brand: string;
  price: number;
  mileage?: string;
  transmission?: string;
  fuel?: string;
  location?: string;
  image?: string;
};

export function Catalogo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "Carro" | "Moto">("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [priceRange, setPriceRange] = useState<"all" | "Menos de 20k" | "20k-40k" | "Mais de 40k">("all");

  const { 
    veiculos, 
    loading, 
    error, 
    formatarReal, 
    formatKilometers,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    getPaginatedData
  } = useContext(Usercontext) as {
    veiculos: Vehicle[];
    loading: boolean;
    error: string | null;
    formatarReal: (value: number) => string;
    formatKilometers: (km: number) => string;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    itemsPerPage: number;
    getPaginatedData: <T>(data: T[], page: number, itemsPerPage: number) => any;
  };

  // Primeiro filtra os veículos
  const filteredVehicles = useMemo(() => {
    if (!Array.isArray(veiculos)) {
      return [];
    }
    
    return veiculos.filter((vehicle) => {
      // Verificações de segurança para evitar erros de undefined
      const title = vehicle.title || '';
      const category = vehicle.category || '';
      const brand = vehicle.brand || '';
      const price = vehicle.price || 0;

      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || category === selectedCategory;
      const matchesBrand = selectedBrand === "all" || brand === selectedBrand;
      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "Menos de 20k" && price < 20000) ||
        (priceRange === "20k-40k" && price >= 20000 && price <= 40000) ||
        (priceRange === "Mais de 40k" && price > 40000);

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });
  }, [veiculos, searchTerm, selectedCategory, selectedBrand, priceRange]);

  // Depois aplica a paginação nos veículos filtrados
  const paginatedData = useMemo(() => {
    return getPaginatedData(filteredVehicles, currentPage, itemsPerPage);
  }, [filteredVehicles, currentPage, itemsPerPage, getPaginatedData]);

  // Reset para primeira página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedBrand, priceRange, setCurrentPage]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setPriceRange("all");
    setCurrentPage(1);
  };

  if (loading) return <p className="text-center py-12">Carregando veículos...</p>;
  if (error) return (
    <div className="text-center py-12">
      <p className="text-red-500 mb-4">Erro ao carregar veículos: {error}</p>
      <p className="text-gray-500">Verifique se o servidor está rodando em http://localhost:3333</p>
    </div>
  );
  if (!Array.isArray(veiculos) || veiculos.length === 0) return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg">Nenhum veículo encontrado.</p>
      <p className="text-gray-400">Tente novamente mais tarde ou verifique a conexão com o servidor.</p>
    </div>
  );

  return (
    <section className="w-full">

      <SearchAvanced
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      <div className="w-full max-w-[1400px] mx-auto">
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {paginatedData.totalItems} Veículos Disponíveis
            </h2>
            <p className="text-gray-600">
              Página {paginatedData.currentPage} de {paginatedData.totalPages}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 cursor-pointer">
            {paginatedData.items.map((vehicle: Vehicle) => (
              <Card
                key={vehicle.id}
                className="group hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <Link to={`/vehicle/${vehicle.id}`} className="relative">
                  <img
                    src={vehicle.image || "/placeholder.svg"}
                    alt={vehicle.title}
                    loading="lazy"
                    className="w-full h-65 object-cover rounded-t-lg"
                  />
                </Link>

                <CardContent className="p-4 flex flex-col flex-1">
                  <Link to={`/vehicle/${vehicle.id}`}>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {vehicle.title}
                    </h3>
                  </Link>

                  <p className="text-2xl font-bold text-blue-900 mb-2">
                    {formatarReal(vehicle.price)}
                  </p>

                  <div className="text-sm text-gray-600 mb-3 space-y-1">
                    <p>
                      {formatKilometers(Number(vehicle.mileage))} km • {vehicle.transmission} • {vehicle.fuel}
                    </p>
                    <p className="text-gray-500">{vehicle.location}</p>
                  </div>

                  <div className="mt-auto">
                    <Link to={`/vehicle/${vehicle.id}`}>
                      <Button className="w-full text-white bg-blue-900 cursor-pointer group-hover:bg-blue-800">
                        Ver detalhes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Componente de Paginação - só exibe se tiver mais de 1 página */}
          {paginatedData.totalPages > 1 && (
            <Pagination
              currentPage={paginatedData.currentPage}
              totalPages={paginatedData.totalPages}
              onPageChange={setCurrentPage}
            />
          )}

          {filteredVehicles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-900 text-lg mb-5 md:text-xl lg:text-2xl xl:text-3xl">
                Nenhum veículo encontrado em nosso sistema!
              </p>

              <Button 
                variant="outline" 
                className="mt-4 text-lg lg:text-xl bg-transparent border border-black text-black cursor-pointer hover:bg-black hover:text-white duration-200" 
                onClick={resetFilters}
              >
                Remover Filtros
              </Button>
            </div>
          )}
        </section>
      </div>
      
      <Footer/>
    </section>
  );
}
