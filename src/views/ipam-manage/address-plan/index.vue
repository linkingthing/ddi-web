<template>
  <div class="plan">

    <div class="plan-content">

      <NoDataList
        :top="200"
        v-if="!planList.length && $store.getters.hasPermissionToCreate"
        button-text="新建规划"
        @add="handleAddPlan"
      />
      <table-page
        v-else
        :data="planList"
        :columns="columns"
        :total="total"
        :current.sync="current"
      >
        <template slot="top-right">

          <Button
            type="primary"
            @click="handleAddPlan"
          >新建规划</Button>

          <Button
            type="primary"
            @click="handleUploadPlan"
          >上传规划</Button>

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
    >
      <PlanTree :data="treeData" />
    </Modal>
    <common-modal
      :visible.sync="importVisible"
      :width="415"
      title="导入地址规划"
      @confirm="handleUpload"
    >
      <!-- <div class="tips-info">
        <img
          class="tips-info-icon"
          src="./icon-info.png"
          alt=""
        >
        <span>请使用为您准备的“地址规划”填写信息</span>
      </div> -->

      <div class="base-upload">

        <!-- <div class="base-upload-filename">{{file.name}}</div> -->
        <!-- <div> -->
        <Input
          style="width: 100%"
          placeholder="请输入文件路径"
          v-model="uploadParams.path"
        />

      </div>
    </common-modal>

  </div>
</template>

<script>

import { mapGetters, mapMutations } from "vuex";
import { debounce } from "lodash";

import NoDataList from "@/components/NoDataList";
import { list2Tree } from "./modules/helper";


import PlanTree from "./modules/PlanTree";


import SafeLock from "./modules/SafeLock";
import { LOCK_STATUS_ENUM } from "./modules/SafeLock/config";

import PlanModal from "./modules/PlanModal";
import { downloadFile } from "@/util/common";


export default {
  components: {
    NoDataList,
    PlanModal,
    PlanTree
  },

  data() {
    this.LOCK_STATUS_ENUM = LOCK_STATUS_ENUM;
    return {
      visible: false,
      planList: [],
      columns: [
        {
          title: "规划名称",
          key: "name",
          align: "left",
          // render: (h, { row }) => {
          //   return h("line-edit",
          //     {
          //       on: {
          //         "on-edit-finish": val => {
          //           this.handleSavePlanName(row.links.update, val, row);
          //         }
          //       },
          //       props: {
          //         isPercent: false,
          //         value: row.name
          //       }
          //     }
          //   );
          // }
        },
        {
          title: "IPv6前缀",
          key: "prefixs",
          align: "left",
          render: (h, { row }) => {
            // if (row.lockType === LOCK_STATUS_ENUM.OPEN) {
            return h("a", {
              attrs: {
                href: "javascript:;"
              },
              on: {
                click: () => {
                  const { links } = row;
                  let url = this.$getRouteByLink(links.self, "address");
                  this.$router.push({
                    path: url
                  });
                }
              }
            }, row.prefixs);
            // }
            // else {
            //   return h("div", row.prefixs);
            // }

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
          width: 330,
          render: (h, { row }) => {
            return h("div", {
              class: "table-btn-box"
            }, [
              h("btn-line", {
                nativeOn: {
                  click: () => {
                    this.handleDownloadPlan(row);
                  }
                },
                props: {
                  title: "下载规划"
                }
              }),
              h("btn-line", {
                nativeOn: {
                  click: () => {
                    this.$router.push({ name: "ipam-address-list", query: { self: row.links.self, action: "listviewv6" } });
                  }
                },
                props: {
                  title: "子网列表"
                }
              }),
              h("btn-line", {
                nativeOn: {
                  click: () => {

                    this.handleOpenMap(row);
                  }
                },

                props: {
                  title: "地图"
                }
              }),
              h("btn-line", {
                nativeOn: {
                  click: () => {

                    this.handleReportPlan(row);
                  }
                },

                props: {
                  title: "上报规划"
                }
              }),
              h("btn-line", {
                nativeOn: {
                  click: () => this.handleDelete(row)
                },
                props: {
                  title: "删除"
                }
              })
            ]);
          }
        }],
      loading: true,
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
      this.$get({ ...this.$getApiByRoute(), params }).then(({ data, links, pagination }) => {
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
      });
    },
    handleSavePlanName(url, value, row) {
      // 接口暂不支持单字段修改，但是列表中又没携带完整字段
      const params = { ...row, value };
      params.prefixs = params.prefixs.split(",");
      this.$put({ url, params }).then(() => {
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
        const { remoteaddr, semanticnode } = responsordispatch;
        const params = {
          remoteaddr,
          semanticnodes: [{ id: semanticnode }]
        };
        return this.$post({ url: `/apis/linkingthing.com/ipam/v1/plans?action=reportforward`, params });
      })
        .then(() => {
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
        content: "确定删除？",
        onOk: () => {
          this.$delete({ url: links.remove }).then(() => {
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
      this.$post({ url, params }).then(() => {
        this.$Message.success("指定成功"); // 指定csv所在路径
        this.importVisible = false;
        this.always = false;
      }).catch(err => {
        this.$Message.error(err.response.data.message);
      });
    },
    handleDownloadPlan({ links }) {
      const params = { path: "123.csv" };
      this.$post({ url: `${links.self}?action=export`, params }).then(({ path }) => {
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
</style>