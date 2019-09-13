import { from } from "rxjs";

// ARRAY AS STREAM EXAMPLE
const arrayStream$ = from([1, 2, 3]);

arrayStream$.subscribe(console.log);
