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
  csPhrase: number;
}

export interface Phrase {
  id: number;
  phrase: string;
}

export interface ParkingWithProductsAndPhrases extends Parking {
  id: number;
  name: string;
  productsWithTextParameters: ProductWithTextParameter[];
}
