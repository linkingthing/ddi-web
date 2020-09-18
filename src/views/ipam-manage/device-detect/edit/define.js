import { isIp, mobilePhoneReg } from "@/util/common";
import { deviceTypes, manufacturers } from "../define";

const required = true;

export const formItemList = isNew => [    
  {
    label: "设备名称",
    model: "name",
    type: "input",
    disabled: !isNew,
    maxlength: 50,
    placeholder: "请输入设备名称"
  },
  {
    label: "管理IP",
    model: "administrationAddress",
    type: "input",
    maxlength: 50,
    placeholder: "请输入管理IP"
  },
  {
    label: "设备类型",
    model: "equipmentType",
    type: "select",
    children: deviceTypes,
    placeholder: "请选择设备类型"
  },
  {
    label: "序列号",
    model: "serialNumber",
    type: "input",
    maxlength: 50,
    placeholder: "请输入序列号"
  },
  {
    label: "厂商",
    model: "manufacturer",
    type: "input",
    placeholder: "请输入厂商"
  },
  {
    label: "固件版本",
    model: "firmwareVersion",
    type: "input",
    maxlength: 50,
    placeholder: "请输入固件版本"
  },
  // {
  //   label: "上联地址",
  //   model: "uplinkAddress",
  //   type: "input",
  //   maxlength: 50,
  //   placeholder: "请输入上联地址"
  // },
  // {
  //   label: "下联地址",
  //   model: "downlinkAddress",
  //   type: "input",
  //   maxlength: 50,
  //   placeholder: "请输入下联地址"
  // },
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
    label: "地理位置",
    model: "location",
    type: "input",
    maxlength: 50,
    placeholder: "请输入地理位置"
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

const validateIP = (rule, value, callback) => {
  console.log(value)
  if (!value) {
    return callback(new Error("请输入管理IP"));
  }

  if (!isIp(value)) {
    callback(new Error("请输入正确的管理IP"));
  } else {
    callback();
  }
};

export const rules = {
  name: [
    {
      required,
      message: "请输入设备名称"
    }
  ],
  administrationAddress: [
    {
      required,
      validator: validateIP
    }
  ],
  equipmentType: [
    {
      required,
      message: "请选择设备类型"
    }
  ],
  manufacturer: [
    {
      message: "请选择厂商"
    }
  ],
  telephone: [
    {
      pattern: mobilePhoneReg,
      message: "请输入正确的联系电话"
    }
  ]
};