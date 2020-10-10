<template>
  <div class="week-time">
    <WeekSelect v-model="week" />
    <TimeSelect
      class="time"
      v-model="time"
    />
  </div>
</template>

<script>
import WeekSelect from "./WeekSelect";
import TimeSelect from "./TimeSelect";
import { isNumber, isNaN } from "lodash";

export default {
  components: {
    WeekSelect,
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
      week: void 0,
      time: void 0
    };
  },
  computed: {
    innerValue() {
      const { week, time } = this;
      return { week, time };
    }
  },
  watch: {
    innerValue: {
      deep: true,
      handler({ week, time }) {
        if (week !== void 0 && time !== void 0) {
          const value = `${week}-${time}`;
          if (value !== this.value) {
            this.$emit("input", value);
          }
        }
      }
    },
    value: {
      immediate: true,
      handler(value) {
        const [week, time] = value.split("-");
        if (isNumber(+week) && isNumber(+time) && !isNaN(+week) && !isNaN(+time)) {
          this.week = +week;
          this.time = +time;

        }
      }
    }
  }
};
</script>

<style lang="less">
.week-time {
  display: flex;
  .time {
    width: 120px;
  }
}
</style>