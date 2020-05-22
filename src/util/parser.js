/**
 * use to do request or response params
 * 
*/
export const resArrayToString = (res, fields = []) => {
  fields.forEach(item => {
    res[item] = res[item] ? res[item].join(",") : "";
  });
};

export const resStringToArray = (res, fields = []) => {
  fields.forEach(item => {
    res[item] = res[item] ? res[item].split(",") : [];
  });
};