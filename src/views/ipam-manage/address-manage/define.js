export const columns = scope => [
  {
    title: "子网",
    render: (h, { row }) => {
      return h(
        "a",
        {
          class: "is-link",
          on: {
            click: () => {
              scope.handleViewNet(row);
            }
          }
        },
        row.ipnet
      );
    },
    width: "440"
  },
  {
    title: "名称",
    key: "tags"
  },
  {
    title: "使用率",
    key: "usedRatio",
    width: "180",
    render: (h, { row }) => {
      return h("common-process", {
        props: {
          percent: row.usedRatio
        }
      });
    }
  },
  {
    title: "操作",
    key: "action",
    width: "180",
    render: (h, { row }) => {
      return h(
        "a",
        {
          class: "is-link",

          attr: {
            href: "javscript:;"
          },
          on: {
            click: () => scope.handleGoIpHistory(row)
          }
          
        },
        "IP历史"
      );
    }
  }
];
