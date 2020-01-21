<template>
  <modal
    v-model="blacklistModal"
    class-name="pop vertical-center-modal"
    :mask-closable="false"
    width="500"
    :closable="false"
  >
    <div slot="header">新建访问控制列表</div>
    <div>
      <vue-scroll style="height: 500px;" ref="vs">
        <i-form :model="dataConfig" label-position="right" :label-width="80" ref="formValidate">
          <div class="pop-content">
            <div class="pop-box">
              <div class="pop-body">
                <form-item label="新建访问控制列表" prop="name" :label-width="137">
                  <!-- <i-select v-model="dataConfig.id">
                    <i-option v-for="item in select" :key="item.id" :value="item.id">{{item.name}}</i-option>
                  </i-select> -->

                  <!-- <Select v-model="dataConfig.id">
                    <Option v-for="item in select" :key="item.id" :value="item.id">{{item.name}}</Option>
                  </Select> -->
                </form-item>
              </div>
            </div>
          </div>
        </i-form>
      </vue-scroll>
    </div>
    <div slot="footer">
      <i-button class="me-button k-btn" @click="blacklistModal = false">取消</i-button>
      <i-button type="primary" class="me-button add-btn" @click="handleSubmit">确定</i-button>
    </div>
  </modal>
</template>

<script>
import { isURL, isNumber, isEmpty } from "../util/common";
import services from '@/services';

export default {
  name: "BlacklistConfig",
  data() {
    return {
      blacklistModal: false,
      self: "",
      id: "",
      select: [],
      aclid: "",
      // 表单数据
      dataConfig: {
        name: ""
      },
      loading: false
    };
  },
  mounted() {
    this.getSelct();
  },
  methods: {
    openModel() {
      this.blacklistModal = true;
    },
    getSelct() {
      services
        .getAccessList()
        .then(res => {
          this.select = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //新建
    update() {
      this.$axios
        .post(
          "http://10.0.0.19:8081/apis/linkingthing.com/example/v1/ipblackholes",
          {
            aclid: this.dataConfig.id
          }
        )
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 确定
    handleSubmit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.update();
          this.$Message.success("新建成功!");
          this.cancelModel();
        } else {
          this.$Message.error("新建失败!");
        }
      });
    },
    //关闭弹窗
    cancelModel() {
      this.deviceModal = false;
      this.$refs.formValidate.resetFields();
    }
  }
};
</script>

<style scoped>
.ivu-divider-dashed {
  /* background: 0 0; */
  border-top: 0px dashed #e8eaec;
}

.ivu-col-span-4 > .ivu-btn {
  padding: 0px 0px;
  border: 0px solid transparent;
  margin-left: 100px;
  color: #4796ff;
}
</style>