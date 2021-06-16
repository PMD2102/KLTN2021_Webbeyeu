import http from './http';

const uploadFile = file => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append('image', file);
    http
      .post('/uploads', formData)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => reject(err));
  });
};

export default uploadFile;
