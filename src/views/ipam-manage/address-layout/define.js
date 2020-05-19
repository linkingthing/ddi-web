export const columns = scope => [  
  {
    type: "selection",
    width: 60,
    align: "center"
  },
  {
    title: "名称",
    key: "name",
    align: "center"
  },
  {
    title: "规划",
    key: "segments",
    align: "center"
  },
  {
    title: "创建时间",
    key: "creationTimestamp",
    align: "center"
  },
  {
    title: "操作",    
    render: (h, { row }) => {
      return [
        h("Button", {
          class: "table-row-button",
          props: {
            type: "default"
          },
          on: {
            click: () => {
              scope.handleViewNetDetail(row);
            }
          }
        }, "查看网络"),
        h("Button", {
          class: "table-row-button",
          props: {
            type: "default"
          },
          on: {
            click: () => {
              scope.handleViewPlanDetail(row);
            }
          }
        }, "查看规划")
      ];
    },
    align: "center"
  }
];