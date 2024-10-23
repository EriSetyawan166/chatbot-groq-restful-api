export class WebResponse<T> {
  data?: T;
  errors?: string;
  paging?: Paging;
}

export class Paging {
  offset: number;
  limit: number;
}
