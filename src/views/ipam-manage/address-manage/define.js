export const columns = scope => [
  {
    title: "子网",
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
    width: "440",
    align: "left"
  },
  {
    title: "名称",
    key: "tags",
    align: "center"
  },
  {
    title: "使用率",
    key: "usedRatio",
    align: "right",
    width: "180",
    render: (h, { row }) => {
      return h("common-process",{
        props: {
          percent: row.usedRatio 
        }
      });
    }
  }
];