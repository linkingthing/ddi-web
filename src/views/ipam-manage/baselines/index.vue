<template>
  <div class="baselines">
    <div class="search-box">
      <Input
        v-model="search"
        style="width: 300px"
        placeholder="请输入IP检索"
      />
      <Button
        type="primary"
        @click="getData"
      >搜索</Button>
      <Button
        style="margin-left: 16px"
        type="primary"
        @click="handleClickOpenCreate"
      >新建</Button>
    </div>
    <table-page
      :loading="loading"
      :data="dataList"
      :columns="columns"
      :total="total"
      :current.sync="current"
    />

    <common-modal
      :visible.sync="visible"
      :width="413"
      title="新建基线"
      @confirm="handleSave"
      :closable="true"
    >
      <Form
        ref="form"
        label-position="left"
        :label-width="85"
        :label-colon="true"
        :rules="rules"
        :model="formModel"
      >
        <common-form
          :form-model="formModel"
          :form-item-list="formItemList"
        />

      </Form>

    </common-modal>
  </div>
</template>

<script>
import { ipTypeMap } from "../network-interface/define";
import { macAddressIsValid, isIp } from "@/util/common";

export default {
  components: {},
  props: {},
  data() {
    this.rules = {
      ip: [
        { required: true, message: "请填IP地址" },
        {
          validator: (rule, value, callback) => {
            if (isIp(value.trim())) {
              callback()
            } else {
              callback("请输入正确IP地址")
            }
          }
        }
      ],
      mac: [
        { required: true, message: "请填MAC地址" },
        {
          validator: function (rule, value, callback) {
            if (macAddressIsValid(value)) {
              callback();
            } else {
              callback("请正确填写MAC地址");
            }
          }
        }
      ],
      ipType: [
        { required: true, message: "请选择IP类型" },
      ],
      uplinkEquipment: [
        { required: true, message: "请填上联设备" },
      ],
      uplinkPort: [
        { required: true, message: "请填上联设备端口" },
      ]
    };
    this.formItemList = [{
      label: "IP地址",
      model: "ip",
      type: "input",
      placeholder: "请填IP地址"
    }, {
      label: "MAC地址",
      model: "mac",
      type: "input",
      placeholder: "请填MAC地址"
    }, {
      label: "地址类型",
      model: "ipType",
      type: "select",
      children: [{
        label: "static",
        text: "静态地址"
      }, {
        label: "reservation",
        text: "固定地址"
      }],
      placeholder: "请填地址类型"
    }, {
      label: "上联设备",
      model: "uplinkEquipment",
      type: "input",
      placeholder: "请填上联设备"
    }, {
      label: "端口",
      model: "uplinkPort",
      type: "input",
      placeholder: "请填端口"
    }];

    return {
      loading: false,
      dataList: [],
      total: 0,
      search: "",
      columns: [{
        title: "IP地址",
        key: "ip",
      }, {
        title: "MAC地址",
        key: "mac",
      }, {
        title: "地址类型",
        key: "ipType",
        render: (h, { row }) => {
          return h("div", ipTypeMap[row.ipType].label)
        }
      }, {
        title: "上联设备",
        key: "uplinkEquipment",
      }, {
        title: "端口",
        key: "uplinkPort",
      }, {
        title: "创建时间",
        key: "creationTimestamp",
        render: (h, { row }) => {
          return h("div", this.$trimDate(row.creationTimestamp))
        }
      }, {
        title: "操作",
        key: "action",
        width: 100,
        render: (h, { row }) => {
          return h("btn-del", {
            on: {
              click: () => this.handleDelete(row)
            }
          })
        }
      }],
      current: 0,

      visible: false,
      formModel: {
        ip: "",
        mac: "",
        uplinkEquipment: "",
        uplinkPort: "",
      },

    };
  },
  computed: {},
  watch: {},
  created() {
    this.getData();
  },
  mounted() { },
  methods: {
    getData() {
      const { version } = this.$route.query;
      const params = {
        page_num: this.current,
        page_size: 10,
        version
      };
      this.loading = true;
      if (this.search !== "") {
        params.ip = this.search.trim();
      }
      this.$get({
        url: "/apis/linkingthing.com/ipam/v1/ipbaselines",
        params
      }).then(({ data, pagination }) => {
        this.dataList = data;
        this.current = pagination.pageNum;
        this.total = pagination.total;
      }).finally(() => this.loading = false);
    },
    handleDelete({ links }) {
      this.$Modal.confirm({
        title: "删除提示",
        content: "请再次确认是否删除该记录？",
        onOk: () => {
          this.$delete({
            url: links.remove
          })
            .then(() => {
              this.$Message.success("删除成功");
              this.getData();
            })
            .catch(err => {
              this.$Message.error(err.response.data.message);
            });
        }
      });
    },

    handleClickOpenCreate() {
      this.visible = true;
    },
    handleSave() {
      const params = { ...this.formModel };
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$post({ url: "/apis/linkingthing.com/ipam/v1/ipbaselines", params }).then(() => {
            this.$Message.success("新建成功");
            this.getData();
          }).catch(err => {
            this.$Message.error(err.response.data.message)
          })

        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.baselines {
  position: relative;
}
.search-box {
  position: absolute;
  z-index: 101;
  right: 10px;
  top: 14px;
}
</style>