<template>
  <ModalCustom 
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="560"
    @confirm="handleConfirm"
  >
    <div class="address-pool-info">
      <div class="info-row">
        <div class="info-row-label">类型</div>
        <Select v-model="type">
          <Option v-for="item in types" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="info-row">
        <div class="info-row-label">开始地址</div>
        <Input v-model="startAddress" placeholder="请输入开始名称" class="info-row-input" />
      </div>
      <div class="info-row">
        <div class="info-row-label">结束地址</div>
        <Input v-model="endAddress" placeholder="请输入结束地址" class="info-row-input" />
      </div>
      <div class="info-row">
        <div class="info-row-label">默认租赁时间</div>
        <Input v-model="defaultRentTime" class="info-row-input" />
        <label>秒</label>
      </div>
      <div class="info-row">
        <div class="info-row-label">最大租赁时间</div>
        <Input v-model="maxRentTime" class="info-row-input" />
        <label>秒</label>
      </div>
    </div>
  </ModalCustom>
</template>

<script>
import ModalCustom from "@/components/ModalCustom";
import service from "@/services";

const types = [
  {
    label:"ipv4",
    value:"ipv4"
  },
  {
    label:"ipv6",
    value:"ipv6"
  }
]

export default {
  components:{
    ModalCustom
  },

  props:{
    visible:{
      type: Boolean,
      default: false
    },

    subnetId:{
      type: String,
      default: null
    },

    data:{
      type:Object,
      default: ()=> ({})
    }
  },

  data(){
    return {
      dialogVisible:false,
      types,
      type:"",
      startAddress:"",
      endAddress:"",
      defaultRentTime:"",
      maxRentTime:"",
      isEdit:false
    }
  },

  computed:{
    getTitle(){
      return (this.isEdit ? "编辑" : "添加") + "地址池";
    }
  },

  watch:{
    visible(val){
      if(!val) return;
      
      this.dialogVisible = val;
    },

    data(val){
      this.isEdit = !!val;

      this.setValue(val);
    },

    dialogVisible(val){
      if(!val){        
        this.setValue();
      }

      this.$emit("update:visible", val)
    }
  },

  methods:{
    setValue(val = {}){
        this.poolId = val.id || null;
        this.type = val.type || "ipv4";
        this.startAddress = val.startAddress || "";
        this.endAddress = val.endAddress || "";
        this.defaultRentTime = val.defaultRentTime || "";
        this.maxRentTime = val.maxRentTime || "";
    },

    async handleConfirm(){
      const key = this.type === "ipv4" ? "saveIpv4AddressPool" : "saveIpv4AddressPool";

      try {
        let res = await service[key](this.getParams());
      } catch (err) {
        
      }
    },

    getParams(){
      return {
        subnetId:this.subnetId,
        poolId: this.poolId,
        params:{
          beginAddress:this.startAddress,
          endAddress:this.endAddress,
          validLifetime:this.defaultRentTime,
          maxValidLifetime: this.maxRentTime
        }
      }
    }
  }
}
</script>

<style lang="less">
@import "./index.less";
</style>