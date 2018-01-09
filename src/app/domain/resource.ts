import { Pageable } from "./pageable";
import { Sort } from "./sort";

export class Resource<T>{
    content: T[];
    pageable: Pageable;
    totalElements: number;
    totalPages: number;
    last: boolean;
    size: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    first: boolean;
}