<template>
  <ModalCustom 
    :visible.sync="dialogVisible"
    :title="getTitle"
    custom-class="fix-or-keep"
    @confirm="handleConfirm"
  >
    <p class="fix-or-keep-info">
      确定要将{{data[0] ? data[0].ip : ""}}
      <br>
      转为固定地址吗
    </p>
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

    type: {
      type: String,
      default: ""
    },

    subnetId: {
      type: String,
      default: ""
    },

    data: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    getTitle() {
      return `转${this.type}`;
    },

    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    }
  },

  methods: {
    async handleConfirm() {
      try {
        let { status, data } = await service.changeToFixOrKeep(this.subnetId, this.getParams());

        if (status === 200) {
          this.$$success("操作成功！");
          
          this.$emit("confirmed");
        }
        else {
          Promise.reject({ message: data.message });
        }
      } catch (err) {
        console.error(err);

        this.$$error(err.message || "操作失败！");

        return Promise.reject();
      }
    },

    getParams() {
      const { 
        ip,
        hostname,
        macaddress        
      } = this.data[0];
       
      let data = { 
        subnetv4Id: this.subnetId,        
        ipaddress: ip
      };

      if (this.type === "固定") {
        data.hostname = hostname;
        data.hwAddress = macaddress;
        // data.clientId = "";
      }
      else {
        // data.duid = "";
        // data.circuitId = "";
      }
      
      return {
        oper: this.type === "固定" ? "tostable" : "toresv",
        data
      };
    }
  }
};
</script>

<style>
@import "./index.less";
</style>