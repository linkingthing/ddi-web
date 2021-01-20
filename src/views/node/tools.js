import moment from "moment";
moment.locale("zh-cn");

/**
 * values 折线图数据处理
 * @param {Array} values
 * @returns {Array} [labels, values]
 */
export function valuesParser(values) {
  const valuesData =
    values &&
    values.map(({ timestamp, value, ratio }) => {

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
