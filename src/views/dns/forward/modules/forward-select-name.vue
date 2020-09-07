<template>
  <div class="forward-select-name">
    <Select
      :value="selectValue"
      style="width: 240px"
      @on-change="handleSelectChange"
    >
      <Option
        v-for="item in nameList"
        :value="item.value"
        :key="item.value"
      >{{ item.label }}</Option>
    </Select>
    <i-input
      v-model="name"
      v-if="selectValue === 'name'"
    />

    <Select
      v-if="selectValue === 'domainGroup'"
      multiple
      :value="domainGroup"
      style="width: 240px"
      @on-change="handleSelectChangeDomainGroup"
    >
      <Option
        v-for="item in domainGroupList"
        :value="item.id"
        :key="item.id"
      >{{ item.name }}</Option>
    </Select>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: Object,
      default: () => ({
        type: "root",
        value: "."
      })
      /**
       * type:
       * root
       * name
       * domainGroup
       * 
       * value, . domain, domainGroupName
      */
    }
  },
  data() {
    this.nameList = [
      {
        value: ".",
        label: "根区"
      },
      {
        value: "name",
        label: "域名"
      },
      {
        value: "domainGroup",
        label: "域名组"
      }
    ];
    return {
      selectValue: "",
      name: "",
      showInput: false,
      showDomainGroup: false,
      domainGroupList: [],
      domainGroup: []
    };
  },

  watch: {
    value(value) {
      console.log(value)

      if (value.type === "root") {
        this.selectValue = value.value;

      }
      if (value.type === "name") {
        this.name = value.value;
      }
      if (value.type === "domainGroup") {
        this.domainGroup = value.value;
      }
    },
    name(value) {
      this.$emit("input", {
        type: "name",
        value
      });
    }

  },
  created() { },
  mounted() {
    this.$getData({}, "/dns/dns/domaingroups").then(({ data }) => {
      this.domainGroupList = data;
    });
  },
  methods: {
    handleSelectChange(value) {
      this.selectValue = value;
      if (value === ".") {
        this.$emit("input", {
          type: "root",
          value
        });
      }
      // if (value === "name") {
      //   this.$emit("input", {
      //     type: "name",
      //     value: this.name
      //   });
      // }
    },

    handleSelectChangeDomainGroup(value) {
      this.domainGroup = value;
      this.$emit("input", {
        type: "domainGroup",
        value
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>