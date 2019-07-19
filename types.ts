export interface Product {
  id: number;
  name: string;
  parameters: number[];
}

export interface ProductWithTextParameter extends Product{
  textParameters: string[];
}

export interface Parameter {
  id: number;
  name: string;
}

export interface Parking {
  id: number;
  products: number[];
}

export interface ParkingWithProducts extends Parking {
  id: number;
  productsWithTextParameters: ProductWithTextParameter[];
}
