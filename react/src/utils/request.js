import axios from 'axios';
function formatUrl(url) {
  let checkIsParamsExit = url.split('').find((text) => text === '?');
  return url + `${checkIsParamsExit ? '&' : '?'}token=${localStorage.getItem('access_token_ebni')}`;
}
const defaultResponseOptions = {
  fullResponse: false,
};

// );

const makeAxiosRequest = (requestOptions, responseOptions = defaultResponseOptions) =>
  axios(requestOptions)
    .then((response) => (responseOptions.fullResponse ? response : response.data))
    .catch((error) => {
      if (error.response.status === 401 || error.response.status === 403) {
        //place your reentry code
        window.location.replace('/auth/login');
        localStorage.removeItem('access_token_ebni');
        localStorage.removeItem('bni_UserRole');
      } else if (error.response.status === 404) {
        console.log('error', error);
        window.location.replace('/not-found');
      } else {
        throw responseOptions.fullResponse ? error.response : error.response.data;
      }
    });

export default class Request {
  static get(url, params) {
    url = formatUrl(url);
    const requestOptions = { method: 'get', url };
    if (params) {
      Object.assign(requestOptions, { params });
    }
    return makeAxiosRequest(requestOptions);
  }
  static getWithAuth(url) {
    url = formatUrl(url);
    const requestOptions = {
      method: 'get',
      url,
      // headers: {
      //   'x-access-token': localStorage.getItem('access_token_ebni'),
      // },
    };
    return makeAxiosRequest(requestOptions);
  }

  static getFileWithAuth(url) {
    url = formatUrl(url);
    const requestOptions = {
      method: 'get',
      url,
      // headers: {
      //   'x-access-token': localStorage.getItem('access_token_ebni'),
      // },
      responseType: 'blob',
    };
    return makeAxiosRequest(requestOptions);
  }

  static post(url, data, options) {
    url = formatUrl(url);
    const requestOptions = {
      method: 'post',
      url,
      data,
    };
    return makeAxiosRequest(requestOptions, options);
  }
  static postWithAuth(url, data, options, isFormData) {
    url = formatUrl(url);
    const requestOptions = {
      method: 'post',
      url,
      data,
      headers: {
        'Content-Type': isFormData ? 'application/x-www-form-urlencoded' : 'application/json',
        // 'x-access-token': localStorage.getItem('access_token_ebni'),
      },
    };
    return makeAxiosRequest(requestOptions, options);
  }

  static postFileWithAuth(url, data, options, isFormData) {
    url = formatUrl(url);
    const requestOptions = {
      method: 'post',
      url,
      data,
      headers: {
        'Content-Type': isFormData ? 'application/x-www-form-urlencoded' : 'application/json',
        // 'x-access-token': localStorage.getItem('access_token_ebni'),
      },
      responseType: 'blob',
    };
    return makeAxiosRequest(requestOptions, options);
  }

  static put(url, data, options) {
    url = formatUrl(url);
    const requestOptions = { method: 'put', url, data };
    return makeAxiosRequest(requestOptions, options);
  }

  static putWithAuth(url, data, options, isFormData) {
    url = formatUrl(url);
    const requestOptions = {
      method: 'put',
      url,
      data,
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
        // 'x-access-token': localStorage.getItem('access_token_ebni'),
      },
    };
    return makeAxiosRequest(requestOptions, options);
  }

  static delete(url, params, options) {
    url = formatUrl(url);
    const requestOptions = { method: 'delete', url, params };
    return makeAxiosRequest(requestOptions, options);
  }

  static deleteWithAuth(url, data, options, isFormData) {
    url = formatUrl(url);
    const requestOptions = {
      method: 'delete',
      url,
      data,
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
        // 'x-access-token': localStorage.getItem('access_token_ebni'),
      },
    };
    return makeAxiosRequest(requestOptions, options);
  }
}
