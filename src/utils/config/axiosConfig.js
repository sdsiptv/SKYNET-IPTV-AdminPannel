import { create } from 'axios';
import { hideLoader, showLoader } from 'store/session/actions';

const API = create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const setupInterceptors = store => {
  API.interceptors.request.use(
    request => {
      store.dispatch(showLoader());
      const token = store.getState().session.authToken;
      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }
      return request;
    },
    error => {
      store.dispatch(hideLoader());
      return Promise.reject(error);
    },
  );

  API.interceptors.response.use(
    response => {
      store.dispatch(hideLoader());
      return response.data;
    },
    error => {
      store.dispatch(hideLoader());
      return Promise.reject(error);
    },
  );
};

export default API;
