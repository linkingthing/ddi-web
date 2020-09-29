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
                :src="require('./icon-ques-mark.png')"
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
            <Select style="width: 160px" v-model="condition.status">
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
            />
          </div>
          <div class="condition-item">
            <label class="condition-item-label">MAC：</label>
            <Input
              v-model="condition.mac"
              placeholder="请输入MAC"
              class="top-input"
              @on-enter="getList"
            />
          </div>

          <btn-search
            type="primary"
            icon="ios-search"
            @click="getList"
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
        mac: ""
      },
      unmanagedRatio: "",
      total: 0,
      current: 0
    };
  },

  computed: {
    usedRatio() {
      return ((1 - Number(this.unmanagedRatio)) * 100).toFixed(2) + "%";
    },
    notUsedRatio() {
      return (Number(this.unmanagedRatio) * 100).toFixed(2) + "%";
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
          this.getPieData(),
          this.getList("active")
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

    async getPieData() {
      try {
        const { data } = await this.$getParantData();
        const {
          activeRatio,
          assignedRatio,
          conflictRatio,
          inactiveRatio,
          unassignedRatio,
          unmanagedRatio,
          zombieRatio,
          reservationRatio,
          staticAddressRatio
        } = data;

        this.unmanagedRatio = unmanagedRatio;

        let typeLegends = [...this.typeLegends];
        let statusLegends = [...this.statusLegends];

        typeLegends[0].percent = parseFloat(parseFloat(+assignedRatio * 100).toFixed(2));
        typeLegends[1].percent = parseFloat(parseFloat(+unassignedRatio * 100).toFixed(2));
        typeLegends[2].percent = parseFloat(parseFloat(+reservationRatio * 100).toFixed(2));
        typeLegends[3].percent = parseFloat(parseFloat(+staticAddressRatio * 100).toFixed(2));

        // typeLegends[4].percent = parseFloat(parseFloat(+unmanagedRatio * 100).toFixed(2));

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

    async getList(status) {
      this.tableLoading = true;

      try {
        let url = this.$getApiByRoute().url;
        const params = {
          page_num: this.current,
          page_size: 10
        };
        if (status) {
          url += `?${status}=true`;
        }

        let { data, pagination } = await this.$get({ url, params });
        this.total = pagination.total;
        this.handleFilter(data);

      } catch (err) {
        return Promise.reject(err);
      }
      finally {
        this.tableLoading = false;
      }
    },

    handleFilter(data) {
      let { ipAddress, mac } = this.condition;

      ipAddress = ipAddress.trim();
      mac = mac.trim();

      this.tableData = data.filter(item => item.mac.indexOf(mac) >= 0 && item.ip.indexOf(ipAddress) >= 0)
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

      this.getList(type);
    },

    async handleEdit(row) {
      try {
        let { data } = await this.$get(this.$getApiByRoute(`/address/ipam/assets?mac=${row.mac}`));

        let res = data[0] || {};

        const switchName = row.switchName || res.switchName;
        const switchPort = row.switchPort || res.switchPort;
        const computerRack = row.computerRack || res.computerRack;
        const computerRoom = row.computerRoom || res.computerRoom;
        const scannedsubnetsId = this.$route.params.scannedsubnetsId;
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
            subnetId: scannedsubnetsId
          }
        });
      } catch (err) {
        this.$handleError(err);
      }
    },

    /**
     * 转固定
     */
    async handleFix(row) {
      this.loading = true;

      let url = this.$getApiByRoute(`/address/dhcp/subnets/${this.$route.params.scannedsubnetsId}/reservations`).url;

      try {
        await this.$post({
          url,
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
    handleStatic(row) {
      let url = this.$getApiByRoute(`/address/dhcp/subnets/${this.$route.params.scannedsubnetsId}/staticaddresses`).url;
      const params = {
        hwAddress: row.mac ? row.mac.replace(/-/g, ":") : "",
        ipAddress: row.ip
      };
      this.$post({ url, params }).then(() => {
        this.$$success("操作成功！");
      }).catch(err => {
        this.$Message.error(err.response.data.message);
      });
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