import { from, merge } from "rxjs";
import {map, reduce} from "rxjs/operators";
import { fromObservable } from "@thirtyseven37/anthill";

const dataSource$ = merge(
  wsCall(`wss://search.tme.eu/products`, searchRequest).pipe(map(mapProductsToAnthillEvent)),
  httpCall(`https://api.tme.eu/parkings`, tmeRequest).pipe(map(mapParkingsToAnthillEvent)),
  httpCall(`https://weather.com/api`, weatherRequest).pipe(map(mapWeatherToAnthillEvent)),
  dbQuery(`SELECT * FROM phrases WHERE lang = ?`, ['en']).pipe(map(mapPhraseQueryToAnthillEvent)),
  from(getArrayFromConfig).pipe(map(mapConfigToAnthillEvent))
);

const result$ = fromObservable(dataSource$, config);

if (ws) {
    result$.subscribe(wsClient);

} else if (http) {
    result$.pipe(
        reduce(allDataToSingleResponse)
    ).subscribe(httpResponse)
}

