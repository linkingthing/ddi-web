export const columns = scope => [
  {
    title: "IP地址",
    key: "ip",
    minWidth: 160,
    align: "left"
  },
  {
    title: "MAC地址",
    key: "mac",
    minWidth: 160,
  },
  {
    title: "地址类型",
    key: "ipTypeText",
    minWidth: 120,
  },
  {
    title: "地址状态",
    key: "ipStateText",
    minWidth: 120,
    render: (h, { row }) => {
      const target = statusLegends.find(item => item.type === row.ipState);
      return h(
        "div",
        {
          style: {
            color: target && target.color
          }
        },
        row.ipStateText
      );
    }
  },
  {
    title: "租赁时间(s)",
    key: "validLifetime",
    minWidth: 120,
  },
  {
    title: "租赁过期时间",
    key: "expire",
    minWidth: 190,
  },
  {
    title: "操作",
    width: 300,
    render: (h, { row }) => {
      let buttons = [
        h(
          "Button",
          {
            class: "table-row-button",
            style: {
              width: "70px"
            },
            props: {
              type: "default"
            },
            on: {
              click: () => {
                scope.handleEdit(row);
              }
            }
          },
          "终端登记"
        ),
        h(
          "Button",
          {
            class: "table-row-button",
            style: {
              width: "60px"
              // display: showFix(row)
            },
            props: {
              type: "default",
              disabled: row.ipType === "reservation" || !showFix(row)
            },
            on: {
              click: () => {
                scope.handleFix(row);
              }
            }
          },
          "转固定"
        ),
        h(
          "Button",
          {
            class: "table-row-button",
            style: {
              width: "60px"
              // display: `${
              //   row.ipState === "conflict" && row.ipType === "unmanagered"
              //     ? "inline-block"
              //     : "none"
              // } `
            },
            props: {
              type: "default",
              disabled:
                row.ipType === "reservation" ||
                !(row.ipState === "conflict" && row.ipType === "unmanagered")
            },
            on: {
              click: () => {
                scope.handleStatic(row);
              }
            }
          },
          "转静态"
        )
      ];

      return buttons;
    }
  }
];

// 三种情况显示转固定
function showFix(row) {
  if (row.ipState === "conflict") {
    if (["unmanagered", "unassigned"].includes(row.ipType)) {
      return true;
    }
  }

  if (row.ipState === "active") {
    if (row.ipType === "unassigned") {
      return true;
    }
  }

  return false;
}

export const typeColors = ["#f9904a", "#4586FE", "#63D58B", "#76DCEB"];
export const statusColors = ["#1EE9CA", "#1272FF", "#FF6464", "#FFB83C"];

const noDataColors = ["#ebebeb"];

export const typeLegends = [
  {
    percent: 0,
    label: "已分配地址",
    color: typeColors[0],
    type: "assigned"
  },
  {
    percent: 0,
    label: "未分配地址",
    color: typeColors[1],
    type: "unassigned"
  },
  {
    percent: 0,
    label: "固定地址",
    color: typeColors[2],
    type: "reservation"
  },

  {
    percent: 0,
    label: "静态地址",
    color: typeColors[3],
    type: "static"
  },
  {
    percent: 0,
    label: "未使用地址",
    color: typeColors[4],
    type: "unmanagered"
  }
];

export const statusLegends = [
  {
    percent: 0,
    label: "活跃地址",
    color: statusColors[0],
    type: "active"
  },
  {
    percent: 0,
    label: "不活跃地址",
    color: statusColors[1],
    type: "inactive"
  },
  {
    percent: 0,
    label: "冲突地址",
    color: statusColors[2],
    type: "conflict"
  },
  {
    percent: 0,
    label: "僵尸地址",
    color: statusColors[3],
    type: "zombie"
  }
];

const labelOption = {
  fontSize: "18",
  fontWeight: "bold"
};

export const generatePieOption = ({ data, title, color, noData }) => {
  return {
    tooltip: {
      show: !noData,
      // trigger: "item",
      formatter: "{a} <br/>{b}: {c}%"
    },
    legend: {
      show: false
    },
    grid: {
      left: 0
    },
    series: [
      {
        selectedOffset: 0, // 选中扇区偏移
        silent: noData,
        selectedMode: "single",
        color: noData ? noDataColors : color,
        name: title,
        type: "pie",
        center: [110, 176],
        radius: [72, 86],
        hoverAnimation: !noData,
        avoidLabelOverlap: false,
        label: {
          show: noData,
          position: "center",
          ...labelOption
        },
        emphasis: {
          label: {
            show: true,
            ...labelOption
          }
        },
        labelLine: {
          show: false
        },
        data: noData ? [{ value: 100, name: "暂无数据" }] : data
      }
    ]
  };
};
