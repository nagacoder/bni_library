import EbookApi from '../client/EbookApi';
import { EBOOKS, DETAIL_EBOOK } from '../type';
/**
 * note: for book creation doesn't need to dispatch //
 * any reducer type,
 * just return the response (true/false) to the UI
 */

export const CreateNewEbookAction = Ebook => () => {
  var formdata = new FormData();
  for (var key in Ebook) {
    formdata.append(key, Ebook[key]);
  }
  return EbookApi.create(formdata)
    .then(res => {
      if (res) {
        return {
          resp: true,
          msg: 'Ebook Berhasil di tambahkan',
        };
      }
    })
    .catch(err => {
      let msg = err.message || 'Something Wrong, request failed !';
      return { resp: false, msg: msg };
    });
};

export const EditEbookAction = (id, Ebook) => () => {
  var formdata = new FormData();
  for (var key in Ebook) {
    formdata.append(key, Ebook[key]);
  }
  return EbookApi.update(id, formdata)
    .then(res => {
      if (res) {
        return {
          resp: true,
          msg: 'Ebook Berhasil di diubah',
        };
      }
    })
    .catch(err => {
      let msg = err.message || 'Something Wrong, request failed !';
      return { resp: false, msg: msg };
    });
};


export const DeleteEbookAction = id => () => {
  return EbookApi.delete(id)
    .then(res => {
      if (res) {
        return {
          resp: true,
          msg: 'Ebook Berhasil di dihapus',
        };
      }
    })
    .catch(err => {
      let msg = err.message || 'Something Wrong, request failed !';
      return { resp: false, msg: msg };
    });

};

export const getEbooks = body => dispatch => {
  return BookApi.list(body)
    .then(res => {
      if (res) {
        dispatch({ type: EBOOKS, payload: res });
        return {
          resp: true,
          msg: '',
        };
      }
    })
    .catch(err => {
      let msg = err.message || 'Something Wrong, request failed !';
      return { resp: false, msg: msg };
    });
};


export const getDetailEbook = id => dispatch => {
  return BookApi.detail(id).then(res => {
    if (res) {
      dispatch({ type: DETAIL_EBOOK, payload: res });
      return {
        resp: true,
        msg: '',
      };
    }
  })
    .catch(err => {
      let msg = err.message || 'Something Wrong, request failed !';
      return { resp: false, msg: msg };
    });
}
