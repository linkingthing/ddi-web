export const columns = scope => [
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
    key: "ipTypeText",
    minWidth: 120,
    align: "center"
  },
  {
    title: "租约状态",
    key: "ipStateText",
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
        style: {
          width: "80px"
        },
        props: {
          type: "default"
        },
        on: {
          click: () => {              
            scope.handleEdit(row);
          }
        }
      }, "属性编辑");
    }
  }
];

export const typeColors = ["#4586FE", "#f9904a", "#63D58B", "#76DCEB"];
export const statusColors = ["#4586FE", "#f9904a", "#e84141", "#CBCBCB"];

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
    type: "unmanagered"
  }
  // {
  //   percent: 0,
  //   label: "未管理地址",
  //   color: typeColors[3],
  //   type: "reservation"
  // }
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

export const generatePieOption = ({ data, title, color }) => {
  return {
    tooltip: {
      trigger: "item",
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