<template>
  <div class="netword-interface">
    <IviewLoading v-if="loading" />

    <section class="chart-wrapper">
      <div class="chart-item">
        <div class="chart-item-content">
          <div class="chart-item-title">地址类型分类</div>
        
          <div class="chart-legend">
            <template v-for="(item, idx) in typeLegends">
              <div
                class="chart-legend-item"
                v-if="idx < 3"
                :key="item.label">
                <div 
                  class="chart-legend-item-percent" 
                  :class="{'percent-no-data': typePieNoData}"
                >
                  {{typePieNoData ? "暂无数据" : `${item.percent}%`}}
                </div>
                <div class="chart-legend-item-info">
                  <div class="chart-legend-item-color" :style="{backgroundColor:item.color}"/>
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
          <div class="chart-item-title">地址状态分类</div>
        
          <div class="chart-legend">
            <div
              @click="handleLegendClick(item)"
              class="chart-legend-item"
              v-for="item in statusLegends"
              :key="item.label">
              <div 
                class="chart-legend-item-percent" 
                :class="{'percent-no-data': statusPieNoData}"
              >
                {{statusPieNoData ? "暂无数据" : `${item.percent}%`}}
              </div>
              <div class="chart-legend-item-info is-clickable">
                <div class="chart-legend-item-color" :style="{backgroundColor:item.color}"/>
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
        :total="tableData.length"
      >
        <template slot="top-left">
          <div class="table-title">{{tableTitle}}</div>

          <div class="condition-item">
            <label class="condition-item-label">IP地址：</label>
            <Input
              v-model="condition.ipAddress"
              placeholder="请输入IP地址"
              class="top-input"
              @on-enter="getList" />
          </div>
          <div class="condition-item">
            <label class="condition-item-label">MAC：</label>
            <Input
              v-model="condition.mac"
              placeholder="请输入MAC"
              class="top-input"
              @on-enter="getList" />
          </div>

          <Button
            type="primary"
            icon="ios-search"
            @click="getList"
            class="top-button">查询</Button>
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
      condition: {
        ipAddress: "",
        mac: ""
      }
    };
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
        seriesName: "地址类型分类"
      });

      this.statusChart.dispatchAction({
        type: "pieToggleSelect",
        seriesName: "地址类型分类",
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

        this.bindPieEvent();
        this.dispatchPieAction("活跃地址");
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
          reservationRatio
        } = data;

        let typeLegends = [...this.typeLegends];
        let statusLegends = [...this.statusLegends];
        
        typeLegends[0].percent = parseFloat(parseFloat(+assignedRatio * 100).toFixed(2));
        typeLegends[1].percent = parseFloat(parseFloat(+unassignedRatio * 100).toFixed(2));
        typeLegends[2].percent = parseFloat(parseFloat(+reservationRatio * 100).toFixed(2));
        // typeLegends[3].percent = parseFloat(parseFloat(+unmanagedRatio * 100).toFixed(2));
        
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

        if (status) {
          url += `?${status}=true`;
        }

        let { data } = await this.$get({ url });

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
        { percent: percent3 }
        // { percent: percent4 }
      ] = this.typeLegends;

      this.typeChart.setOption(generatePieOption({ 
        title: "地址类型分类",
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
          }
          // {
          //   name: "未管理地址",
          //   value: percent4
          // }
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
        title: "地址类型分类",
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
      
      this.dispatchPieAction(label);
      
      this.getList(type);
    },

    async handleEdit(row) {
      try {
        let { data } = await this.$get(this.$getApiByRoute(`/address/ipam/assets?mac=${row.mac}`));
        
        let res = data[0] || {};
        
        this.$router.push({
          name: "ip-assets-manage",
          query: {
            id: res.id,
            mac: row.mac
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
        
      try {
        await this.$put({ 
          url: `/subnets/${this.$route.params.scannedsubnetsId}/reservations`, 
          params: {
            hwAddress: row.mac ? row.mac.replace(/-/g, ":") : "",
            ipAddress: row.ip
          } 
        });

        this.$$success("操作成功！");
      } catch (err) {
        this.$handleError(err);
      }
      finally {
        this.loading = false;
      }
    }
  }
};
</script>