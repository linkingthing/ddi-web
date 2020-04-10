<template>
  <ModalCustom 
    :visible.sync="dialogVisible"
    :title="getTitle"
    @confirm="handleConfirm"
  >
    <div class="child-net-info">
      <template v-if="type === operateTypes.split">
        <div class="info-row">
          <div class="info-row-label">IP地址</div>
          <div class="info-row-label">{{ipAddress}}</div>
        </div>
        <div class="info-row">
          <div class="info-row-label">子网掩码</div>
          <Input v-model="subnetMask" placeholder="请输入子网掩码" class="info-row-input" />
        </div>
      </template>
      <div v-else class="info-row-label">{{allIps}}</div>
    </div>
  </ModalCustom>
</template>

<script>
import ModalCustom from "@/components/ModalCustom";
import service from "@/services";

import { operateTypes } from "./../define";
import { isPosNumber } from "@/util/common"

export default {
  components:{
    ModalCustom
  },

  props:{
    visible:{
      type: Boolean,
      default: false
    },

    data:{
      type:Array,
      default: () => []
    },

    type:{
      type:String,
      default:operateTypes.merge
    }
  },

  data(){
    return {
      dialogVisible:false,
      ipAddress:"",
      currentMask:"",
      subnetMask:"",
      operateTypes,
      allIps:""
    }
  },

  computed:{
    getTitle(){
      return "子网" + (this.type === operateTypes.merge ? "合并" : "拆分");
    }
  },

  watch:{
    visible(val){
      if(!val) return;
      
      this.dialogVisible = val;
    },

    data(val){      
      if(!val.length) return;

      this.ipAddress = val[0].subnet;
      this.allIps = val.map(item => item.subnet).join("，");

      const ip = this.ipAddress;

      this.currentMask = parseInt(ip.substr(ip.lastIndexOf("/") + 1));
    },

    dialogVisible(val){
      this.$emit("update:visible", val)
    }
  },

  methods:{
    async handleConfirm(){
      const action = this.type === operateTypes.merge ? "mergeChildNet" : "splitChildNet";

      try {
        await this.validate();

        let res = await service[action](this.getParams(), this.data[0].embedded.id);

        console.log(res);
        
      } catch (err) {
        console.error(err);
        
        this.$$error(err.message || "操作失败！");

        return Promise.reject();
      }
    },

    getParams(){
      let res = {
        oper: this.type
      };

      // 合并
      if(this.type === operateTypes.merge){
        res.ips = this.data.map(item => subnet).join(",")
      }
      // 拆分
      else{
        res.mask = this.subnetMask;
      }

      return res;
    },

    validate(){
      const mask = parseInt(this.subnetMask);
      
      if(!isPosNumber(mask) || mask > 32){
        return Promise.reject({ message:"请输入正确的掩码！" })
      }

      if(mask <= this.currentMask){
        return Promise.reject({ message:"输入的掩码必须大于原掩码！" })
      }

      return Promise.resolve();
    }
  }
}
</script>

<style>

</style>