<template>
  <div class="date-time">
    <DatePicker
      v-model="date"
      clearable
    />
    <TimeSelect
      class="time"
      v-model="time"
    />
  </div>
</template>

<script>
import { DatePicker } from "view-design";
import TimeSelect from "./TimeSelect";
import { isNumber, isNaN } from "lodash";

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
      time: ""
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
        if (timestamp !== void 0 && time !== "") {
          const value = `${timestamp}-${time}`;
          if (value !== this.value) {
            this.$emit("input", value);
          }
        }
      }
    },
    value(value) {

      if (value === "") {
        this.date = void 0;
        this.time = "";
        return;
      }
      const [date, time] = value.split("-");
      if (isNumber(+date) && isNumber(+time) && !isNaN(+date) && !isNaN(+time)) {
        this.date = date && new Date(+date);
        this.time = +time;
      }
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