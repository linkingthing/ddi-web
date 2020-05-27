<template>
  <div class="netword-interface">
    <IviewLoading v-if="loading" />

    <section class="chart-wrapper">
      <div class="chart-item">
        <div class="chart-item-content">
          <div class="chart-item-title">地址类型分类</div>
        
          <div class="chart-legend">
            <div
              @click="handleLegendClick(item, 'type')"
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
              @click="handleLegendClick(item, 'status')"
              class="chart-legend-item"
              v-for="item in statusLegends"
              :key="item.label">
              <div class="chart-legend-item-percent">{{item.percent}}%</div>
              <div class="chart-legend-item-info">
                <div class="chart-legend-item-color" :style="{backgroundColor:item.color}"/>
                <div class="chart-legend-item-label">{{item.label}}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-container-status"/>
      </div>
    </section>
    
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
            @on-enter="handleQuery" />
        </div>
        <div class="condition-item">
          <label class="condition-item-label">MAC：</label>
          <Input
            v-model="condition.mac"
            placeholder="请输入MAC"
            class="top-input"
            @on-enter="handleQuery" />
        </div>

        <Button
          type="primary"
          icon="ios-search"
          @click="handleQuery"
          class="top-button">查询</Button>
      </template>
    </table-page>
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
      typeLegends,
      statusLegends,
      typeChart: null,
      statusChart: null,
      tableData: [],
      columns: columns(this),
      tableTitle: "未分配地址",
      condition: {
        ipAddress: "",
        hostName: "",
        mac: ""
      }
    };
  },

  mounted() {
    this.initChart();
    this.handleQuery();    
  },

  methods: {
    initChart() {
      this.typeChart = echarts.init(this.$el.querySelector(".chart-container-type"));
      this.statusChart = echarts.init(this.$el.querySelector(".chart-container-status"));
    },

    handleQuery() {
      this.renderTypeChart();
      this.renderStatusChart();
    },

    renderTypeChart() {
      this.typeChart.setOption(generatePieOption({ 
        title: "地址类型分类",
        color: typeColors,
        data: [
          {
            name: "已分配地址",
            value: 25535
          },
          {
            name: "未分配地址",
            value: 2356
          },
          {
            name: "固定地址",
            value: 12563
          },
          {
            name: "未管理地址",
            value: 1677
          }
        ]
      }));
    },

    renderStatusChart() {
      this.statusChart.setOption(generatePieOption({ 
        title: "地址类型分类",
        color: statusColors,
        data: [
          {
            name: "活跃地址",
            value: 25535
          },
          {
            name: "冲突地址",
            value: 2356
          },
          {
            name: "僵尸地址",
            value: 1256
          }
        ]
      }));
    },

    handleLegendClick(item, type) {
      
    },

    handleEdit(row) {
      
    }
  }
};
</script>