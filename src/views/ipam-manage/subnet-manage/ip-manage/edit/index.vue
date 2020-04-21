<template>
  <ModalCustom 
    :visible.sync="dialogVisible"
    title="IP地址编辑"
    @confirm="handleConfirm"
  >
    <IviewLoading v-if="loading" />
    
    <div class="ip-info-edit">
      <div class="info-row-inline">
        <div class="info-row-label">主机名：</div>
        <Input
          maxlength="255"
          v-model="hostname"
          placeholder="请输入"
          class="info-row-input" />
      </div>
      <div class="info-row-inline">
        <div class="info-row-label">MAC地址：</div>
        <div class="info-row-text">{{macaddress}}</div>
      </div>
      <div class="info-row-inline">
        <div class="info-row-label">厂家：</div>
        <div class="info-row-text">{{macvender}}</div>
      </div>
      <div class="info-row-inline">
        <div class="info-row-label">地址类型：</div>
        <div class="info-row-text">{{typeText}}</div>
      </div>
      <div class="info-row-inline">
        <div class="info-row-label">操作系统：</div>
        <div class="info-row-text">{{opersystem}}</div>
      </div>
      <div class="info-row-inline">
        <div class="info-row-label">端口号：</div>
        <Input
          maxlength="255"
          v-model="interfaceid"
          placeholder="请输入"
          class="info-row-input" />
      </div>
      <div class="info-row-inline">
        <div class="info-row-label">指纹：</div>
        <div class="info-row-text">{{fingerprint}}</div>
      </div>
      <div class="info-row-inline" v-if="devicetypeflag">
        <div class="info-row-label">设备类型：</div>
        <Input
          maxlength="255"
          v-model="deviceType"
          placeholder="请输入"
          class="info-row-input" />
      </div>
      <div class="info-row-inline" v-if="businessflag">
        <div class="info-row-label">业务名称：</div>
        <Input
          maxlength="255"
          v-model="business"
          placeholder="请输入"
          class="info-row-input" />
      </div>
      <div class="info-row-inline" v-if="chargepersonflag">
        <div class="info-row-label">负责人：</div>
        <Input
          maxlength="255"
          v-model="chargeperson"
          placeholder="请输入"
          class="info-row-input" />
      </div>
      <div class="info-row-inline" v-if="telflag">
        <div class="info-row-label">电话：</div>
        <Input
          maxlength="255"
          v-model="tel"
          placeholder="请输入"
          class="info-row-input" />
      </div>
      <div class="info-row-inline" v-if="departmentflag">
        <div class="info-row-label">所属部门：</div>
        <Input
          maxlength="255"
          v-model="department"
          placeholder="请输入"
          class="info-row-input" />
      </div>
      <div class="info-row-inline" v-if="positionflag">
        <div class="info-row-label">地址位置：</div>
        <Input
          maxlength="255"
          v-model="position"
          placeholder="请输入"
          class="info-row-input" />
      </div>
    </div>
  </ModalCustom>
</template>

<script>
import ModalCustom from "@/components/ModalCustom";
import service from "@/services";

