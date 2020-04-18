<template>
  <ModalCustom 
    :visible.sync="dialogVisible"
    title="自定义属性"
    :width="560"
    @confirm="handleConfirm"
  >
    <IviewLoading v-if="loading" />

    <div class="config-attribute">
      <Checkbox v-model="DeviceTypeFlag">
        <span>设备类型</span>
      </Checkbox>
      <Checkbox v-model="BusinessFlag">
        <span>业务名称</span>
      </Checkbox>
      <Checkbox v-model="ChargePersonFlag">
        <span>负责人</span>
      </Checkbox>
      <Checkbox v-model="TelFlag">
        <span>电话</span>
      </Checkbox>
      <Checkbox v-model="DepartmentFlag">
        <span>所属部门</span>
      </Checkbox>
      <Checkbox v-model="PositionFlag">
        <span>地址位置</span>
      </Checkbox>
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
      DeviceTypeFlag: false,
      BusinessFlag: false,
      ChargePersonFlag: false,
      TelFlag: false,
      DepartmentFlag: false,
      PositionFlag: false
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
      this.DeviceTypeFlag = val.devicetypeflag === undefined ? false : val.devicetypeflag;
      this.BusinessFlag = val.businessflag === undefined ? false : val.businessflag;
      this.ChargePersonFlag = val.chargePersonflag === undefined ? false : val.chargePersonflag;
      this.TelFlag = val.telflag === undefined ? false : val.telflag;
      this.DepartmentFlag = val.departmentflag === undefined ? false : val.departmentflag;
      this.PositionFlag = val.positionflag === undefined ? false : val.positionflag;
    },

    async handleConfirm() {
      try {
        this.loading = true;

        let params = this.getParams();

        let { status, message } = await service.editSubnetConfig(this.data.id, params);

        status = +status;
        
        if (status === 200 || status === 201) {
          this.$$success("保存成功！");

          this.$emit("confirmed", {
            id: this.data.id,
            params
          });
        }
        else {
          Promise.reject({ message });
        }

        this.loading = false;
      } 
      catch (err) {
        console.error(err);

        this.$$error(err && err.message || "保存失败！");

        this.loading = false;

        return Promise.reject();
      }
    },

    getParams() {
      return {
        DeviceTypeFlag: this.DeviceTypeFlag,
        BusinessFlag: this.BusinessFlag,
        ChargePersonFlag: this.ChargePersonFlag,
        TelFlag: this.TelFlag,
        DepartmentFlag: this.DepartmentFlag,
        PositionFlag: this.PositionFlag
      };
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>