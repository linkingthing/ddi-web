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
  components:{
    ModalCustom
  },

  props:{
    visible:{
      type: Boolean,
      default: false
    },

    type:{
      type:String,
      default:""
    },

    subnetvId:{
      type:String,
      default:""
    },

    data:{
      type:Array,
      default: []
    }
  },

  computed:{
    getTitle(){
      return `转${this.type}`
    },

    dialogVisible:{
      get(){
        return this.visible
      },
      set(val){
        this.$emit("update:visible", val)
      }
    }
  },

  methods:{
    async handleConfirm(){
      const key = this.type === "固定" ? "changeToFix" : "changeToKeep";

      try {
        let {status, data} = await service[key](this.data[0].id, this.getParams());

        if(status === 200){
          console.log(data);
          
          this.$emit("confirmed")
        }
        else{
          Promise.reject({ message:data.message })
        }
      } catch (err) {
        console.error(err);
      }
    },

    getParams(){
      return {
        oper: this.type === "固定" ? "tostable" : "toresv",
        data:{
          macaddress: "mac-addersses7",
          ipaddress: "1.1.2.7",
          subnetv4Id: this.subnetvId,
          hwAddress: "00:01:02:03:04:17"
        }
      }
    }
  }
}
</script>

<style>
@import "./index.less";
</style>