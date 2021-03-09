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
    minWidth: 160
  },
  {
    title: "地址类型",
    key: "ipTypeText",
    minWidth: 120
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
    minWidth: 120
  },
  {
    title: "租赁过期时间",
    key: "expire",
    minWidth: 190
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
              type: "default",
              disabled: row.ipType === "unmanagered"
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
            },
            props: {
              type: "default",
              disabled:
                row.ipType === "reservation" ||
                !(row.ipState === "conflict" && row.ipType === "unused")
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
/**
 * 地址类型转换
可以转成静态地址：地址类型为未使用地址、地址状态为冲突地址
可以转成固定地址：
地址类型为未使用地址、地址状态为冲突地址
地址类型为未分配地址、地址状态为冲突地址
地址类型为已分配地址、地址状态为活跃地址
不活跃的静态地址可以回收（删除）
*/
function showFix(row) {
  if (row.ipState === "conflict") {
    if (["unused", "unassigned"].includes(row.ipType)) {
      return true;
    }
  }

  if (row.ipState === "active") {
    if (row.ipType === "assigned") {
      return true;
    }
  }

  return false;
}

export const typeColors = [
  "#06DFE9",
  "#0E90FF",
  "#97DB24",
  "#6E6EF5",
  "#1EE9CA"
];
export const statusColors = ["#1EE9CA", "#1272FF", "#FF6464", "#FFB83C"];

const noDataColors = ["#ebebeb"];

export const ipTypeMap = {
  assigned: {
    label: "已分配地址"
  },
  unassigned: {
    label: "未分配地址"
  },
  reservation: {
    label: "固定地址"
  },
  static: {
    label: "静态地址"
  },
  unused: {
    label: "未使用地址"
  },
  unmanagered: {
    label: "未管理地址"
  }
};

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
    type: "unused"
  },
  {
    percent: 0,
    label: "未管理地址",
    color: typeColors[5],
    type: "unmanagered"
  }
];

export const ipStateMap = Object.freeze(
  Object.create(null, {
    active: {
      value: {
        label: "活跃地址"
      }
    },
    inactive: {
      value: {
        label: "不活跃地址"
      }
    },
    conflict: {
      value: {
        label: "冲突地址"
      }
    },
    zombie: {
      value: {
        label: "僵尸地址"
      }
    }
  })
);

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
