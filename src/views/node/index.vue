<template>
  <div class="monitor dashboard">
    <h1>概览</h1>
    <div class="count-card-list">
      <div class="count-card-item">
        <strong>2,892,302</strong>
        <span>QPS（个）</span>
        <img
          class="count-card-item-img"
          src="../../assets/images/monitor-speed.png"
          alt=""
        >
      </div>
      <div class="count-card-item">
        <strong>2,892,302</strong>
        <span>QPS（个）</span>
        <img
          class="count-card-item-img"
          src="../../assets/images/monitor-line.png"
          alt=""
        >
      </div>
      <div class="count-card-item">
        <strong>2,892,302</strong>
        <span>QPS（个）</span>
        <img
          class="count-card-item-img"
          src="../../assets/images/monitor-time.png"
          alt=""
        >
      </div>
      <div class="count-card-item">
        <strong>2,892,302</strong>
        <span>QPS（个）</span>
        <img
          class="count-card-item-img"
          src="../../assets/images/monitor-live.png"
          alt=""
        >
      </div>
    </div>

    <section class="node-map">
      <header class="node-map-header">
        <div>
          <h3>节点分布图</h3>
          <span>点击节点即可查看该节点的详细数据信息</span>
        </div>
        <div>
          <i class="success" />
          <span>在线</span>
          <i class="error" />
          <span>离线</span>
        </div>
      </header>
      <section class="node-map-content">
        <!-- <VueDragResize>
          <div class="node-map-inner"></div>
        </VueDragResize> -->

        <div class="node-map-inner">
          <div
            class="node-map-server"
            :style="`background-image: url(${require('../../assets/images/monitor-group.png')})`"
          >
            <i class="success" />
            <ul class="">
              <li>
                controller
              </li>
              <li>
                DNS
              </li>
              <li>
                DHCP
              </li>
            </ul>
          </div>
        </div>

        <server-info />
      </section>

    </section>
  </div>
</template>

<script>
import services from "@/services";

import moment from "moment";
moment.locale("zh-cn");

import { getDeviceHistoryInfo } from "./tools";
import VueDragResize from "vue-drag-resize";

import ServerInfo from "./modules/server-info";


export default {
  components: {
    VueDragResize,
    "server-info": ServerInfo
  },
  props: {},
  data() {
    return {

    };
  },
  watch: {

  },

  mounted() {
  },

  methods: {

  }
};

</script>
<style lang="less" scoped>
@import url("./index.less");
.monitor {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 100%;
  background: #f6f6f6;
  z-index: 10;
  h1 {
    font-size: 20px;
    color: #333;
    margin-top: 20px;
    line-height: 1;
  }
}

.count-card-list {
  display: flex;
  justify-content: space-evenly;
  padding: 20px 0;

  .count-card-item {
    position: relative;
    flex: 1;
    height: 138px;
    border-radius: 4px;
    padding: 20px;
    margin: 0 10px;
    color: #fff;
    strong {
      display: block;
      font-size: 36px;
      margin-bottom: 5px;
    }
    span {
      font-size: 16px;
    }

    .count-card-item-img {
      position: absolute;
      right: 20px;
      top: 20px;
      width: 100px;
      height: 100px;
    }

    &:first-child {
      background-image: linear-gradient(180deg, #4089f0, #5aa3f2);
      margin-left: 0;
    }
    &:nth-child(2) {
      background-image: linear-gradient(180deg, #6561d9, #7361e4);
    }
    &:nth-child(3) {
      background-image: linear-gradient(180deg, #4cc96d, #66d681);
    }
    &:last-child {
      margin-right: 0;
      background-image: linear-gradient(180deg, #d8854d, #d7a153);
    }
  }
}

.node-map {
  background: #fff;
  box-shadow: 0px 0px 21px 3px rgba(120, 120, 120, 0.09);
  border-radius: 6px;
  flex: 1;
  display: flex;
  flex-direction: column;
  .node-map-header {
    display: flex;
    justify-content: space-between;
    padding: 24px;
    line-height: 1;
    border-bottom: 1px solid #f6f6f6;
    & > * {
      display: flex;
      justify-content: space-between;
    }
    h3 {
      display: inline-block;
      font-size: 18px;
      color: #333;
    }
    span {
      font-size: 14px;
      line-height: 18px;
      color: #999;
      padding-left: 8px;
    }

    i {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-top: 3px;
      margin-left: 30px;
      &.success {
        background: #4ad66c;
      }
      &.error {
        background: #f15e5e;
      }
    }
  }
  .node-map-content {
    position: relative;
    flex: 1;

    .node-map-inner {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #ddd;

      .node-map-server {
        position: relative;
        width: 300px;
        height: 104px;
        border-radius: 6px;
        background-size: cover;

        i {
          position: absolute;
          right: 24px;
          top: 18px;
          display: block;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          &.success {
            background: #3eec3d;
          }
          &.error {
            background: #f15e5e;
          }
        }

        ul {
          display: inline-flex;
          color: #fff;
          font-size: 14px;
          margin: 18px 24px;
          li {
            position: relative;

            & + li {
              margin-left: 30px;
              &::before {
                position: absolute;
                top: -3px;
                left: -20px;
                content: ".";
                font-size: 40px;
                line-height: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>