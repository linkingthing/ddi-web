<template>
  <div class="PlanCreatePrefix">
    <Form
      :colon="true"
      :label-width="80"
      label-position="left"
      :model="formData"
      :rules="rules"
      ref="formCustom"
    >
      <FormItem
        label="规划名称"
        prop="description"
      >
        <Input
          v-model="formData.description"
          size="large"
          placeholder="请填写规划名称"
        />
      </FormItem>
      <FormItem
        label="前缀"
        prop="prefix"
      >
        <Input
          v-model="formData.prefix"
          size="large"
          placeholder="请填写前缀"
          :disabled="ableEditPrefix"
        />
      </FormItem>
      <div>
        <Button
          size="large"
          type="primary"
          long
          @click="handleClickSubmit"
        >确认</Button>
      </div>
    </Form>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { ipv6IsValid } from "@/util/common";
import { Address6 } from "ip-address";

export default {
  components: {},
  props: {},
  data() {
    this.rules = {
      description: [{
        validator: (rule, value, callback) => {
          if (value.trim().length) {
            callback();
          } else {
            callback("请输入规划名");
          }
        }
      }
      ],
      prefix: [
        {
          validator: (rule, value, callback) => {
            if (ipv6IsValid(value)) {

              const data = new Address6(value);

              const [ip, len] = value.split("/");

              const addressBinary = data.binaryZeroPad();
              const endString = addressBinary.slice(Number(len), 128);

              if (endString.includes("1")) {
                callback("请正确输入ipv6地址网段");
              } else if (+len > 60) {
                callback("prefixLen不能大于等于60");
              } else {
                callback();
              }
            } else {
              callback("请正确输入ipv6地址");
            }
          }
        }
      ]
    };
    return {
      formData: {
        prefix: "",
        description: "",
        maskLen: 64
      }
    };
  },
  computed: {
    ...mapGetters([
      "currentPlan"
    ]),
    ableEditPrefix() {
      return !!this.currentPlan.links;
    }
  },
  watch: {
    currentPlan: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          const { prefix, description, maskLen } = val;
          this.formData = {
            prefix,
            description,
            _description: description,
            maskLen: maskLen || 64
          };
          if (this.$refs.formCustom) {
            this.$refs.formCustom.resetFields();
          }
        }

      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    ...mapMutations([
      "nextPlanStep",
      "setCurrentPlanId",
      "addPlan",
      "clearTempPlan",
      "setPlanList"
    ]),
    handleClickSubmit() {
      this.$refs.formCustom.validate((valid) => {
        if (valid) {
          const params = { ...this.formData };
          if (this.currentPlan.links) {
            if (params.description === params._description) {
              this.nextPlanStep();
            } else {
              delete params._description;
              this.$put({ url: this.currentPlan.links.self, params }).then((res) => {
                this.$get(this.$getApiByRoute()).then(({ data }) => {
                  const tableData = data.map(item => {
                    item.creationTimestamp = this.$trimDate(item.creationTimestamp);
                    item.title = item.description;
                    return item;
                  });

                  this.setPlanList(tableData);
                });
                setTimeout(() => {
                  this.nextPlanStep();
                }, 400);
              });
            }
          } else {
            this.$post({ url: "/apis/linkingthing.com/ipam/v1/plans", params }).then(res => {
              this.addPlan(res);
              this.clearTempPlan();
              this.setCurrentPlanId(res.id);
              setTimeout(() => {
                this.nextPlanStep();
              }, 600);
            }).catch(err => {
              console.dir(err)
              this.$Message.error(err.response.data.message);
            });
          }
        }
      })



    }
  }
};
</script>

<style lang="less" scoped>
.PlanCreatePrefix {
  width: 310px;
}
</style>