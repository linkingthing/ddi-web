export const columns = scope => [
  {
    type: "selection",
    width: 60,
    align: "center"
  },
  {
    title: "IP地址",
    key: "ip",
    minWidth: 160,
    align: "center"
  },
  {
    title: "MAC地址",
    key: "mac",
    minWidth: 160,
    align: "center"
  },
  {
    title: "类型",
    key: "ipType",
    minWidth: 120,
    align: "center"
  },
  {
    title: "租约状态",
    key: "ipState",
    minWidth: 120,
    align: "center"
  },
  {
    title: "租赁时间",
    key: "validLifetime",
    minWidth: 120,
    align: "center"
  },
  {
    title: "操作",
    align: "center",  
    minWidth: 120,    
    render: (h, { row }) => {
      return h("Button", {
        class: "table-row-button",
        props: {
          type: "primary"
        },
        on: {
          click: () => {              
            scope.handleEdit(row);
          }
        }
      }, "编辑");
    }
  }
];

export const typeColors = ["#4586FE", "#F2A16B", "#63D58B", "#76DCEB"];
export const statusColors = ["#4586FE", "#F2A16B", "#CBCBCB"];

export const typeLegends = [
  {
    percent: 0,
    label: "已分配地址",
    color: typeColors[0]
  },
  {
    percent: 0,
    label: "未分配地址",
    color: typeColors[1]
  },
  {
    percent: 0,
    label: "固定地址",
    color: typeColors[2]
  },
  {
    percent: 0,
    label: "未管理地址",
    color: typeColors[3]
  }
];

export const statusLegends = [
  {
    percent: 0,
    label: "活跃地址",
    color: statusColors[0]
  },
  {
    percent: 0,
    label: "冲突地址",
    color: statusColors[1]
  },
  {
    percent: 0,
    label: "僵尸地址",
    color: statusColors[2]
  }
];

export const generatePieOption = ({ data, title, color }) => {
  return {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} | {d}%"
    },
    legend: {
      show: false
    },
    grid: {
      left: 0
    },
    series: [
      {
        color,
        name: title,
        type: "pie",
        center: [110,170],
        radius: [60, 90],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "18",
            fontWeight: "bold"
          }
        },
        labelLine: {
          show: false
        },
        data
      }
    ]
  };
};