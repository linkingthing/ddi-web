<template>
  <main class="main-content">
    <!-- 菜单 -->
    <Menu></Menu>
    <section class="content">
      <Header></Header>
      <div class="content-wrapper">
        <div class="content-padding">
          <bread></bread>
          <router-view></router-view>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Menu from "./Menu";
import Header from "./Header";

export default {
  name: "Layout",
  components: {
    Menu,
    Header
  }
};
</script>

<style lang="less" scoped>
.main-content {
  position: absolute;
  margin: 0;
  bottom: 0px;
  top: 0px;
  background: #f4f3ef;
}

.content {
  height: 100%;
  overflow: auto;
}

.bread {
  padding: 20px;
}

.content-wrapper {
  padding: 120px 40px 20px 40px;
  height: 100%;
}
.content-padding {
  background: #fff;
  min-height: 100%;
}
</style>