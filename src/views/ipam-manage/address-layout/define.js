export const columns = scope => [  
  {
    title: "名称",
    key: "name",
    align: "left"
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
    className: "operate-column",
    render: (h, { row }) => {
      return h("div",[
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
        }, "查看规划"),
        h("btn-del", {
          on: {
            click: () => {
              scope.handleDelete(row);
            }
          }
        })
      ]);
    },
    align: "right"
  }
];