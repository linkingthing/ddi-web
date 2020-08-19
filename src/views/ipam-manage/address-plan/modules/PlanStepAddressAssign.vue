<template>
  <div class="PlanStepAddressAssign">
    <AddressTypeTab
      :active="active"
      @change="handleIpTypeChange"
    />
    PlanStepAddressAssign

    <AddressAssignSubnetList />
  </div>
</template>

<script>
import AddressTypeTab from "./AddressTypeTab";
import AddressAssignSubnetList from "./AddressAssignSubnetList";
export default {
  components: {
    AddressTypeTab,
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