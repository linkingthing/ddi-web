export const columns = scope => [    
  {
    title: "IP地址",
    key: "poolName",
    align: "center"
  },
  {
    title: "地址总量",
    key: "total",
    align: "center"
  },
  {
    title: "类型",
    key: "addressType",
    align: "center"
  },
  {
    title: "创建时间",
    key: "creationTime",
    width: "130",
    align: "center"
  },
  {
    title: "DHCP使用率",
    key: "usage",
    align: "center",
    render: (h, { row }) => {
      return h("Progress", {
        props: {
          percent: row.usage,
          "stroke-width": 20,
          "text-inside": true
        }
      }, "");
    }
  },
  {
    title: "操作",
    align: "center",      
    render: (h, { row }) => {
      return h("div", [
        h("label", {
          class: "operate-label operate-edit",
          on: {
            click: () => {
              scope.handleEdit(row);
            }
          }
        }, "编辑"),
        h("label", {
          class: "operate-label operate-delete",
          on: {
            click: () => {
              scope.handleDelete(row);
            }
          }
        }, "删除")
      ]);
    }
  }
];