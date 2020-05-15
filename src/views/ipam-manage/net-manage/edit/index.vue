<template>
  <common-modal 
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
        <Input
          maxlength="255"
          v-model="macaddress"
          placeholder="请输入"
          class="info-row-input" />
      </div>
      <div class="info-row-inline">
        <div class="info-row-label">厂家：</div>
        <Input
          maxlength="255"
          v-model="macvender"
          placeholder="请输入"
          class="info-row-input" />
      </div>
      <div class="info-row-inline">
        <div class="info-row-label">地址类型：</div>
        <div class="info-row-text">{{typeText}}</div>
      </div>
      <div class="info-row-inline">
        <div class="info-row-label">操作系统：</div>
        <Input
          maxlength="255"
          v-model="opersystem"
          placeholder="请输入"
          class="info-row-input" />
      </div>
      <div class="info-row-inline">
        <div class="info-row-label">交换机端口号：</div>
        <Input
          maxlength="3"
          v-model="interfaceid"
          placeholder="请输入"
          class="info-row-input" />
      </div>
      <div class="info-row-inline">
        <div class="info-row-label">指纹：</div>
        <Input
          maxlength="255"
          v-model="fingerprint"
          placeholder="请输入"
          class="info-row-input" />
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
  </common-modal>
</template>

<script>
import service from "@/services";
import { isPosNumber, macAddressIsValid } from "@/util/common";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },

    data: {
      type: Object,
      default: () => ({})
    },

    subnetId: {
      type: [Number,String],
      default: null
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

        let { status, message } = await service.editIpInfo(this.subnetId, this.data.id, this.getParams());

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
        macaddress,
        macvender,
        opersystem,
        fingerprint,    

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
      macaddress = macaddress.trim();
      macvender = macvender.trim();
      opersystem = opersystem.trim();
      fingerprint = fingerprint.trim();
      deviceType = deviceType.trim();
      business = business.trim();
      chargeperson = chargeperson.trim();
      tel = tel.trim();
      department = department.trim();
      position = position.trim();

      if (!hostname) {
        return Promise.reject({ message: "请输入主机名！" });
      }

      if (!macaddress) {
        return Promise.reject({ message: "请输入MAC地址！" });
      }
      else if (!macAddressIsValid(macaddress)) {
        return Promise.reject({ message: "请输入正确的MAC地址！" });
      }

      if (!macvender) {
        return Promise.reject({ message: "请输入厂家！" });
      }

      if (!opersystem) {
        return Promise.reject({ message: "请输入操作系统！" });
      }

      if (!interfaceid) {
        return Promise.reject({ message: "请输入交换机端口号！" });
      }
      else if (!isPosNumber(interfaceid) || parseFloat(interfaceid) > 100) {
        return Promise.reject({ message: "交换机端口号不得大于100！" });
      }

      if (!fingerprint) {
        return Promise.reject({ message: "请输入指纹！" });
      }

      if (devicetypeflag) {
        if (!deviceType) {
          return Promise.reject({ message: "请输入设备类型！" });
        }
      }

      if (businessflag) {
        if (!business) {
          return Promise.reject({ message: "请输入业务名称！" });
        }
      }

      if (chargepersonflag) {
        if (!chargeperson) {
          return Promise.reject({ message: "请输入负责人！" });
        }
      }

      if (telflag) {
        if (!tel) {
          return Promise.reject({ message: "请输入电话！" });
        }
      }

      if (departmentflag) {
        if (!department) {
          return Promise.reject({ message: "请输入所属部门！" });
        }
      }

      if (positionflag) {
        if (!position) {
          return Promise.reject({ message: "请输入地址位置！" });
        }
      }

      return Promise.resolve();
    },

    getParams() {
      let {
        hostname,
        interfaceid,
        macaddress,
        macvender,
        opersystem,
        fingerprint, 

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
        macaddress,
        macvender,
        opersystem,
        fingerprint, 

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