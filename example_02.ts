import { from } from "rxjs";

interface tmeEvent {
    name: string;
    value: number;
}

// EXPECTED OBJECTS
// http://localhost:1234/
const tmeEvents: tmeEvent[] = [
    {name: "api_response", value: 7},
    {name: "cs_response", value: 5},
    {name: "tme_response", value: 47},
    {name: "search_response", value: 47}
];

const stream$ = from(tmeEvents);


stream$.subscribe(
    console.log,
    console.error,
    () => {
        console.log("fniished");
    }
);
