export const columns = (self) => [
  {
    title: "时间",
    key: "creationTime",
    align: "left",
    width: 200,
  },
  {
    title: "IP地址",
    key: "sourceIp",
    align: "center",
    width: 200,
  },
  {
    title: "操作",
    key: "content",
    align: "left",
    render: (h, { row }) => {
      return h("div", [
        row.content,
        h("Icon", {
          style: {
            verticalAlign: "baseline",
            paddingLeft: "10px",
            fontSize: "16px",
            cursor: "pointer"
          },
          props: {
            custom: "icon-detail"
          },
          on: {
            click: () => self.handleOpenMessage(row),
          },
        }),
      ]);
    },
  },
  {
    title: "结果",
    key: "opperText",
    align: "right",
    width: 200,
  },
];
