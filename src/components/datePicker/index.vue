<template>
  <div class="datePicker">
    <Button-group class="button-group">
      <i-button @click="handleReduce">
        <Icon type="md-remove" />
      </i-button>
      <i-input
        v-model="time.label"
        readonly
        class="input"
        placeholder
      />
      <i-button @click="handleAdd">
        <Icon type="md-add" />
      </i-button>
    </Button-group>

    <DatePicker
      :value="date"
      @on-change="handleSelectDate"
      type="datetime"
      placeholder="选择开始日期"
      style="width: 160px"
    />
    <InputNumber
      v-model="step"
      style="width: 120px"
    />

    <i-button
      type="primary"
      @click="handleSearch"
    >搜索</i-button>
  </div>
</template>

<script>
/**
 * datePicker
 * 用于时间段选取
 *
 * @event onSearch ({
 *  start,
 *  end,
 *  step
 * })
 */
import config from "./config";
export default {
  components: {},
  props: {},
  data() {
    return {
      current: 0,
      time: "",
      times: config,
      date: new Date(),
      step: 0,
    };
  },
  computed: {
    start() {
      return new Date(this.date).getTime() / 1000;
    },
    end() {
      return this.start + this.time.value;
    }
  },
  methods: {
    handleReduce() {
      if (this.current > 0) {
        this.current = this.current - 1;
      }
    },
    handleAdd() {
      if (this.current < this.times.length) {
        this.current = this.current + 1;
      }
    },
    handleSelectDate(date) {
      this.date = date;
    },
    handleSearch() {
      const { start, end, step } = this;
      this.$emit("onSearch", {
        start,
        end,
        step
      });
    }
  },
  mounted() {
    this.time = this.times[this.current];
  },
  watch: {
    current(index) {
      this.time = this.times[index];
    }
  }
};
</script>
<style lang="less" scoped>
.datePicker {
  .button-group {
    .input {
      float: left;
      width: 120px;
      border-radius: 0;
    }
  }
}
</style>