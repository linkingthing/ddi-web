import moment from "moment";
moment.locale("zh-cn");

function createParams(node, type) {
  return {
    node,
    type,
    start: moment().unix() - 7 * 24 * 60 * 60,
    end: moment().unix(),
    step: 150,
  };
}

export async function getMatrixInfo({ node, type }) {
  // const params = createParams(node, type);
  const res = await services.getDeviceHistoryInfo();
  const { values } = res.data.data;
  const data =
    values &&
    values.map(([timestamp, count]) => {
      return {
        timestamp,
        time: moment(timestamp * 1000).format("YYYY-MM-DD hh:mm:ss"),
        count: +count,
      };
    });
  const labels = data && data.map((item) => item.time);
  const counts = data && data.map((item) => item.count);
  return [labels, counts];
}

/**
 * values 折线图数据处理
 * @param {Array} values
 * @returns {Array} [labels, values]
 */
export function valuesParser(values) {
  const valuesData =
    values &&
    values.map(({ timestamp, value, ratio }) => {
      // console.log(timestamp);
      // console.log(moment(timestamp).valueOf());
      // console.log(moment(moment(timestamp).valueOf()).format("YYYY-MM-DD HH:mm:ss"));
      // console.log("===")
      if (typeof ratio === "undefined") {
        return [
          moment(timestamp).valueOf(), // .format("YYYY-MM-DD HH:mm:ss"),
          value
        ];
      } else {
        return [
          moment(timestamp).valueOf(), // .format("YYYY-MM-DD HH:mm:ss"),
          Number(ratio),
        ];
      }
    });

  // TODO: 这里不算好，ratio 应该考虑传参
  // valuesData.length = 50  // TODO

  return [[], valuesData];
}
