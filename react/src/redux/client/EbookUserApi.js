import Request from '../../utils/request';

export default class EbookApi {
  static get(body) {
    const url = '/api/ebook/list';
    return Request.postWithAuth(url, body, false, true);
  }
  static getByid(id) {
    const url = `/api/ebook/detail/${id}`;
    return Request.get(url);
  }
}