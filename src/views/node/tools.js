import moment from "moment";
moment.locale("zh-cn");


function createParams(node, type) {
  return {
    node,
    type,
    start: moment().unix() - 7 * 24 * 60 * 60,
    end: moment().unix(),
    step: 150
  };
}

export async function getMatrixInfo({ node, type }) {
  // const params = createParams(node, type);
  const res = await services.getDeviceHistoryInfo();
  const { values } = res.data.data;
  const data = values && values.map(([timestamp, count]) => {
    return {
      timestamp,
      time: moment(timestamp * 1000).format("YYYY-MM-DD hh:mm:ss"),
      count: +count
    };
  });
  const labels = data && data.map(item => item.time);
  const counts = data && data.map(item => item.count);

  return [labels, counts];
}


export function valuesParser(values) {
  const data = values && values.map(({timestamp, value, usedRatio}) => {
    return {
      timestamp,
      time: moment(timestamp).format("YYYY-MM-DD hh:mm:ss"),
      count: +value,
      usedRatio
    };
  });
  const labels = data && data.map(item => item.time);
  const counts = data && data.map(item => item.count || item.usedRatio);
  // TODO: 这里不算好，usedRatio 应该考虑传参
  return [labels, counts];
}