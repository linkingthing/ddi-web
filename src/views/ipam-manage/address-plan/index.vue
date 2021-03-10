<template>
  <div class="plan">
    <div class="plan-content">

      <NoDataList
        :top="200"
        v-if="!planList.length && $hasPermissionCreate('plan')"
        button-text="新建规划"
        @add="handleAddPlan"
      />
      <table-page
        v-else
        :loading="loadingPage"
        :data="planList"
        :columns="columns"
        :total="total"
        :current.sync="current"
      >
        <template slot="top-right">
          <Button
            type="primary"
            @click="handleUploadPlan"
          >导入规划表格</Button>

          <Button
            type="primary"
            @click="handleDownloadTemplate"
            style="margin: 0 20px"
          >下载模板</Button>

          <Button
            type="primary"
            @click="handleAddPlan"
          >新建规划</Button>

        </template>
      </table-page>

    </div>

    <PlanModal
      :visible.sync="visible"
      :links="paramsLinks"
      @success="getPlanList"
    />

    <Modal
      v-model="mapVisible"
      fullscreen
      :title="mapTitle"
      class="mapModal"
      footer-hide
    >
      <PlanTree :data="treeData" />
    </Modal>
    <common-modal
      :visible.sync="importVisible"
      :width="415"
      title="导入地址规划"
      @confirm="handleUpload"
      :loading="loading"
    >
      <div class="tips-info">
        <img
          class="tips-info-icon"
          src="./icon-info.png"
          alt=""
        >
        <span>请使用为您准备的“规划表格模板”填写终端信息</span>
      </div>

      <div class="base-upload">
        <div class="base-upload-filename">{{file.name}}</div>
        <div>

          <Upload
            ref="upload"
            action="/uploadfile"
            :headers="headers"
            :on-success="uploadSuccess"
            :show-upload-list="false"
            name="path"
          >
            <Button size="small">
              <img
                src="./icon-file.png"
                alt=""
                style="vertical-align: bottom;margin-right: 6px;"
              >浏览文件</Button>
          </Upload>
        </div>
      </div>
    </common-modal>

  </div>
</template>

<script>

import NoDataList from "@/components/NoDataList";
import { list2Tree } from "./modules/helper";


import PlanTree from "./modules/PlanTree";
import SemanticTree from "./modules/SemanticTree";

import { LOCK_STATUS_ENUM } from "./modules/SafeLock/config";

import PlanModal from "./modules/PlanModal";
import { downloadFile } from "@/util/common";


