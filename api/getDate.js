function getDate() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let To = dd - 1
  let From = dd - 2

  let yyyy = today.getFullYear();
  if (To < 10) {
    dd = '0' + dd;
  }
  if (From < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  let dateTo = mm + '/' + To + '/' + yyyy;
  let dateFrom = mm + '/' + From + '/' + yyyy;

  return [dateFrom, dateTo]
}

module.exports = getDate