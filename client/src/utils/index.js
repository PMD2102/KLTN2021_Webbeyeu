// export function addOrReplace(object) {
//   var index = arrIndex[object.uid];
//   if (index === undefined) {
//     index = arr.length;
//     arrIndex[object.uid] = index;
//   }
//   arr[index] = object;
// }

// remove a element of array by idx and replace it by a element
export const removeAndAdd = (arr, element, idx) => [
  ...arr.slice(0, idx),
  element,
  ...arr.slice(idx + 1, arr.length),
];

export const removeOfArrayByIdx = (arr, idx) => [
  ...arr.slice(0, idx),
  ...arr.slice(idx + 1, arr.length),
];

export const timeSince = date => {
  var seconds = Math.floor(((new Date().getTime() - date ) / 1000));
  var interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + ' years ago';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months ago';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days ago';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours ago';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes ago';
  }
  return Math.floor(seconds) + ' seconds ago';
};

export const searchQueryToObj = search => {
  return JSON.parse(
    '{"' + search.substring(1).replace(/&/g, '","').replace(/=/g, '":"') + '"}',
    function (key, value) {
      return key === '' ? value : decodeURIComponent(value);
    }
  );
};
