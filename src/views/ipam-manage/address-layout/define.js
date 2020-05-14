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
    title: "每段可分配块",
    key: "blocks",
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
        h("label", {
          class: "table-row-button button-green",
          on: {
            click: () => {
              scope.handleViewNetDetail(row);
            }
          }
        }, "查看网络"),
        h("label", {
          class: "table-row-button button-green",
          on: {
            click: () => {
              scope.handleSymbolManage(row);
            }
          }
        }, "标识管理"),
        h("label", {
          class: "table-row-button button-green",
          on: {
            click: () => {
              scope.handleEdit(row);
            }
          }
        }, "编辑")
      ];
    },
    align: "center"
  }
];