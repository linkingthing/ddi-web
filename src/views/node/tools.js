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


/**
 * values 折线图数据处理
 * @param {Array} values
 * @returns {Array} [labels, values]
*/
export function valuesParser(values) {
  const data = values && values.map(({ timestamp, value, ratio }) => {
    return {
      timestamp,
      time: moment(timestamp).format("YYYY-MM-DD HH:mm:ss"),
      count: value,
      ratio
    };
  });
  const labels = data && data.map(item => item.time);
  const counts = data && data.map(item => typeof (item.count) === "undefined"  ? item.ratio : item.count);
  // TODO: 这里不算好，ratio 应该考虑传参
  return [labels, counts];
}