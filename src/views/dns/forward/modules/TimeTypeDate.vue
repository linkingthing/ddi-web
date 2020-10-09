<template>
  <div class="date-time">
    <DatePicker v-model="date" />
    <TimeSelect
      class="time"
      v-model="time"
    />
  </div>
</template>

<script>
import { DatePicker } from "view-design";
import TimeSelect from "./TimeSelect";

export default {
  components: {
    DatePicker,
    TimeSelect
  },
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: "" // week-time
    }
  },
  data() {
    return {
      date: void 0,
      time: void 0
    };
  },
  computed: {
    innerValue() {
      const { date, time } = this;
      const timestamp = date && date.getTime();
      return { timestamp, time };
    }
  },
  watch: {
    innerValue: {
      deep: true,
      handler({ timestamp, time }) {
        if (timestamp !== void 0 && time !== void 0) {
          const value = `${timestamp}-${time}`;
          if (value !== this.value) {
            this.$emit("input", value);
          }
        }
      }
    },
    value(value) {
      const [week, time] = value.split("-");
      this.week = +week;
      this.time = +time;
    }
  }
};
</script>

<style lang="less">
.date-time {
  display: flex;
  .time {
    width: 120px;
  }
}
</style>