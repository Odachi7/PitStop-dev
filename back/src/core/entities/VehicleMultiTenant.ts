// Classe base para entidades com ID numérico
abstract class NumericEntity<T> {
  protected readonly _id: number;
  protected readonly props: T;

  constructor(props: T, id?: number) {
    this._id = id || 0; // Será definido pelo banco de dados
    this.props = props;
  }

  get id(): number {
    return this._id;
  }

  equals(entity?: NumericEntity<T>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }
    return this._id === entity._id;
  }
}

export interface VehicleMultiTenantProps {
  id?: number;
  userId: string; // Referência ao usuário do banco principal
  title: string;
  price: number;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  image7?: string;
  image8?: string;
  mileage: number;
  transmission: string;
  fuel: string;
  category: 'car' | 'motorcycle';
  brand: string;
  model: string;
  year: number;
  location: string;
  color: string;
  doors: number;
  engine: string;
  vin: string;
  description: string;
  status: 'active' | 'sold' | 'inactive';
  featured: boolean;
  viewsCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class VehicleMultiTenant extends NumericEntity<VehicleMultiTenantProps> {
  private constructor(props: VehicleMultiTenantProps, id?: number) {
    super(props, id);
  }

  static create(props: VehicleMultiTenantProps, id?: number): VehicleMultiTenant {
    const vehicle = new VehicleMultiTenant(props, id);
    
    // Validações de negócio
    if (!props.title.trim()) {
      throw new Error('Título é obrigatório');
    }
    
    if (!props.brand.trim()) {
      throw new Error('Marca é obrigatória');
    }
    
    if (!props.model.trim()) {
      throw new Error('Modelo é obrigatório');
    }
    
    if (props.year < 1900 || props.year > new Date().getFullYear() + 1) {
      throw new Error('Ano do veículo inválido');
    }
    
    if (props.price <= 0) {
      throw new Error('Preço deve ser maior que zero');
    }
    
    if (props.mileage < 0) {
      throw new Error('Quilometragem inválida');
    }
    
    if (props.doors < 2 || props.doors > 6) {
      throw new Error('Quantidade de portas inválida');
    }
    
    if (props.vin && props.vin.length !== 17) {
      throw new Error('VIN deve ter 17 caracteres');
    }

    const validCategories = ['car', 'motorcycle'];
    if (!validCategories.includes(props.category)) {
      throw new Error('Categoria inválida');
    }

    const validStatuses = ['active', 'sold', 'inactive'];
    if (!validStatuses.includes(props.status)) {
      throw new Error('Status inválido');
    }

    return vehicle;
  }

  // Getters
  get userId(): string {
    return this.props.userId;
  }

  get title(): string {
    return this.props.title;
  }

  get price(): number {
    return this.props.price;
  }

  get image1(): string | undefined {
    return this.props.image1;
  }

  get image2(): string | undefined {
    return this.props.image2;
  }

  get image3(): string | undefined {
    return this.props.image3;
  }

  get image4(): string | undefined {
    return this.props.image4;
  }

  get image5(): string | undefined {
    return this.props.image5;
  }

  get image6(): string | undefined {
    return this.props.image6;
  }

  get image7(): string | undefined {
    return this.props.image7;
  }

  get image8(): string | undefined {
    return this.props.image8;
  }

  // Método para obter todas as imagens como array
  get images(): string[] {
    const images: string[] = [];
    for (let i = 1; i <= 8; i++) {
      const image = this.props[`image${i}` as keyof VehicleMultiTenantProps] as string;
      if (image && image.trim()) {
        images.push(image);
      }
    }
    return images;
  }

  get mileage(): number {
    return this.props.mileage;
  }

  get transmission(): string {
    return this.props.transmission;
  }

  get fuel(): string {
    return this.props.fuel;
  }

  get category(): string {
    return this.props.category;
  }

  get brand(): string {
    return this.props.brand;
  }

  get model(): string {
    return this.props.model;
  }

  get year(): number {
    return this.props.year;
  }

  get location(): string {
    return this.props.location;
  }

  get color(): string {
    return this.props.color;
  }

  get doors(): number {
    return this.props.doors;
  }

  get engine(): string {
    return this.props.engine;
  }

  get vin(): string {
    return this.props.vin;
  }

  get description(): string {
    return this.props.description;
  }

  get status(): string {
    return this.props.status;
  }

  get featured(): boolean {
    return this.props.featured;
  }

  get viewsCount(): number {
    return this.props.viewsCount;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  // Métodos de negócio
  markAsSold(): void {
    this.props.status = 'sold';
    this.props.updatedAt = new Date();
  }

  markAsInactive(): void {
    this.props.status = 'inactive';
    this.props.updatedAt = new Date();
  }

  activate(): void {
    this.props.status = 'active';
    this.props.updatedAt = new Date();
  }

  setFeatured(featured: boolean): void {
    this.props.featured = featured;
    this.props.updatedAt = new Date();
  }

  incrementViews(): void {
    this.props.viewsCount += 1;
    this.props.updatedAt = new Date();
  }

  updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new Error('Preço deve ser maior que zero');
    }
    this.props.price = newPrice;
    this.props.updatedAt = new Date();
  }

  addImage(imageUrl: string): void {
    const currentImages = this.images;
    if (currentImages.length >= 8) {
      throw new Error('Máximo de 8 imagens permitidas');
    }
    
    // Encontrar próxima posição vazia
    for (let i = 1; i <= 8; i++) {
      const imageProp = `image${i}` as keyof VehicleMultiTenantProps;
      if (!this.props[imageProp]) {
        (this.props as any)[imageProp] = imageUrl;
        this.props.updatedAt = new Date();
        break;
      }
    }
  }

  removeImage(imageUrl: string): void {
    for (let i = 1; i <= 8; i++) {
      const imageProp = `image${i}` as keyof VehicleMultiTenantProps;
      if (this.props[imageProp] === imageUrl) {
        (this.props as any)[imageProp] = undefined;
        this.props.updatedAt = new Date();
        break;
      }
    }
  }

  getFullName(): string {
    return `${this.props.brand} ${this.props.model} ${this.props.year}`;
  }

  isActive(): boolean {
    return this.props.status === 'active';
  }

  isSold(): boolean {
    return this.props.status === 'sold';
  }

  isInactive(): boolean {
    return this.props.status === 'inactive';
  }
}