export default {
  components: {
    NoDataList,
    PlanModal,
    PlanTree,
    SemanticTree
  },

  data() {
    this.LOCK_STATUS_ENUM = LOCK_STATUS_ENUM;
    this.headers = {
      Authorization: this.$store.getters.token
    };
    return {
      visible: false,
      planList: [{}],
      loadingPage: false,
      columns: [
        {
          title: "规划名称",
          key: "name",
          align: "left",

          render: (h, { row }) => {
            return h("line-edit",
              {
                on: {
                  "on-edit-finish": val => {
                    this.handleSavePlanName(row.links.update, val, row);
                  }
                },
                props: {
                  isPercent: false,
                  value: row.name,
                  checkfunc: (val) => this.checkfunc(val, row)
                }
              }
            );
          }
        },
        {
          title: "IPv6前缀",
          key: "prefixes",
          align: "left",
          render: (h, { row }) => {
            return h("span", {
              attrs: {
                href: "javascript:;"
              },
              // on: {
              //   click: () => {
              //     const { links } = row;
              //     let url = this.$getRouteByLink(links.self, "address");
              //     this.$router.push({
              //       path: url
              //     });
              //   }
              // }
            }, row.prefixes);
          }
        },
        // {
        //   title: "安全锁",
        //   key: "name",
        //   align: "left",
        //   render: (h, { row }) => {
        //     return h(SafeLock, {
        //       props: {
        //         type: row.lockType,
        //         message: row.lockedby
        //       },
        //       nativeOn: {
        //         click: () => this.handleToggleLock(row, row.isLock)
        //       }
        //     });
        //   }
        // },
        {
          title: "操作",
          key: "name",
          width: 200,
          // width: 300,
          render: (h, { row }) => {
            return h("div", {
              class: "table-btn-box"
            }, [
              h("btn-line", {
                props: {
                  title: "导出"
                },
                nativeOn: {
                  click: () => this.handleDownloadPlan(row)
                }
              }),

              h("btn-line", {
                nativeOn: {
                  click: () => {
                    const { links } = row;
                    let url = this.$getRouteByLink(links.self, "address");
                    this.$router.push({
                      path: url
                    });
                  }
                },
                props: {
                  title: "规划"
                }
              }),

              h("btn-del", {
                on: {
                  click: () => this.handleDelete(row)
                },
                props: {
                  title: "删除",
                  disabled: !!row.responsordispatch

                }
              })
            ]);
          }
        }],
      loading: false,
      netnodesurl: "",
      oneLayoutLinks: null,

      links: {},
      paramsLinks: {},

      mapVisible: false,
      mapTitle: "",
      treeData: [],

      importVisible: false,
      uploadParams: {
        path: ""
      },
      file: { path: "" },

      total: 0,
      current: 0
    };
  },

  computed: {
    showPlanList() {
      return !!this.planList.length;
    }
  },

  watch: {
    current() {
      this.getPlanList();
    }

  },

  methods: {

    getPlanList() {
      const params = {
        page_num: this.current,
        page_size: 10
      };
      this.loadingPage = true;
      this.$get({ url: "/apis/linkingthing.com/ipam/v1/plans", params }).then(({ data, links, pagination }) => {
        this.current = pagination.pageNum;
        this.total = pagination.total;
        const { user } = this.$store.getters.userInfo;
        const tableData = data.map(item => {
          item.creationTimestamp = this.$trimDate(item.creationTimestamp);
          item.title = item.description;
          item.isLock = !!item.lockedby;

          if (typeof item.lockedby === "string") {
            if (item.lockedby === user) {
              item.lockType = LOCK_STATUS_ENUM.OPEN;
            } else {
              item.lockType = LOCK_STATUS_ENUM.DISABLED;
            }
          } else {
            item.lockType = LOCK_STATUS_ENUM.CLOSE;
          }

          item.prefixs = item.prefixs && item.prefixs.join(",");
          return item;
        });
        this.planList = tableData;
        this.links = links;

      }).catch((err) => {
        this.$handleError(err);
      }).finally(() => this.loadingPage = false);
    },

    uploadSuccess(response, file) {
      this.uploadParams = { name: response.filename };
      this.file = file;
    },
    checkfunc(value) {
      if (value.trim().length > 36) {
        return { isValid: false, message: "规划名不能超过36字符" };
      }
      if (value.trim().length === 0) {
        return { isValid: false, message: "规划名不能为空" };
      }

      return { isValid: true };
    },
    handleSavePlanName(url, value, row) {
      const params = { name: value, id: row.id };
      const action = `${url}?action=updateplaninfo`;
      this.$post({ url: action, params }).then(() => {
        this.$Message.success("更新成功");
        this.getPlanList();
      }).catch(err => {
        this.$Message.error(err.response.data.message);
      });
    },
    handleToggleLock({ links }, lock) {
      const action = lock ? "releaselock" : "requirelock";
      const url = `${links.self}?action=${action}`;
      this.$post({ url }).then(() => {
        this.$Message.success("操作成功");
        this.getPlanList();
      }).catch(err => {
        this.$Message.error(err.data.message);
      });
    },

    handleOpenMap({ name, links }) {
      this.mapVisible = true;
      this.mapTitle = name;
      this.getMapData(links.self);
    },

    handleReportPlan({ links }) {

      this.getMapData(links.self).then(({ responsordispatch, semanticnodes }) => {
        if (responsordispatch) {
          const { remoteaddr, semanticnode } = responsordispatch;
          const params = {
            remoteaddr,
            semanticnodes: [{ id: semanticnode }]
          };
          return this.$post({ url: `/apis/linkingthing.com/ipam/v1/plans?action=reportforward`, params });
        } else {

          this.$Message.error("不能上报");
        }

      })
        .then(() => {
          this.$Message.success("上报成功");
          this.getPlanList();
        }).catch(err => {
          this.$Message.error(err.response.data.message);
        });
    },

    getMapData(url) {
      return this.$get({ url }).then((res) => {
        const { responsordispatch, semanticnodes } = res;
        const treeData = list2Tree(semanticnodes, "0");
        this.treeData = treeData;
        return res;
      });
    },
    handleDelete({ links }) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？\n<br /> <span style='font-size:12px'>没有子语义节点时才能删除成功</span>",
        onOk: () => {
          this.$delete({ url: links.remove }).then(() => {
            this.$Message.success("删除成功");
            this.getPlanList();
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          });
        }
      });

    },

    handleAddPlan() {
      this.paramsLinks = this.links;
      this.visible = true;
    },
    handleUploadPlan() {
      this.importVisible = true;
    },
    handleUpload() {
      const url = `${this.links.self}?action=import`;
      const params = this.uploadParams;
      this.loading = true;
      this.$post({ url, params }).then(() => {
        this.$Message.success("导入成功");
        this.importVisible = false;
        this.always = false;
        this.getPlanList();
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        this.$Message.error(err.response.data.message);
      });
    },
    handleDownloadTemplate() {
      const url = `${this.links.self}?action=exportcsvtemplate`;
      this.$post({ url }).then(({ path }) => {
        downloadFile(path);
      });
    },
    handleDownloadPlan({ links }) {
      this.$post({ url: `${links.self}?action=exportcsv` }).then(({ path }) => {
        downloadFile(path);
      });
    }
  }
};
</script>

<style lang="less">
.plan {
}
.plan-content {
}

.mapModal {
  .ivu-modal-header {
    background: #f1f1f1;
  }
  .ivu-modal-body {
    background-image: url("./box-bg.png");
  }
}
</style>