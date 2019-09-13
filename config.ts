import { AntConfig } from "@thirtyseven37/anthill";
import {
  parkingsWithProductsHandler,
  productCountHandler,
  productWithParameterHandler,
  sapDataToHumanLanguage
} from "./handlers";

export const intervalTime = 750;

export const antConfig: AntConfig = {
  sources: [
    { name: "products", toResult: true , modifiers: [sapDataToHumanLanguage]},
    { name: "parameters", toResult: true, ifMissing: [] },
    { name: "parkings", toResult: true },
    { name: "cs_phrase", toResult: true },
    { name: "test1", toResult: true },
    { name: "test2", toResult: true },
    { name: "test3", toResult: true }
  ],
  results: [
    {
      args: [{ name: "products" }],
      parts: [{ name: "product_count", toResult: true }],
      handler: productCountHandler
    },
    {
      args: [{ name: "products" }, { name: "parameters"}],
      parts: [{ name: "products_with_parameters", toResult: true }],
      handler: productWithParameterHandler
    }, {
      args: [{ name: "products_with_parameters" }, { name: "parkings"}, { name: "cs_phrase" }],
      parts: [{ name: "parkings_with_products", toResult: true }],
      handler: parkingsWithProductsHandler
    }
  ]
};
