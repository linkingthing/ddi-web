<template>
  <div class="PlanStepAddressAssign">
    <AddressTypeTab
      :active="active"
      @change="handleIpTypeChange"
    />
    <AddressAssignList />
    <AddressAssignSubnetList />
  </div>
</template>

<script>
import { } from "vuex";
import AddressTypeTab from "./AddressTypeTab";
import AddressAssignList from "./AddressAssignList";
import AddressAssignSubnetList from "./AddressAssignSubnetList";
export default {
  components: {
    AddressTypeTab,
    AddressAssignList,
    AddressAssignSubnetList
  },
  props: {},
  data() {
    return {
      active: "IPv6"
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    handleIpTypeChange(type) {
      this.active = type;
    }
  }
};
</script>

<style lang="less" scoped>
</style>