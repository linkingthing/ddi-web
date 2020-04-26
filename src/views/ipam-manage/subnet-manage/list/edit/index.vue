<template>
  <ModalCustom 
    :visible.sync="dialogVisible"
    title="编辑网络"
    @confirm="handleConfirm"
  >
    <IviewLoading v-if="loading" />

    <div class="subnet-info-edit">
      <div class="info-row-inline">
        <div class="info-row-label">区域</div>
        <Input
          maxlength="255"
          v-model="zoneName"
          placeholder="请输入区域"
          class="info-row-input" />
      </div>
      <div class="info-row-inline">
        <div class="info-row-label">DNS</div>
        <Checkbox v-model="dnsEnable" @on-change="handleDNSChange">启用</Checkbox>

        <div v-if="showViewList" class="view-name">
          <div class="info-row-label view-name-label">视图名称</div>
          <Select v-model="viewId">
            <Option 
              v-for="item in viewList" 
              :value="item.value" 
              :key="item.value"
            >
              {{ item.label }}
            </Option>
          </Select>
        </div>
      </div>
      <div class="info-row-inline">
        <div class="info-row-label">DHCP</div>
        <Checkbox v-model="dhcpEnable">启用</Checkbox>
      </div>
      <div class="info-row-inline">
        <div class="info-row-label">备注</div>
        <Input
          maxlength="50"
          v-model="note"
          type="textarea"
          class="info-row-input" />
      </div>
    </div>
  </ModalCustom>
</template>

<script>
import ModalCustom from "@/components/ModalCustom";
import service from "@/services";
import { getAddressType, domainIsValid } from "@/util/common";

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
      zoneName: "",
      note: "",
      dnsEnable: false,
      dhcpEnable: true,
      showViewList: false,
      viewId: "",
      viewList: []
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

  mounted() {
    this.getViewList();
  },

  methods: {
    handleDNSChange(val) {
      this.showViewList = val;
      this.viewId = "";
    },

    async getViewList() {
      try {
        let res = await this.$getViewList();

        this.viewList = JSON.parse(JSON.stringify(res));
        
      } catch (error) {
        console.error(error);
        
        this.$$error(error.message || "请求视图列表失败！");
      }
    },

    setValue(val = {}) {
      this.zoneName = val.zoneName || "";
      this.note = val.note || "";
      this.dnsEnable = Boolean(val.dnsEnable) || false;
      this.dhcpEnable = val.dhcpEnable === undefined ? true : Boolean(val.dhcpEnable);
      this.dhcpEnable = val.dhcpEnable === undefined ? true : Boolean(val.dhcpEnable);
      this.viewId = val.viewId || "";
    },

    async handleConfirm() {
      try {
        await this.validate();
        
        if (!this.dhcpEnable) {          
          await new Promise((resolve, reject) => {
            this.$Modal.confirm({
              title: "警告",
              content: "关闭DHCP功能，子网下的地址池配置将被删除，同时地址不能被DHCP服务管理。<br>您确认需要关闭吗？",
              onOk: () => {
                resolve();
              },
              onCancel: () => {
                reject({ showMessage: false });
              }
            });
          });
        }

        this.loading = true;

        const action = getAddressType(this.data.subnet) === "ipv4" ? "editIPv4ChildNet" : "editIPv6ChildNet";

        let { status, message } = await service[action](this.getParams(), this.data.subnet_id);

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
        if (err) {
          if (err.showMessage) {
            console.error(err);

            this.$$error(err.message || "保存失败！");
          }
          else if (err.showMessage === undefined) {
            this.$$error(err.message || "保存失败");
          }
        }
        else {
          this.$$error(err.message || "保存失败");
        }

        this.loading = false;

        return Promise.reject();
      }
    },

    validate() {
      let { note, zoneName, dnsEnable } = this;
      
      note = note.trim();
      zoneName = zoneName.trim();

      if (!zoneName) {
        return Promise.reject({ message: "请输入区域名称！" });
      }
      else if (!domainIsValid(zoneName)) {
        return Promise.reject({ message: "请输入正确的区域名称！" });
      }

      if (dnsEnable && !this.viewId) {
        return Promise.reject({ message: "请选择视图！" });
      }

      if (note.length > 255) {
        return Promise.reject({ message: "备注长度不得大于255个字符！" });
      }

      return Promise.resolve();
    },

    getParams() {
      return {
        note: this.note.trim(),
        name: this.zoneName.trim(),
        zoneName: this.zoneName.trim(),
        dnsEnable: Number(this.dnsEnable),
        dhcpEnable: Number(this.dhcpEnable),
        viewId: this.viewId
      };
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>