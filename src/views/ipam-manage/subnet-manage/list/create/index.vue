<template>
  <ModalCustom 
    :visible.sync="dialogVisible"
    title="新增网络"
    @confirm="handleConfirm"
  >
    <IviewLoading v-if="loading" />

    <div class="child-net-info">
      <div class="info-row">
        <div class="info-row-label">区域</div>
        <Input
          maxlength="255"
          v-model="zoneName"
          placeholder="请输入区域"
          class="info-row-input" />
      </div>
      <div class="info-row">
        <div class="info-row-label">网络地址</div>
        <Input
          maxlength="50"
          v-model="subnet"
          placeholder="请输入网络地址"
          class="info-row-input" />
      </div>
    </div>
  </ModalCustom>
</template>

<script>
import ModalCustom from "@/components/ModalCustom";
import service from "@/services";
import { isIPv4Reg, fullIPv6Reg, getAddressType, gatewayIsValid } from "@/util/common";

export default {
  components: {
    ModalCustom
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,
      dialogVisible: false,
      subnet: "",
      zoneName: ""
    };
  },

  watch: {
    visible(val) {
      if (!val) return;
      
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.init();

      this.$emit("update:visible", val);
    }
  },

  methods: {
    init() {
      this.subnet = "";
      this.zoneName = "";
    },

    async handleConfirm() {
      try {
        await this.validate();

        this.loading = true;

        const key = getAddressType(this.subnet) === "ipv4" ? "addIPv4ChildNet" : "addIPv6ChildNet";

        let { status, message } = await service[key](this.getParams());

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
      let { subnet, zoneName } = this;

      // 验证区域
      if (!zoneName) {
        return Promise.reject({ message: "请输入区域！" });
      }
      else {
        if (zoneName.length > 255) {
          return Promise.reject({ message: "请输入正确的区域！" });
        }
      }
      
      let tmp = subnet.trim().split("/");

      subnet = tmp[0];
      zoneName = zoneName.trim();

      if (tmp.length > 2 || tmp.length === 1) {
        return Promise.reject({ message: "请输入正确的网络地址！" });
      }

      const addrType = getAddressType(subnet);
      
      // 验证网络地址
      if (!subnet) {
        return Promise.reject({ message: "请输入网络地址！" });
      }
      else {        
        if (addrType === "ipv4") {
          if (!isIPv4Reg.test(subnet)) {
            return Promise.reject({ message: "请输入正确的网络地址！" });
          }
        }
        else if (addrType === "ipv6") {
          if (!fullIPv6Reg.test(subnet)) {
            return Promise.reject({ message: "请输入正确的网络地址！" });
          }
        }
      }

      // 验证网络地址掩码
      if (!gatewayIsValid(this.subnet)) {
        return Promise.reject({ message: "请输入正确的网络地址掩码！" });
      }

      return Promise.resolve();
    },

    getParams() {
      return {
        subnet: this.subnet.trim(),
        zoneName: this.zoneName.trim(),
        name: this.zoneName.trim()
      };
    }
  }
};
</script>