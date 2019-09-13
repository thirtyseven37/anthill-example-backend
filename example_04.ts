import { from, interval, Observable, zip } from "rxjs";
import { map } from "rxjs/operators";
import { AntConfig, AntSourceEvent, fromObservable } from "@thirtyseven37/anthill";

import { events } from "./mock_data";
import { intervalTime } from "./config";
import { Product } from "./types";

const timer$ = interval(intervalTime);

const searchWithInterval$: Observable<AntSourceEvent> = zip(from(events), timer$)
    .pipe(map(x => x[0] as AntSourceEvent));


// ANTHILL TO MANAGE
// NEED TO KNOW SUBSCRIBE ONLY!!
// TYPES PROVIDED

const antConfig: AntConfig = {
    // DEFINING SOURCES
    sources: [
        { name: "products", toResult: true } // PRODUCTS FROM SOURCE TO RESULT
    ],
    // DEFINING RESULTS
    results: [
        {
            args: [{name: "products"}], // BUILT FROM PRODUCTS
            parts: [{name: "product_count", toResult: true}], // PRODUCT COUNT TO OUTPUT
            handler: (products: Product[]): [number] => [products.length] // MODIFIER FUNCTION
        }
    ]
};


const extendedStream$ = fromObservable(searchWithInterval$, antConfig);

extendedStream$.subscribe(
    (x) => console.log(x),
    (err) => console.error(`error catched: ${err}`),
    () => console.log('STREAM COMPLETE')
);
