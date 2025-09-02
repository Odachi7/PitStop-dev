import { HomeInitialSection } from "../../components/homeInitialSection";
import { SearchAvanced } from "../../components/searchAvanced";
import { Card, CardContent } from "../../components/card";
import { Link } from "react-router-dom";
import { Button } from "../../components/button";
import { useContext, useState, useMemo } from "react";
import { Usercontext } from "../../context/userContext";

type Vehicle = {
  id: number;
  title: string;
  category: "car" | "motorcycle";
  brand: string;
  price: number;
  mileage?: string;
  transmission?: string;
  fuel?: string;
  location?: string;
  image?: string;
};

export function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "car" | "motorcycle">("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [priceRange, setPriceRange] = useState<"all" | "under-20k" | "20k-40k" | "over-40k">("all");

  const { veiculos, loading, error } = useContext(Usercontext) as {
    veiculos: Vehicle[];
    loading: boolean;
    error: string | null;
  };

  const filteredVehicles = useMemo(() => {
    // Verificar se veiculos é um array antes de usar filter
    if (!Array.isArray(veiculos)) {
      return [];
    }
    
    return veiculos.filter((vehicle) => {
      const matchesSearch = vehicle.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || vehicle.category === selectedCategory;
      const matchesBrand = selectedBrand === "all" || vehicle.brand === selectedBrand;
      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "under-20k" && vehicle.price < 20000) ||
        (priceRange === "20k-40k" && vehicle.price >= 20000 && vehicle.price <= 40000) ||
        (priceRange === "over-40k" && vehicle.price > 40000);

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });
  }, [veiculos, searchTerm, selectedCategory, selectedBrand, priceRange]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setPriceRange("all");
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
      <HomeInitialSection />

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
                {filteredVehicles.length} Vehicles Available
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 cursor-pointer">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="group hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                        <img
                            src={vehicle.image || "/placeholder.svg"}
                            alt={vehicle.title}
                            loading="lazy"
                            className="w-full h-48 object-cover rounded-t-lg"
                        />
                    </div>

                    <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                            {vehicle.title}
                        </h3>

                        <p className="text-2xl font-bold text-blue-900 mb-2">
                            ${vehicle.price.toLocaleString()}
                        </p>

                        <div className="text-sm text-gray-600 mb-3 space-y-1">
                            <p>
                            {vehicle.mileage} • {vehicle.transmission} • {vehicle.fuel}
                            </p>

                            <p className="text-gray-500">
                                {vehicle.location}
                            </p>
                        </div>

                        <Link to={`/vehicle/${vehicle.id}`}>
                            <Button className="w-full text-white bg-blue-900 hover:bg-blue-800 cursor-pointer">
                                Ver detalhes
                            </Button>
                        </Link>
                    </CardContent>
              </Card>
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                    Nenhum veículo encontrado em nosso sistema!
                </p>

                <Button variant="outline" className="mt-4 bg-transparent" onClick={resetFilters}>
                    Clear All Filters
                </Button>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
