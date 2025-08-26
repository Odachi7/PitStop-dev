export interface Vehicle {
  id: number
  title: string
  price: number
  image: string
  images?: string[]
  mileage: string
  transmission: string
  fuel: string
  category: "car" | "motorcycle"
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

export interface FormData {
  category: string
  brand: string
  model: string
  year: string
  vehicleType: string
  fuelType: string
  transmission: string
  color: string
  doors: string
  engineSize: string
  mileage: string
  price: string
  description: string
  contactPhone: string
  contactEmail: string
  city: string
  province: string
}
