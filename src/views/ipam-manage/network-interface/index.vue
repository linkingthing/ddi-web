<template>
  <div class="netword-interface">
    <IviewLoading v-if="loading" />

    <section class="chart-wrapper">
      <div class="chart-item">
        <div class="chart-item-content">
          <div class="chart-item-title">已使用地址类型
            <Tooltip
              :content="`已使用地址数量占比为${usedRatio}，未使用地址数量为${notUsedRatio}`"
              placement="right"
            >
              <img
                style="width: 16px;margin-bottom: 1px;vertical-align: bottom;"
                :src="require('./icon-info.png')"
                alt=""
              >
            </Tooltip>

          </div>

          <div class="chart-legend">
            <template v-for="(item, idx) in typeLegends">
              <div
                class="chart-legend-item"
                v-if="idx < 4"
                :key="item.label"
              >
                <div
                  class="chart-legend-item-percent"
                  :class="{'percent-no-data': typePieNoData}"
                >
                  {{typePieNoData ? "--" : `${item.percent}%`}}
                </div>
                <div class="chart-legend-item-info">
                  <div
                    class="chart-legend-item-color"
                    :style="{backgroundColor:item.color}"
                  />
                  <div class="chart-legend-item-label">{{item.label}}</div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="chart-container-type" />
      </div>

      <div class="chart-item">
        <div class="chart-item-content">
          <div class="chart-item-title">地址状态
            <Tooltip
              content="针对ip地址当前状态的监控统计"
              placement="right"
            >
              <img
                style="width: 16px;margin-bottom: 1px;vertical-align: bottom;"
                :src="require('./icon-ques-mark.png')"
                alt=""
              >
            </Tooltip>

            <Button
              style="height: 26px;
                padding: 0px 10px;
                vertical-align: bottom;
                margin-bottom: -4px;
                margin-left: 8px;"
              type="primary"
              size="small"
              @click="handleDownloadCsv"
            >导出csv</Button>
          </div>

          <div class="chart-legend">
            <div
              @click="handleLegendClick(item)"
              class="chart-legend-item"
              v-for="item in statusLegends"
              :key="item.label"
            >
              <div
                class="chart-legend-item-percent"
                :class="{'percent-no-data': statusPieNoData}"
              >
                {{statusPieNoData ? "--" : `${item.percent}%`}}
              </div>
              <div class="chart-legend-item-info is-clickable">
                <div
                  class="chart-legend-item-color"
                  :style="{backgroundColor:item.color}"
                />
                <div class="chart-legend-item-label">{{item.label}}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-container-status" />
      </div>
    </section>

    <div style="position:relative">
      <IviewLoading v-if="tableLoading" />

      <table-page
        :columns="columns"
        :data="tableData"
        :total="total"
        :current.sync="current"
      >
        <template slot="top-left">
          <div class="table-title">
            <label class="condition-item-label">地址状态：</label>
            <Select
              style="width: 160px"
              clearable
              v-model="condition.ipstate"
            >
              <Option
                v-for="item in statusLegends"
                :value="item.type"
                :key="item.type"
              >
                {{item.label}}</Option>
            </Select>
          </div>

          <div class="condition-item">
            <label class="condition-item-label">IP地址：</label>
            <Input
              v-model="condition.ipAddress"
              placeholder="请输入IP地址"
              class="top-input"
              @on-enter="getList"
              clearable
            />
          </div>
          <div class="condition-item">
            <label class="condition-item-label">MAC：</label>
            <Input
              v-model="condition.mac"
              placeholder="请输入MAC"
              class="top-input"
              @on-enter="getList"
              clearable
            />
          </div>

          <btn-search
            type="primary"
            icon="ios-search"
            @click="handleClickSearch"
            class="top-button"
          >查询</btn-search>
        </template>
      </table-page>
    </div>
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import {
  columns,
  typeLegends,
  statusLegends,
  generatePieOption,
  typeColors,
  statusColors
} from "./define";
import echarts from "echarts";

