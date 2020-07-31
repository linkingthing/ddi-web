import { deviceTypes } from "./../define";

export const formItemList = [
  {
    label: "终端类型",
    model: "deviceType",
    type: "select",
    placeholder: "请选择终端类型",
    children: JSON.parse(JSON.stringify(deviceTypes))
  },
  {
    label: "机房",
    model: "computerRoom",
    type: "input",
    maxlength: 50,
    placeholder: "请输入机房"
  },
  {
    label: "机柜",
    model: "computerRack",
    type: "input",
    maxlength: 50,
    placeholder: "请输入机柜"
  },
  {
    label: "端口",
    model: "switchPort",
    type: "input",
    maxlength: 50,
    placeholder: "请输入端口"
  },
  {
    label: "所属部门",
    model: "department",
    type: "input",
    maxlength: 50,
    placeholder: "请输入所属部门"
  },
  {
    label: "负责人",
    model: "responsiblePerson",
    type: "input",
    maxlength: 50,
    placeholder: "请输入负责人"
  },
  {
    label: "联系电话",
    model: "telephone",
    type: "input",
    maxlength: 50,
    placeholder: "请输入联系电话"
  }
];