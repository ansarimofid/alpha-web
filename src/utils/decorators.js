import notify from './notification';

const notAuthorizedError = args => (dispatch) => {
  notify.danger('Please log in first!');
  return Promise.reject();
};

export const authRequired = target => (localStorage.getItem('username') ? target : notAuthorizedError);
