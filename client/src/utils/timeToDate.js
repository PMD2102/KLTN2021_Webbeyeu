const timeToDate = time => {
  const d = new Date(time);
  return (
    d.getDate() +
    '-' +
    (d.getMonth() + 1) +
    '-' +
    d.getFullYear() +
    ' ' +
    d.getHours() +
    ':' +
    d.getMinutes()
  );
};

export default timeToDate;
