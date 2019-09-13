import { from, fromEvent, interval, Observable, zip } from "rxjs";
import { map } from "rxjs/operators";
import {AntConfig, AntSourceEvent, fromObservable} from "@thirtyseven37/anthill";

import { events } from "./mock_data";
import { intervalTime } from "./config";
import { Product } from "./types";
import {
    parkingsWithProductsHandler,
    productCountHandler,
    productWithParameterHandler,
    sapDataToHumanLanguage
} from "./handlers";


const timer$ = interval(intervalTime);

const searchWithInterval$: Observable<AntSourceEvent> = zip(from(events), timer$)
    .pipe(map(x => x[0] as AntSourceEvent));


// ADVANCED CONFIG

const antConfig: AntConfig = {
    sources: [
        { name: "products", toResult: false },
        { name: "parameters", toResult: false, ifMissing: [] },
        { name: "parkings", toResult: false },
        { name: "cs_phrase", toResult: true }
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

const extendedStream$ = fromObservable(searchWithInterval$, antConfig);

extendedStream$.subscribe(
    (x) => console.log(x),
    (err) => console.error(`error catched: ${err}`),
    () => console.log('STREAM COMPLETE')
);
