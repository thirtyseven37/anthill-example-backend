import * as R from "ramda";
import * as _ from "lodash";
import { from, interval, Observable, zip } from "rxjs";
import { filter, map, pluck, share } from "rxjs/operators";
import { AntConfig, AntSourceEvent, fromObservable } from "@thirtyseven37/anthill";
import { Product, ProductWithTextParameter, Parameter, Parking, ParkingWithProducts } from "./types";

const products: Product[] = _.shuffle([
  { id: 600, name: "ax-176", parameters: [8, 2, 4] },
  { id: 2137, name: "1n4002", parameters: [] },
  { id: 37, name: "1n4005", parameters: [21, 37] },
]);

const parameters: Parameter[] = _.shuffle([
  { id: 2, name: "resistance" },
  { id: 4, name: "power" },
  { id: 8, name: "colour" },
  { id: 21, name: "voltage" },
  { id: 37, name: "max current" },
]);

const parkings: Parking[] = _.shuffle([
  { id: 1, products: [600, 37] },
  { id: 2, products: [] }
]);

const productsEvent: AntSourceEvent = {
  name: "products",
  payload: products
};

const parametersEvent: AntSourceEvent = {
  name: "parameters",
  payload: parameters
};

const parkingsEvent: AntSourceEvent = {
  name: "parkings",
  payload: parkings
};

const shuffledEvents: AntSourceEvent[] = _.shuffle([
  productsEvent,
  parametersEvent,
  parkingsEvent,
  { name: "test1", payload: null },
  { name: "test2", payload: null },
  { name: "test3", payload: null }
]);

const timer$ = interval(600);

const searchWithInterval$: Observable<AntSourceEvent> =
  zip(
    from(shuffledEvents),
    timer$
  ).pipe(
    map(x => x[0] as AntSourceEvent)
  );


const mapSingleProductToProductWithTextParameters = (parameters: Parameter[], product: Product): ProductWithTextParameter => {
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

const mapSingleParkingToParkingWithProducts = (products: ProductWithTextParameter[], parking: Parking): ParkingWithProducts => {
  const productsObject = products.reduce((acc: any, curr: ProductWithTextParameter) => {
    return {
      ...acc,
      [curr.id]: curr
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
    productsWithTextParameters
  }
};

const productWithParameterHandler = (products: Product[], params: Parameter[]): [ProductWithTextParameter[]] => {
  const prodWithParam: ProductWithTextParameter[] = products
    .map(R.curry(mapSingleProductToProductWithTextParameters)(params));

  return [prodWithParam];
};

const parkingsWithProductsHandler = (products: ProductWithTextParameter[], parkings: Parking[]): [ParkingWithProducts[]] => {
  const parkingWithProducts: ParkingWithProducts[] = parkings
    .map(R.curry(mapSingleParkingToParkingWithProducts)(products));

  return [parkingWithProducts];
};

const antConfig: AntConfig = {
  sources: [
    { name: "products", toResult: true, ifMissing: [] },
    { name: "parameters", toResult: true },
    { name: "parkings", toResult: true },
    { name: "test1", toResult: true },
    { name: "test2", toResult: true },
    { name: "test3", toResult: true }
  ],
  results: [
    {
      args: [{ name: "products" }, { name: "parameters"}],
      parts: [{ name: "products_with_parameters", toResult: true }],
      handler: productWithParameterHandler
    }, {
      args: [{ name: "products_with_parameters" }, { name: "parkings"}],
      parts: [{ name: "parkings_with_products", toResult: true }],
      handler: parkingsWithProductsHandler
    }
  ]
};

const result$ = fromObservable(searchWithInterval$, antConfig)
  .pipe(
    share()
  );

result$
  .pipe(
    map(x => x.name)
  )
  .subscribe(console.log);

const productsWithParams$ = result$
  .pipe(
    filter(x => x.name === "products_with_parameters"),
    pluck("payload")
  );

const parkingWithProducts$ = result$
  .pipe(
    filter(x => x.name === "parkings_with_products"),
    pluck("payload")
  );

parkingWithProducts$
  .subscribe(console.log);
