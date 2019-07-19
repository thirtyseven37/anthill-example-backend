import { Parameter, Parking, ParkingWithProductsAndPhrases, Phrase, Product, ProductWithTextParameter } from "./types";
import * as R from "ramda";


export const mapSingleProductToProductWithTextParameters = (parameters: Parameter[], product: Product): ProductWithTextParameter => {
  const parameterObject = parameters.reduce((acc: any, curr: Parameter) => {
    return {
      ...acc,
      [curr.id]: curr.name
    }
  }, {});

  const textParameters = product.parameters.map((parameterId: number): string => {
    if (!parameterObject.hasOwnProperty(parameterId)) {
      throw new Error(`Missing parameter name for product ${product.id} (${product.name}) and parameter ${parameterId}`)
    }

    return parameterObject[parameterId];
  });

  return {
    ...product,
    textParameters
  }
};

export const mapSingleParkingToParkingWithProducts = (products: ProductWithTextParameter[], phrases: Phrase[], parking: Parking): ParkingWithProductsAndPhrases => {
  const productsObject = products.reduce((acc: any, curr: ProductWithTextParameter) => {
    return {
      ...acc,
      [curr.id]: curr
    }
  }, {});

  console.log(phrases);

  const phrasesObject = phrases.reduce((acc: any, curr: Phrase) => {
    return {
      ...acc,
      [curr.id]: curr.phrase
    }
  }, {});

  const productsWithTextParameters = parking.products.map((productId: number): ProductWithTextParameter => {
    if (!productsObject.hasOwnProperty(productId)) {
      throw new Error(`Missing product id for parking ${parking.id} and product ${productId}`)
    }

    return productsObject[productId];
  });

  return {
    ...parking,
    name: phrasesObject[parking.csPhrase],
    productsWithTextParameters
  }
};

export const productCountHandler = (products: Product[]): [number] => {

  return [products.length];
};

export const productWithParameterHandler = (products: Product[], params: Parameter[]): [ProductWithTextParameter[]] => {
  const prodWithParam: ProductWithTextParameter[] = products
    .map(R.curry(mapSingleProductToProductWithTextParameters)(params));

  return [prodWithParam];
};

export const parkingsWithProductsHandler = (products: ProductWithTextParameter[], parkings: Parking[], phrases: Phrase[]): [ParkingWithProductsAndPhrases[]] => {
  const parkingWithProducts: ParkingWithProductsAndPhrases[] = parkings
    .map(R.curry(mapSingleParkingToParkingWithProducts)(products)(phrases));

  return [parkingWithProducts];
};