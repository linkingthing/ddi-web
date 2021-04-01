const sourceMap = {
  dhcp: "dhcp".toLocaleUpperCase(),
  snmp: "snmp".toLocaleUpperCase()
};

export const columns = scope => [
  {
    title: "子网",
    render: (h, { row }) => {
      return h(
        "a",
        {
          style: {
            // color: row.source === "dhcp" ? "" : "#ff6464"
          },
          class: "is-link",
          on: {
            click: () => {
              scope.handleViewNet(row);
            }
          }
        },
        row.subnet
      );
    },
    width: "440"
  },
  {
    title: "子网跟踪",
    key: "source",
    render: (h, { row }) => {
      return h("div", sourceMap[row.source]);
    }
  },
  {
    title: "名称",
    key: "tags"
  },
  {
    title: "使用率",
    key: "unusedRatio",
    width: "180",
    render: (h, { row }) => {
      if (row.source === "dhcp") {
        return h("common-process", {
          props: {
            percent: 1 - row.unusedRatio
          }
        });
      } else {
        return h("div", "--");
      }
    }
  },
  {
    title: "操作",
    key: "action",
    width: "180",
    render: (h, { row }) => {
      if (row.source === "dhcp") {
        return h("div", [
          h(
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
          ),
          h(
            "a",
            {
              class: "is-link",
              style: {
                marginLeft: "10px"
              },
              attr: {
                href: "javscript:;"
              },
              on: {
                click: () => scope.handleGoBaseLine(row)
              }
            },
            "IP基线"
          )
        ]);
      } else {
        return h("div", "--");
      }
    }
  }
];
