<template>
  <ModalCustom 
    :visible.sync="dialogVisible"
    title="自定义属性"
    @confirm="handleConfirm"
  >
    <div class="config-attribute">
      <CheckboxGroup v-model="configs">
        <Checkbox label="设备类型"/>
        <Checkbox label="业务名称"/>
        <Checkbox label="负责人"/>
        <Checkbox label="电话"/>
        <Checkbox label="所属部门"/>
        <Checkbox label="位置"/>
      </CheckboxGroup>
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
    }
  },

  data() {
    return {
      dialogVisible: false,
      configs: []
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
    setValue(val = []) {
      this.configs = val;
    },

    async handleConfirm() {
      return;

      try {
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
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>