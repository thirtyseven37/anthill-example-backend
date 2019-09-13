import { from, interval, Observable, zip } from "rxjs";
import { map } from "rxjs/operators";
import { AntSourceEvent } from "@thirtyseven37/anthill";

import { events } from "./mock_data";
import { intervalTime } from "./config";


// EXPECTED OBJECTS
// UNEXPECTED ORDER
// mock_data.ts -> events

const timer$ = interval(intervalTime);

const searchWithInterval$: Observable<AntSourceEvent> = zip(from(events), timer$)
    .pipe(map(x => x[0] as AntSourceEvent));

searchWithInterval$.subscribe(
    (x) => console.log(x),
    (err) => console.error(`error catched: ${err}`),
    () => console.log('STREAM COMPLETE')
);
