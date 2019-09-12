import { from, interval, Observable, zip } from "rxjs";
import { catchError, filter, map, pluck, share } from "rxjs/operators";
import { AntEvent, AntSourceEvent, fromObservable } from "@thirtyseven37/anthill";

import { events } from "./mock_data";
import { antConfig, intervalTime } from "./config";
import {
  Product,
  ProductWithTextParameter,
  Parking,
  ParkingWithProductsAndPhrases,
  Phrase,
  Parameter
} from "./types";

const timer$ = interval(intervalTime);

const searchWithInterval$: Observable<AntSourceEvent> = zip(from(events), timer$)
  .pipe(map(x => x[0] as AntSourceEvent));

const result$ = fromObservable(searchWithInterval$, antConfig).pipe(share());

result$.subscribe(
  (x: AntEvent) => console.log(x.name, x.payload),
  (err) => console.error(`error catched: ${err}`),
  () => console.log('STREAM COMPLETE')
);

const productsWithParams$ = result$.pipe(
  filter(x => x.name === "products_with_parameters"),
  pluck("payload")
);

const products$ = result$.pipe(
  filter(x => x.name === "products"),
  pluck("payload")
);

const parkingWithProducts$ = result$.pipe(
  filter(x => x.name === "parkings_with_products"),
  pluck("payload")
);

const parkings$ = result$.pipe(
  filter(x => x.name === "parkings"),
  pluck("payload")
);


const productCount$ = result$.pipe(
  filter(x => x.name === "product_count"),
  pluck("payload")
);

const phrases$ = result$.pipe(
  filter(x => x.name === "cs_phrase"),
  pluck("payload")
);

const parameters$ = result$.pipe(
  filter(x => x.name === "parameters"),
  pluck("payload")
);

productCount$.subscribe((count: any) => document.getElementById("productCount").innerText = count);

phrases$.subscribe((phrases: Phrase[]) => {
  document.getElementById("cs-phrases").innerHTML = "";
  phrases.forEach((phrase: any) => document.getElementById("cs-phrases").innerHTML += JSON.stringify(phrase));
});

parkings$.subscribe((parkings: Parking[]) => {
  parkings
    .map((parking: Parking) => `
      <tr>
        <td width="5%"><i class="fa fa-bell-o"></i></td>
        <td>${parking.id}</td>
        <td>${parking.csPhrase}</td>
        <td>${parking.products}</td>
      </tr>
    `)
    .forEach((html: any) => {
      document.getElementById("parkings").innerHTML += html;
    })
});

parkingWithProducts$.subscribe((parkings: ParkingWithProductsAndPhrases[]) => {
  document.getElementById("parkings").innerHTML = "";

  parkings
    .map((parking: ParkingWithProductsAndPhrases) => `
      <tr>
        <td width="5%"><i class="fa fa-bell-o"></i></td>
        <td>${parking.id}</td>
        <td>${parking.name}</td>
        <td>${parking.productsWithTextParameters.map(x => x.name)}</td>
        <td>${parking.productsWithTextParameters.map(x => x.textParameters)}</td>
      </tr>
    `)
    .forEach((html: any) => {
      document.getElementById("parkings").innerHTML += html;
    })
});

productsWithParams$.subscribe((products: ProductWithTextParameter[]) => {
  document.getElementById("products").innerHTML = '';

  products
    .map((prod: ProductWithTextParameter) => `
      <tr>
        <td width="5%"><i class="fa fa-bell-o"></i></td>
        <td>${prod.name}</td>
        <td>${prod.textParameters}</td>
      </tr>
    `)
    .forEach((html: any) => document.getElementById("products").innerHTML += html);
});

products$.subscribe((products: Product[]) => {
  products
      .map((prod: Product) => `
      <tr>
        <td width="5%"><i class="fa fa-bell-o"></i></td>
        <td>${prod.name}</td>
        <td>${prod.parameters}</td>
      </tr>
    `)
      .forEach((html: any) => document.getElementById("products").innerHTML += html);
});

parameters$.subscribe((parameters: Parameter[]) => {
  parameters
      .map((param: Parameter) => `
      <tr>
        <td width="5%"><i class="fa fa-bell-o"></i></td>
        <td>${param.id}</td>
        <td>${param.name}</td>
      </tr>
    `)
      .forEach((html: any) => document.getElementById("parameters").innerHTML += html);
});
