import services from "@/services";
import moment from "moment";
moment.locale("zh-cn");


function createParams(node, type) {
    return {
        node,
        type,
        start: moment().unix() - 7 * 24 * 60 * 60,
        end: moment().unix(),
        step: 150
    }
}

export async function getDeviceHistoryInfo({ node, type }) {
    const params = createParams(node, type)
    const res = await services.getDeviceHistoryInfo(params)
    const { values } = res.data;
    const data = values.map(([timestamp, count]) => {
        return {
            timestamp,
            time: moment(timestamp * 1000).format("YYYY-MM-DD hh:mm:ss"),
            count: +count,
        };
    });
    const labels = data.map(item => item.time)
    const counts = data.map(item => item.count)

    return [labels, counts]
}