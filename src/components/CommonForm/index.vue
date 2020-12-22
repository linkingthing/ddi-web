<template>
  <div class="common-form">
    <FormItem
      :label="item.label"
      v-for="(item) in formItemListParser"
      :key="item.model"
      :prop="item.model"
      :style="item.style"
    >
      <component
        :is="item.component"
        v-model="formModel[item.model]"
        v-if="item.type === 'component'"
        v-bind="item.props"
        v-on="item.events"
      />
      <i-input
        v-if="item.type === 'input'"
        v-model.trim="formModel[item.model]"
        :type="item.inputType"
        :disabled="item.disabled"
        :placeholder="item.placeholder"
        :size="item.size"
      />
      <RadioGroup
        v-if="item.type === 'radio'"
        v-model="formModel[item.model]"
      >
        <Radio
          v-for="(e, i) in item.children"
          :key="i"
          :label="e.label"
          :disabled="item.disabled"
        >
          {{ e.text }}
        </Radio>
        <slot
          v-if="item.slot"
          :name="item.slot"
        />
      </RadioGroup>
      <CheckboxGroup
        v-if="item.type === 'checkbox'"
        v-model="formModel[item.model]"
        class="mycheck-group"
      >
        <Checkbox
          v-for="e in item.children"
          :key="e.label"
          :label="e.label"
          :disabled="e.disabled"
        >
          {{ e.text }}
        </Checkbox>
      </CheckboxGroup>
      <Checkbox
        v-if="item.type === 'check'"
        v-model="formModel[item.model]"
        :label="item.checklabel"
        :disabled="e.disabled"
      >
        {{ e.text }}
        <slot
          v-if="item.slot"
          :name="item.slot"
        />
      </Checkbox>
      <DatePicker
        v-if="item.type === 'datePicker'"
        v-model="formModel[item.model]"
        style="width:100%;"
        :value="formModel[item.model]"
        :type="item.pickertype ? item.pickertype : 'date'"
        :options="item.options"
        :transfer="item.transfer"
        :format="item.format"
        :size="item.size"
        :placeholder="item.placeholder"
      />
      <i-input
        v-if="item.type === 'textarea'"
        v-model="formModel[item.model]"
        :autosize="item.autosize"
        :placeholder="item.placeholder"
        type="textarea"
        :size="item.size"
      />
      <Select
        v-if="item.type === 'select'"
        v-model="formModel[item.model]"
        :disabled="item.disabled"
        :filterable="item.filterable"
        :size="item.size"
        :placeholder="item.placeholder"
        :multiple="item.multiple"
        :clearable="item.clearable"
      >
        <Option
          v-for="e in item.children"
          :key="e.label"
          :value="e.label"
        >
          {{ e.text }}
        </Option>
      </Select>
      <label
        v-if="item.type === 'text'"
        :size="item.size"
        style="overflow: hidden;
              word-break: break-all;"
      >
        {{ Array.isArray(formModel[item.model]) ? formModel[item.model].join(",") : formModel[item.model] }}
        <slot
          v-if="item.slot"
          :name="item.slot"
          :params="item.params"
        />
      </label>
      <InputNumber
        v-if="item.type==='number'"
        v-model="formModel[item.model]"
        style="width:100%;"
        :formatter="value => `${value}`.replace(/(?=(?!\b)(\d{3})+\.)/g,',')"
        :parser="value => value.replace(/$s?|(,*)/g, '')"
        :precision="item.precision"
        :min="item.min"
        :max="item.max"
        :disabled="item.disabled"
        :placeholder="item.placeholder"
        :size="item.size"
      />
      <Input
        v-if="item.type==='number2'"
        v-model="formModel[item.model]"
        :maxlength="16"
        :placeholder="item.placeholder"
        type="text"
        @on-focus="inputFocus(item.model)"
      />
      <Input
        v-if="item.type==='password'"
        v-model="formModel[item.model]"
        :maxlength="16"
        password
        :placeholder="item.placeholder"
        type="password"
      />

      <div
        v-if="item.type === 'inputSlot'"
        style="postion: relative;"
      >
        <i-input
          v-model="formModel[item.model]"
          :type="item.inputType"
          :disabled="item.disabled"
          :placeholder="item.placeholder"
          :size="item.size"
        />
        <slot
          v-if="item.slot"
          :name="item.slot"
          :params="item.params"
        />
      </div>

      <div
        class="extra"
        v-if="item.extra"
      >{{item.extra}}</div>
    </FormItem>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    formModel: {
      type: Object,
      default: () => ({})
    },
    formItemList: {
      type: Array,
      default: () => ([])
    },
    showFields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    };
  },
  computed: {
    formItemListParser() {
      const formItemList = [];
      this.formItemList.forEach(({ ...item }) => {
        if (this.showFields.includes(item.model)) {
          item.type = "text";
        }
        formItemList.push(item);
      });

      return formItemList;
    }
  },
  created() {
  },
  mounted() { },
  methods: {}
};
</script>

<style lang="less">
.common-form {
  .ivu-form-item {
    &:last-child {
      margin-bottom: 0;
    }
  }
  .ivu-form-item-content {
    display: flex;
    .extra {
      display: inline-block;
      padding: 0 10px;
    }
  }
}
</style>