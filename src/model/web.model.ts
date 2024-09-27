export class WebResponse<T>{
    data?: T;
    errors?: String;
    paging?: Paging;
}

export class Paging {
    offset: number;
    limit: number;
}