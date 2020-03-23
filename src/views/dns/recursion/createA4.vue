<template>
  <common-modal :visible.sync="restrictModal" title="新建A4合成地址列表" @confirm="handleSubmit">
    <i-form
      :model="params"
      label-position="right"
      :label-width="500"
      :rules="ruleValidate"
      ref="formValidate"
    >
      <div class="pop-content">
        <div class="pop-box">
          <div class="pop-body" style="padding-bottom:0">
            <form-item label="前缀" :label-width="110" prop="prefix" style="margin-bottom: 48px">
              <i-input v-model="params.prefix" placeholder="请填写前缀"></i-input>
            </form-item>
            <form-item
              label="客户IP地址"
              prop="clientacl"
              :label-width="110"
              style="margin-bottom: 48px"
            >
              <i-select v-model="params.clientacl">
                <i-option v-for="item in list" :key="item.id" :value="item.id">{{item.name}}</i-option>
              </i-select>
            </form-item>

            <form-item label="目标IPv4地址" prop="aaddress" :label-width="110">
              <i-select v-model="params.aaddress">
                <i-option v-for="item in list" :key="item.id" :value="item.id">{{item.name}}</i-option>
              </i-select>
            </form-item>
          </div>
        </div>
      </div>
    </i-form>
  </common-modal>
</template>

<script>
import services from "@/services";
import { prefixValidate } from "@/util/common";
export default {
  name: "createA4",
  data() {
    return {
      // 是否显示mode
      restrictModal: false,
      list: [],
      viewId: "",
      // 表单数据
      params: {
        prefix: "",
        clientacl: "",
        aaddress: ""
      },
      // 表单验证规则
      ruleValidate: {
        prefix: [
          { required: true, message: "请填正确的地址前缀" },
          prefixValidate,
          {
            validator: function(rule, value, callback) {
              const endNumReg = /[\d]{2}$/;
              const [number] = value.match(endNumReg);
              const max = Math.floor(number / 16); // 最多组数
              const groupStr = value.substring(0, value.length - 5);
              const unitArr = groupStr.split(":");

              if (unitArr.length > max) {
                callback(`填写错误，ip单元数不能大于${max}`);
              }

              unitArr.every((unit, index) => {
                if (!/^[0-9a-fA-F]{1,4}$/.test(unit)) {
                  callback(`填写错误，第${index + 1}单元不符合4位16进制要求`);
                }
                return /^[0-9a-fA-F]{1,4}$/.test(unit);
              });

              callback();
            }
          }
        ],
        clientacl: [{ required: true, message: "请选择客户IP地址" }],
        aaddress: [{ required: true, message: "请选择目标IPv4地址" }]
      }
    };
  },
  mounted() {
    this.getChoose();
  },
  methods: {
    openConfig(viewId) {
      this.viewId = viewId;
      this.restrictModal = true;
    },
    getChoose() {
      services
        .getAccessList()
        .then(res => {
          this.list = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    update() {
      services
        .createDNS64(this.viewId, this.params)
        .then(res => {
          this.restrictModal = false;
          this.$emit("onCreateSuccess");
          this.$Message.success("新建成功!");
        })
        .catch(err => {
          this.$Message.error("新建失败");
        });
    },
    // 应用
    handleSubmit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.update();
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
