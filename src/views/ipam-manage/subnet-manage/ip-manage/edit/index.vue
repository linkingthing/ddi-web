<template>
  <ModalCustom 
    :visible.sync="dialogVisible"
    title="IP地址编辑"
    @confirm="handleConfirm"
  >
    <div class="subnet-info-edit">
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
        <Input
          maxlength="255"
          v-model="AddressType"
          placeholder="请输入"
          class="info-row-input" />
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
        <div class="info-row-label">端口号：</div>
        <Input
          maxlength="255"
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
      <div class="info-row-inline">
        <div class="info-row-label">设备类型：</div>
        <Input
          maxlength="255"
          v-model="deviceType"
          placeholder="请输入"
          class="info-row-input" />
      </div>
      <div class="info-row-inline">
        <div class="info-row-label">地址位置：</div>
        <Input
          maxlength="255"
          v-model="address"
          placeholder="请输入"
          class="info-row-input" />
      </div>
      <div class="info-row-inline">
        <div class="info-row-label">所属部门：</div>
        <Input
          maxlength="255"
          v-model="department"
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
      dialogVisible: false,
      hostname: "",
      macaddress: "",
      macvender: "",
      AddressType: "",
      opersystem: "",
      interfaceid: "",
      fingerprint: "",
      deviceType: "",
      address: "",
      department: ""
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
      this.AddressType = val.AddressType || "";
      this.opersystem = val.opersystem || "";
      this.interfaceid = val.interfaceid || "";
      this.fingerprint = val.fingerprint || "";
      this.deviceType = val.deviceType || "";
      this.address = val.address || "";
      this.department = val.department || "";
    },

    async handleConfirm() {
      try {
        await this.validate();

        let { status, data } = await service.editChildNet(this.getParams());

        status = +status;
        
        if (status === 200 || status === 201) {
          this.$$success("保存成功！");
        }
        else {
          Promise.reject({ message: data.message });
        }

        this.$emit("confirmed");
      } 
      catch (err) {
        console.error(err);

        this.$$error(err && err.message || "保存失败！");
      }
    },

    validate() {
      let { remark, name, enableDNS, enableDHCP } = this;

      remark = remark.trim();
      name = name.trim();

      if (!name) {
        return Promise.reject({ message: "请输入区域！" });
      }
      else if (name.length > 255) {
        return Promise.reject({ message: "区域长度不得大于255个字符！" });
      }

      return Promise.resolve();
    },

    getParams() {
      return {
        remark: this.remark.trim(),
        name: this.name.trim(),
        enableDNS: this.enableDNS,
        enableDHCP: this.enableDHCP
      };
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>