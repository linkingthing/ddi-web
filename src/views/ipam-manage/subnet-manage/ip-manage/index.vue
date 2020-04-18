<template>
  <div class="child-net-ip-manage">
    <IviewLoading v-if="loading" />

    <div class="ip-manage-title">IP管理</div>

    <div class="ip-manage-top">
      <Tabs v-if="!isIPv6" v-model="tab">
        <TabPane label="图形" name="chart"/>
        <TabPane label="列表" name="table"/>
      </Tabs>

      <div>
        <Button 
          type="primary" 
          @click="handleSearch" 
          class="top-button button-search"
        >
          网络探测
        </Button>
        <Button 
          type="primary" 
          @click="handleToAddressPool" 
          class="top-button button-config"
        >
          地址池配置
        </Button>
        <Button 
          type="primary" 
          @click="handleFixAndKeep('固定')" 
          class="top-button button-fix"
        >
          转固定
        </Button>
        <Button 
          type="primary" 
          @click="handleFixAndKeep('保留')" 
          class="top-button button-keep"
        >
          转保留
        </Button>
      </div>
    </div>

    <div>
      <Table 
        v-show="tab === 'table'"
        :data="tableData"
        :columns="columns" 
        :max-height="540"
        @on-selection-change="handleTableSelect"
      /> 
    </div>

    <TableChart 
      v-if="!isIPv6"
      v-show="tab === 'chart'"
      :data="tableData"
      @on-selection-change="handleTableSelect"
    />

    <FixOrKeep 
      :visible.sync="showFixOrKeep"
      :data="selectedData"
      :type="typeofFixOrKeep"
      :subnet-id="subnetId"
      @confirmed="handleFixedOrKept"
    />

    <ConfigAttribute 
      :visible.sync="showConfig"
      :data="editData"
      @confirmed="handleConfiged"
    />

    <Edit 
      :visible.sync="showEdit"
      :data="editData"
      @confirmed="handleSaved"
    />

    <Search 
      :visible.sync="showSearch"
      :data="selectedData"
      :subnet-id="subnetId"
      @confirmed="handleSearched"
    />
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import TableChart from "./table-chart";
import FixOrKeep from "./fix-or-keep";
import Search from "./search";
import ConfigAttribute from "./config-attribute";
import Edit from "./edit";
import service from "@/services";

import { columns } from "./define";
import { legendList } from "./table-chart/define";
import { getAddressType, formatDate } from "@/util/common";

export default {
  components: {
    TableChart,
    FixOrKeep,
    Search,
    ConfigAttribute,
    Edit
  },

  data() {
    return {
      loading: false,
      subnetId: "",
      ipAddress: "",
      tableData: [],
      columns: columns(this),
      tab: "chart",
      selectedData: [],
      showSearch: false,
      showFixOrKeep: false,
      showConfig: false,
      showEdit: false,
      typeofFixOrKeep: "",
      isIPv6: false,
      editData: null
    };
  },

  created() {
    let { subnetId, addr } = this.$route.query;

    this.subnetId = subnetId;
    this.ipAddress = addr;

    this.isIPv6 = getAddressType(addr) === this.$ipTypes.ipv6;

    if (this.isIPv6) {
      this.tab = "table";
    }
  },

  mounted() {
    this.handleQuery();    
  },

  methods: {
    getIpLastNum(ip) {
      return parseInt(ip.substr(ip.lastIndexOf(".") + 1));
    },

    async handleQuery() {
      this.selectedData = [];

      this.loading = true;

      try {        
        let res = await service.getPlanIpList(this.subnetId);

        const { status, message, data } = res || {};
        
        if (+status === 200) {
          this.tableData = data.data.map(item => { 
            item.leasestarttime = formatDate(item.leasestarttime);  
            item.leaseendtime = formatDate(item.leaseendtime);

            let type = legendList.find(child => child.value === item.AddressType);

            item.typeText = type ? type.label : "";

            return item; 
          })
            .sort((prev, next) => this.getIpLastNum(prev.ip) - this.getIpLastNum(next.ip));

          // console.log(this.tableData.find(item => item.ip === "192.168.0.1"));
            
        }
        else {
          Promise.reject({ message: message || "请求失败" });
        }
      } catch (err) {        
        console.error(err);

        this.$$error(err.message || "请求失败！");
      }
      finally {
        this.loading = false;
      }
    },

    handleTableSelect(datas) {
      this.selectedData = datas;            
    },

    handleSearch() {
      if (this.selectedData.length > 1) {
        this.$$warning("只能对一个地址进行检测！");

        return;
      }
      else if (!this.selectedData.length) {
        this.$$warning("请选择一个地址进行检测！");

        return;
      }

      this.showSearch = true;
    },

    handleSearched() {
      this.handleQuery();
    },

    handleToAddressPool() {
      this.$router.push(`/dhcp-service/address-pool-list?subnetId=${this.subnetId}&address=${this.ipAddress}`);
    },

    handleEdit(res) {
      this.editData = res;
      this.showEdit = true;
    },

    handleSaved() {
      this.handleQuery();
    },

    handleConfigAttibute(res) {
      this.editData = res;
      this.showConfig = true;
    },

    handleConfiged({ id, params }) {
      let row = this.tableData.find(item => id === item.id);
      
      const {        
        DeviceTypeFlag,
        BusinessFlag,
        ChargePersonFlag,
        TelFlag,
        DepartmentFlag,
        PositionFlag
      } = params;

      row.deviceTypeflag = DeviceTypeFlag;
      row.businessflag = BusinessFlag;
      row.chargePersonflag = ChargePersonFlag;
      row.telflag = TelFlag;
      row.departmentflag = DepartmentFlag;
      row.positionflag = PositionFlag;

      if (!DeviceTypeFlag) {
        row.devicetype = "";
      }

      if (!BusinessFlag) {
        row.business = "";
      }

      if (!ChargePersonFlag) {
        row.chargeperson = "";
      }

      if (!TelFlag) {
        row.tel = "";
      }

      if (!DepartmentFlag) {
        row.department = "";
      }

      if (!PositionFlag) {
        row.position = "";
      }
    },

    async handleDelete(item) {
      try {
        await service.deleteIpAddress(item.id);
      } catch (err) {
        console.error(err);
        
        this.$$error(err.message || "删除失败");
      }
    },

    handleFixAndKeep(type) {
      if (this.selectedData.length > 1) {
        this.$$warning("只能对一个地址进行操作！");

        return;
      }
      else if (!this.selectedData.length) {
        this.$$warning("请选择一个地址进行操作！");

        return;
      }

      this.typeofFixOrKeep = type;
      this.showFixOrKeep = true;
    },

    handleFixedOrKept() {
      this.handleQuery();
    }
  }
};
</script>