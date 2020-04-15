export const legendList = [
  {
    label: "未使用地址",
    unused: true,
    value: "unused"
  },
  {
    label: "动态地址",
    dynamic: true,
    value: "dynamic"
  },
  {
    label: "冲突地址",
    collision: true,
    value: "collision"
  },
  {
    label: "保留地址",
    reserved: true,
    value: "reserved"
  },
  {
    label: "手动地址",
    manual: true,
    value: "manual"
  },
  {
    label: "固定地址",
    stable: true,
    value: "stable"
  },
  {
    label: "已分配地址",
    lease: true,
    value: "lease"
  },
  {
    label: "僵尸地址",
    dead: true,
    value: "dead"
  },
  {
    label: "当前选中IP",
    selected: true,
    value: "selected"
  }
];

export const statusList = {
  unused: "unused",// 未使用地址
  dynamic: "dynamic",// 动态地址
  collision: "collision",// 冲突地址
  reserved: "reserved",// 保留地址
  manual: "manual",// 手动地址
  stable: "stable",// 固定地址
  lease: "lease",// 已分配地址
  dead: "dead",// 僵尸地址
  selected: "selected"// 被选中的
};