export default {
  components: {
    ModalCustom
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },

    data: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      loading: false,
      dialogVisible: false,
      hostname: "",
      macaddress: "",
      macvender: "",
      typeText: "",
      opersystem: "",
      interfaceid: "",
      fingerprint: "",      

      devicetypeflag: false,
      businessflag: false,
      chargepersonflag: false,
      telflag: false,
      departmentflag: false,
      positionflag: false,

      deviceType: "",
      business: "",
      chargeperson: "",
      tel: "",
      department: "",
      position: ""
    };
  },

  watch: {
    visible(val) {
      if (!val) return;
      
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.setValue();

      this.$emit("update:visible", val);
    },

    data(val) {
      this.setValue(val);
    }
  },

  methods: {
    setValue(val = {}) {
      this.hostname = val.hostname || "";
      this.macaddress = val.macaddress || "";
      this.macvender = val.macvender || "";
      this.typeText = val.typeText || "";
      this.opersystem = val.opersystem || "";
      this.interfaceid = val.interfaceid || "";
      this.fingerprint = val.fingerprint || "";
      // console.log(val);

      this.devicetypeflag = val.devicetypeflag === undefined ? false : val.devicetypeflag;
      this.businessflag = val.businessflag === undefined ? false : val.businessflag;
      this.chargepersonflag = val.chargepersonflag === undefined ? false : val.chargepersonflag;
      this.telflag = val.telflag === undefined ? false : val.telflag;
      this.departmentflag = val.departmentflag === undefined ? false : val.departmentflag;
      this.positionflag = val.positionflag === undefined ? false : val.positionflag;
      
      this.deviceType = val.deviceType || "";
      this.business = val.business || "";
      this.chargeperson = val.chargeperson || "";
      this.tel = val.tel || "";
      this.department = val.department || "";
      this.position = val.position || "";
    },

    async handleConfirm() {
      try {
        await this.validate();

        this.loading = true;

        let { status, message } = await service.editIpInfo(this.data.id, this.getParams());

        status = +status;
        
        if (status === 200 || status === 201) {
          this.$$success("保存成功！");
        }
        else {
          Promise.reject({ message });
        }

        this.$emit("confirmed");

        this.loading = false;
      } 
      catch (err) {
        console.error(err);

        this.$$error(err && err.message || "保存失败！");

        this.loading = false;

        return Promise.reject();
      }
    },

    validate() {
      let { 
        hostname,
        interfaceid,

        devicetypeflag,
        businessflag,
        chargepersonflag,
        telflag,
        departmentflag,
        positionflag,

        deviceType,
        business,
        chargeperson,
        tel,
        department,
        position
      } = this;

      hostname = hostname.trim();
      interfaceid = interfaceid.trim();
      deviceType = deviceType.trim();
      business = business.trim();
      chargeperson = chargeperson.trim();
      tel = tel.trim();
      department = department.trim();
      position = position.trim();

      if (!hostname) {
        return Promise.reject({ message: "请输入主机名！" });
      }
      else if (hostname.length > 255) {
        return Promise.reject({ message: "主机名长度不得大于255个字符！" });
      }

      if (!interfaceid) {
        return Promise.reject({ message: "请输入端口号！" });
      }
      else if (interfaceid.length > 255) {
        return Promise.reject({ message: "端口号长度不得大于255个字符！" });
      }

      if (devicetypeflag) {
        if (!deviceType) {
          return Promise.reject({ message: "请输入设备类型！" });
        }
        else if (deviceType.length > 255) {
          return Promise.reject({ message: "设备类型长度不得大于255个字符！" });
        }
      }

      if (businessflag) {
        if (!business) {
          return Promise.reject({ message: "请输入业务名称！" });
        }
        else if (business.length > 255) {
          return Promise.reject({ message: "业务名称长度不得大于255个字符！" });
        }
      }

      if (chargepersonflag) {
        if (!chargeperson) {
          return Promise.reject({ message: "请输入负责人！" });
        }
        else if (chargeperson.length > 255) {
          return Promise.reject({ message: "负责人长度不得大于255个字符！" });
        }
      }

      if (telflag) {
        if (!tel) {
          return Promise.reject({ message: "请输入电话！" });
        }
        else if (tel.length > 255) {
          return Promise.reject({ message: "电话长度不得大于255个字符！" });
        }
      }

      if (departmentflag) {
        if (!department) {
          return Promise.reject({ message: "请输入所属部门！" });
        }
        else if (department.length > 255) {
          return Promise.reject({ message: "所属部门长度不得大于255个字符！" });
        }
      }

      if (positionflag) {
        if (!position) {
          return Promise.reject({ message: "请输入地址位置！" });
        }
        else if (position.length > 255) {
          return Promise.reject({ message: "地址位置长度不得大于255个字符！" });
        }
      }

      return Promise.resolve();
    },

    getParams() {
      let {
        hostname,
        interfaceid,

        devicetypeflag,
        businessflag,
        chargepersonflag,
        telflag,
        departmentflag,
        positionflag,

        deviceType,
        business,
        chargeperson,
        tel,
        department,
        position
      } = this;

      return {
        ip: this.data.ip,
        hostname,
        interfaceid,

        devicetypeflag,
        businessflag,
        chargepersonflag,
        telflag,
        departmentflag,
        positionflag,

        deviceType,
        business,
        chargeperson,
        tel,
        department,
        position
      };
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>