export default {
  data() {
    return {
      loading: false,
      tableLoading: false,
      typeLegends,
      statusLegends,
      typeChart: null,
      statusChart: null,
      typePieNoData: false,
      statusPieNoData: false,
      tableData: [],
      columns: columns(this),
      tableTitle: "活跃地址",
      currentType: {},
      condition: {
        ipAddress: "",
        mac: "",
        ipstate: ""
      },
      unusedRatio: "",
      total: 0,
      current: 0,
      source: ""
    };
  },

  computed: {
    usedRatio() {
      if (this.source === "dhcp") {
        return ((1 - Number(this.unusedRatio)) * 100).toFixed(2) + "%";
      } else {
        return "--"
      }
    },
    notUsedRatio() {
      if (this.source === "dhcp") {
        return (Number(this.unusedRatio) * 100).toFixed(2) + "%";
      } else {
        return "--"
      }
    }

  },
  watch: {
    current() {
      this.getList();
    }
  },

  mounted() {
    this.initChart();
    this.getData();


    const { ip, ipstate } = this.$route.query;
    if (ip) {
      this.condition.ipAddress = ip;
    }
    if (ipstate) {
      this.condition.ipstate = ipstate;
    }

  },

  methods: {
    initChart() {
      this.typeChart = echarts.init(this.$el.querySelector(".chart-container-type"));
      this.statusChart = echarts.init(this.$el.querySelector(".chart-container-status"));
    },

    bindPieEvent() {
      this.statusChart.on("click", res => {
        if (this.statusPieNoData) return;

        this.handleLegendClick({
          type: this.getAttributeByArrayAndKeyValue({ array: this.statusLegends, key: "label", value: res.name, attr: "type" }),
          label: res.name
        });
      });
    },

    dispatchPieAction(name) {
      this.statusChart.dispatchAction({
        type: "pieUnSelect",
        seriesName: "已使用地址类型"
      });

      this.statusChart.dispatchAction({
        type: "pieToggleSelect",
        seriesName: "已使用地址类型",
        name
      });
    },

    async getData() {
      try {
        this.loading = true;

        await Promise.all([
          this.getPieData()
        ]);

        this.renderTypeChart();
        this.renderStatusChart();

        // this.bindPieEvent();
        // this.dispatchPieAction("活跃地址");
      } catch (err) {
        this.$handleError(err);
      }
      finally {
        this.loading = false;
      }
    },
    handleClickSearch() {
      this.$router.replace({
        query: {
          ...this.$route.query,
          ...this.condition,
          ip: this.condition.ipAddress
        }
      });

      this.getPieData();
      this.getList();
    },

    async getPieData() {
      try {
        const {
          activeRatio,
          assignedRatio,
          conflictRatio,
          inactiveRatio,
          unassignedRatio,
          unusedRatio,
          zombieRatio,
          reservationRatio,
          staticAddressRatio,
          subnet,
          source
        } = await this.$getParantData();

        this.source = source;
        this.unusedRatio = unusedRatio;
        this.subnet = subnet;

        let typeLegends = [...this.typeLegends];
        let statusLegends = [...this.statusLegends];

        typeLegends[0].percent = parseFloat(parseFloat(+assignedRatio * 100).toFixed(2));
        typeLegends[1].percent = parseFloat(parseFloat(+unassignedRatio * 100).toFixed(2));
        typeLegends[2].percent = parseFloat(parseFloat(+reservationRatio * 100).toFixed(2));
        typeLegends[3].percent = parseFloat(parseFloat(+staticAddressRatio * 100).toFixed(2));

        statusLegends[0].percent = parseFloat(parseFloat(+activeRatio * 100).toFixed(2));
        statusLegends[1].percent = parseFloat(parseFloat(+inactiveRatio * 100).toFixed(2));
        statusLegends[2].percent = parseFloat(parseFloat(+conflictRatio * 100).toFixed(2));
        statusLegends[3].percent = parseFloat(parseFloat(+zombieRatio * 100).toFixed(2));

        this.typeLegends = [...typeLegends];
        this.statusLegends = [...statusLegends];

        this.typePieNoData = typeLegends.every(({ percent }) => !parseFloat(percent));
        this.statusPieNoData = statusLegends.every(({ percent }) => !parseFloat(percent));
      } catch (err) {
        return Promise.reject(err);
      }
    },

    async getList() {
      this.tableLoading = true;

      try {
        let url = this.$getApiByRoute().url;
        let { ipAddress, mac, ipstate } = this.condition;

        let ip = ipAddress.trim();
        mac = mac.trim();

        const params = {
          page_num: this.current,
          page_size: 10,
          ip,
          mac
        };

        if (ipstate) {
          params.ipstate = ipstate;
        }

        let { data, pagination } = await this.$get({ url, params });
        this.total = pagination.total;
        this.current = pagination.pageNum || 1;
        this.handleFilter(data);

      } catch (err) {
        return Promise.reject(err);
      }
      finally {
        this.tableLoading = false;
      }
    },

    handleFilter(data) {


      this.tableData = data
        .map(item => {
          item.ipTypeText = this.getAttributeByArrayAndKeyValue({ array: this.typeLegends, key: "type", value: item.ipType, attr: "label" });
          item.ipStateText = this.getAttributeByArrayAndKeyValue({ array: this.statusLegends, key: "type", value: item.ipState, attr: "label" });
          item.expire = this.$trimDate(item.expire);

          return item;
        });
    },

    getAttributeByArrayAndKeyValue({ array, key, value, attr }) {
      let item = array.find(item => item[key] === value);

      return item ? item[attr] : "";
    },

    renderTypeChart() {
      const [
        { percent: percent1 },
        { percent: percent2 },
        { percent: percent3 },
        { percent: percent4 }

      ] = this.typeLegends;

      this.typeChart.setOption(generatePieOption({
        title: "已使用地址类型",
        color: typeColors,
        noData: this.typePieNoData,
        data: [
          {
            name: "已分配地址",
            value: percent1
          },
          {
            name: "未分配地址",
            value: percent2
          },
          {
            name: "固定地址",
            value: percent3
          },
          {
            name: "静态地址",
            value: percent4
          }
        ]
      }));
    },

    renderStatusChart() {
      const [
        { percent: percent1 },
        { percent: percent2 },
        { percent: percent3 },
        { percent: percent4 }
      ] = this.statusLegends;

      this.statusChart.setOption(generatePieOption({
        title: "已使用地址类型",
        color: statusColors,
        noData: this.statusPieNoData,
        data: [
          {
            name: "活跃地址",
            value: percent1
          },
          {
            name: "不活跃地址",
            value: percent2
          },
          {
            name: "冲突地址",
            value: percent3
          },
          {
            name: "僵尸地址",
            value: percent4
          }
        ]
      }));
    },

    handleLegendClick(item) {
      const { label, type } = item;

      this.tableTitle = label;

      // this.dispatchPieAction(label);

      this.currentType = type;

      this.condition = {
        ipstate: type,
        ipAddress: "",
        mac: ""
      };

      this.$router.replace({
        query: {
          ...this.$route.query,
          ...this.condition,
          ip: this.condition.ipAddress
        }
      });

      this.getList();
    },

    async handleEdit(row) {
      try {
        let { data } = await this.$get(this.$getApiByRoute(`/address/ipam/assets?mac=${row.mac}`));

        let res = data[0] || {};
        const switchName = row.switchName || res.switchName;
        const switchPort = row.switchPort || res.switchPort;
        const computerRack = row.computerRack || res.computerRack;
        const computerRoom = row.computerRoom || res.computerRoom;

        const ip = row.ip;
        const subnet = this.subnet;
        const vlanId = row.vlanId;


        const { uplinkPort, uplinkEquipment } = row;

        console.log(row)

        // 能查询到，进行注册操作

        if (data.length) {
          const url = `${res.links.self}?action=refresh`;
          const params = {
            computerRack,
            computerRoom,
            ip,
            subnet,
            switchName,
            switchPort,
            vlanId,
            uplinkPort,
            uplinkEquipment
          };
          this.$post({ url, params }).then(() => {
            this.$Message.success("终端登记成功");
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          });
          return;
        }


        this.$router.push({
          name: "ip-assets-manage",
          query: {
            id: res.id,
            ip: row.ip,
            vlanId: row.vlanId,
            mac: row.mac,
            switchName,
            switchPort,
            computerRack,
            computerRoom,
            subnet,
            name,
            uplinkPort,
            uplinkEquipment
          }
        });
      } catch (err) {
        this.$handleError(err);
      }
    },


    getSubnetLinks() {
      const params = {
        subnet: this.subnet
      }

      return this.$get({ ...this.$getApiByRoute(`/address/dhcp/subnets`), params }).then(({ data }) => {
        if (Array.isArray(data) && data.length) {
          const [{ links }] = data;
          return links
        } else {
          throw new Error(`未查到该子网:${this.subnet}`)
        }
      }).catch(err => {
        throw new Error(err)
      })

    },

    /**
     * 转固定
     */
    async handleFix(row) {
      this.loading = true;


      try {
        let links = await this.getSubnetLinks();

        await this.$post({
          url: links.reservations,
          params: {
            hwAddress: row.mac ? row.mac.replace(/-/g, ":") : "",
            ipAddress: row.ip
          }
        });

        this.$$success("操作成功！");

        this.getList(this.currentType);
      } catch (err) {
        this.$handleError(err);
      }
      finally {
        this.loading = false;
      }
    },
    async handleStatic(row) {
      try {
        let links = await this.getSubnetLinks();
        let url = links.staticaddresses;
        const params = {
          hwAddress: row.mac ? row.mac.replace(/-/g, ":") : "",
          ipAddress: row.ip
        };
        this.$post({ url, params }).then(() => {
          this.$$success("操作成功！");
        }).catch(err => {
          this.$Message.error(err.response.data.message);
        });
      } catch (err) {
        this.$handleError(err);
      }
      finally {
        this.loading = false;
      }
    },
    handleDownloadCsv() {
      let { url } = this.$getApiByRoute(`/address/ipam/scannedsubnets/${this.$route.params.scannedsubnetsId}`);
      this.$post({ url: `${url}?action=exportcsv` }).then(({ path }) => {
        const pathname = path.substr("/opt/website".length + 1);
        const downloadPath = `/public/${pathname}`;
        let a = document.createElement("a");
        a.download = pathname;
        a.href = downloadPath;
        a.click();
      });
    }
  }
};
</script>

<style lang="less">
.chart-wrapper {
  .ivu-tooltip-inner {
    max-width: none;
    min-height: 30px;
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>