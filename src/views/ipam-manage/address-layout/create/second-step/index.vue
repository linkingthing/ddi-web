<template>
  <div class="second-step segment-list">
    <div
      class="segment-item"
      v-for="(item, idx) in list"
      :key="idx">
      <section class="item-top">
        <div class="item-title">
          <div v-if="item.edit" @dblclick="item.edit = true">
            <span class="item-title-content">
              {{item.name}} 
            </span>
            <span>双击修改</span>
          </div>

          <Input
            v-else
            placeholder="请输入标识名称"
            maxlength="255"
            v-model="item.name"
            @blur="item.edit = false" />
        </div>

        <Button
          type="default"
          @click="handleAddItem(item)"
        >
          添加
        </Button>
      </section>

      <template v-if="item.tags.length">
        <section
          class="tag-item"
          v-for="(child, childIndex) in item.tags"
          :key="childIndex">
          <div>
            <div class="tag-item-child">
              <label class="child-label">名称</label>
            </div>
            <Input placeholder="请填写名称" v-model="child.name" />
            <div class="tag-item-child">
              <label class="child-label">值</label>
            </div>
            <Input placeholder="请填写名称" v-model="child.value" />
          </div>
          
          <img
            class="item-delete"
            @click="handleDeleteTag(childIndex)"
            :src="deleteImg">
        </section>
      </template>

      <div class="segment-no-data" v-else>点击添加按钮即可添加前缀</div>
    </div>
  </div>
</template>

<script>
import deleteImg from "./../images/delete.png";

export default {
  data() {
    return {
      deleteImg,
      list: []
    };
  },

  methods: {
    handleAddItem(segment) {
      
    },

    handleDeleteItem(idx) {}
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>