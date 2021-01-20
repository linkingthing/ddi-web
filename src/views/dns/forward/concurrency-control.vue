<template>
  <div>
    <div class="forward-safe">
      <img
        :src="require('@/assets/images/safe.png')"
        alt=""
      >
      <br>
      <i-form
        class="forwad-form"
        :label-width="130"
        :model="formItem"
        label-position="left"
      >

        <form-item
          label="递归并发数"
          prop="recursiveclients"
          style="font-size:20px;"
        >
          <InputNumber
            v-model="formItem.recursiveclients"
            :max="150000"
            style="width:300px;"
          />
          <span>pps</span>

        </form-item>
        <!-- <form-item
          label="单一域递归并发数"
          prop="fetchesperzone"
          style="font-size:20px;"
        >
          <InputNumber
            v-model="formItem.fetchesperzone"
            style="width:300px;"
            :max="50000"
          />
          <span>pps</span>

        </form-item> -->

        <div>
          <i-button
            type="primary"
            @click="primary"
          >保存</i-button>
        </div>
      </i-form>
    </div>
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "developmentcontrol",
  data() {
    return {
      formItem: {
        recursiveclients: null,
        fetchesperzone: null
      }
    };
  },
  mounted() {
    this.getView();
  },
  methods: {
    getView() {
      services
        .getRecursiveConcurrents()
        .then(({ data }) => {
          const result = data;
          if (Array.isArray(result) && result.length > 0) {
            this.formItem = result[0];
          }
        })
        .catch(err => {
          this.$Message.error(err.message);
        });
    },
    // 保存
    primary() {
      services
        .saveRecursiveConcurrents(this.formItem)
        .then(() => {
          this.$Message.success("保存成功");
          this.getView();
        })
        .catch((err) => {
          this.$Message.error(err.message);
        });
    }
  }
};
</script>

<style scoped lang="less">
.forward-safe {
  padding-top: 130px;
  text-align: center;
  img {
    width: 412px;
    margin-bottom: 40px;
  }
  .forwad-form {
    display: inline-block;
    width: 500px;
    span {
      color: #333;
      padding-left: 10px;
    }
    .ivu-btn {
      width: 100px;
    }
  }
}
</style>
