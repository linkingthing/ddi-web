<template>
  <ModalCustom 
    :visible.sync="dialogVisible"
    title="编辑网络"
    @confirm="handleConfirm"
  >
    <div class="subnet-info-edit">
      <div class="info-row-inline">
        <div class="info-row-label">区域</div>
        <Input
          maxlength="255"
          v-model="name"
          placeholder="请输入区域"
          class="info-row-input" />
      </div>
      <div class="info-row-inline">
        <div class="info-row-label">DNS</div>
        <Checkbox v-model="enableDNS">启用</Checkbox>
      </div>
      <div class="info-row-inline">
        <div class="info-row-label">DHCP</div>
        <Checkbox v-model="enableDHCP">启用</Checkbox>
      </div>
      <div class="info-row-inline">
        <div class="info-row-label">备注</div>
        <Input
          maxlength="50"
          v-model="remark"
          type="textarea"
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
      name: "",
      remark: "",
      enableDNS: false,
      enableDHCP: true
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
      this.name = val.name || "";
      this.remark = val.remark || "";
      this.enableDNS = val.enableDNS || false;
      this.enableDHCP = val.enableDHCP === undefined ? true : val.enableDHCP;
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