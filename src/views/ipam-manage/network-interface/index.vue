<template>
  <div class="netword-interface">
    <IviewLoading v-if="loading" />

    <section class="chart-wrapper">
      <div class="chart-item">
        <div class="chart-item-content">
          <div class="chart-item-title">地址类型分类</div>
        
          <div class="chart-legend">
            <div
              class="chart-legend-item"
              v-for="item in typeLegends"
              :key="item.label">
              <div class="chart-legend-item-percent">{{item.percent}}%</div>
              <div class="chart-legend-item-info">
                <div class="chart-legend-item-color" :style="{backgroundColor:item.color}"/>
                <div class="chart-legend-item-label">{{item.label}}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-container-type"/>
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
              <div class="chart-legend-item-percent">{{item.percent}}%</div>
              <div class="chart-legend-item-info is-clickable">
                <div class="chart-legend-item-color" :style="{backgroundColor:item.color}"/>
                <div class="chart-legend-item-label">{{item.label}}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-container-status"/>
      </div>
    </section>
    
    <div>
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
      tableData: [],
      columns: columns(this),
      tableTitle: "未分配地址",
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

    async getData() {
      try {
        this.loading = true;

        await Promise.all([
          this.getPieData(),
          this.getList()
        ]);
        
        this.renderTypeChart();
        this.renderStatusChart();
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
        
        typeLegends[0].percent = +assignedRatio * 100;
        typeLegends[1].percent = +unassignedRatio * 100;
        typeLegends[2].percent = +reservationRatio * 100;
        // typeLegends[3].percent = +unmanagedRatio * 100;
        
        statusLegends[0].percent = +activeRatio * 100;
        statusLegends[1].percent = +inactiveRatio * 100;
        statusLegends[2].percent = +conflictRatio * 100;
        statusLegends[3].percent = +zombieRatio * 100;

        this.typeLegends = [...typeLegends];
        this.statusLegends = [...statusLegends];
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

    handleLegendClick({ type }) {
      this.getList(type);
    },

    handleEdit(row) {
      this.$router.push({
        name: "ip-assets-manage",
        query: {
          ip: row.ip
        }
      });
    }
  }
};
</script>