import { from, merge } from "rxjs";
import { map } from "rxjs/operators";

merge(
  wsCall(`wss://search.tme.eu/products`).pipe(map(mapProductsToAnthillEvent)),
  httpCall(`https://api.tme.eu/parkings`).pipe(map(mapParkingsToAnthillEvent)),
  dbQuery(`SELECT * FROM phrases`).pipe(map(mapPhraseQueryToAnthillEvent)),
  from(getArrayFromConfig).pipe(map(mapConfigToAnthillEvent))
);
