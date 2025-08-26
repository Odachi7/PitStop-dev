import { HomeInitialSection } from "../../components/homeInitialSection"
import { SearchAvanced } from "../../components/searchAvanced"

export function Home() {

    

    return (
        <section className="w-full">
            <HomeInitialSection/>
                    
            <SearchAvanced />
            
            <div className="w-full max-w-[1400px] mx-auto">
                <section className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{filteredVehicles.length} Vehicles Available</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredVehicles.map((vehicle) => (
                        <Card key={vehicle.id} className="group hover:shadow-lg transition-shadow duration-300">
                        <div className="relative">
                            <img
                            src={vehicle.image || "/placeholder.svg"}
                            alt={vehicle.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <Badge className="absolute top-2 left-2" variant={vehicle.category === "car" ? "default" : "secondary"}>
                            {vehicle.category === "car" ? <Car className="h-3 w-3 mr-1" /> : <Bike className="h-3 w-3 mr-1" />}
                            {vehicle.category === "car" ? "Car" : "Motorcycle"}
                            </Badge>
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                            {vehicle.title}
                            </h3>
                            <p className="text-2xl font-bold text-blue-900 mb-2">${vehicle.price.toLocaleString()}</p>
                            <div className="text-sm text-gray-600 mb-3 space-y-1">
                            <p>
                                {vehicle.mileage} • {vehicle.transmission} • {vehicle.fuel}
                            </p>
                            <p className="text-gray-500">{vehicle.location}</p>
                            </div>
                            <Link to={`/vehicle/${vehicle.id}`}>
                            <Button className="w-full bg-blue-900 hover:bg-blue-800">View Details</Button>
                            </Link>
                        </CardContent>
                        </Card>
                    ))}
                    </div>

                    {filteredVehicles.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No vehicles found matching your criteria.</p>
                        <Button
                        variant="outline"
                        className="mt-4 bg-transparent"
                        onClick={() => {
                            setSearchTerm("")
                            setSelectedCategory("all")
                            setSelectedBrand("all")
                            setPriceRange("all")
                        }}
                        >
                        Clear All Filters
                        </Button>
                    </div>
                    )}
                </section>
            </div>

        </section>
    )
}