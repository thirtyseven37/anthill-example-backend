import * as _ from "lodash";
import { AntSourceEvent } from "@thirtyseven37/anthill";
import { Parameter, Parking, Phrase, Product } from "./types";

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
  { id: 1, products: [600, 37], csPhrase: 555 },
  { id: 2, products: [37], csPhrase: 666 }
]);

const phrases: Phrase[] = _.shuffle([
  { id: 555, phrase: "public parking"},
  { id: 666, phrase: "private parking" }
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

const phrasesEvent: AntSourceEvent = {
  name: "cs_phrase",
  payload: phrases
};

export const events: AntSourceEvent[] = _.shuffle([
  productsEvent,
  parametersEvent,
  parkingsEvent,
  phrasesEvent,
  { name: "test1", payload: null },
  { name: "test2", payload: null },
  { name: "test3", payload: null }
]);

// export const events: AntSourceEvent[] = [
//   productsEvent,
//   parametersEvent,
//   parkingsEvent,
//   phrasesEvent,
//   { name: "test1", payload: null },
//   { name: "test2", payload: null },
//   { name: "test3", payload: null }
// ];
