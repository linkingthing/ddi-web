export const columns = scope => [
  {
    title: "网络",
    render: (h, { row }) => {
      return h("a", {
        class: "is-link",
        on: {
          click: () => {
            scope.handleViewNet(row);
          }
        }
      }, row.ipnet);
    },
    align: "left"
  },
  {
    title: "备注",
    key: "tags",
    align: "center"
  },
  {
    title: "使用率",
    key: "usedRatio",
    align: "center",
    width: "180",
    render: (h, { row }) => {
      return h("common-process",{
        props: {
          percent: row.usedRatio 
        }
      });
    }
  },
  {
    title: "创建时间",
    key: "creationTimestamp",
    align: "center"
  }
];