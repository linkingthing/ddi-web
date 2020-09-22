<template>
  <article class="main-content">
    <Header />
    <!-- 菜单 -->

    <section class="content-box">
      <Menu />

      <div class="content-padding">
        <Bread />

        <router-view />
      </div>
    </section>
    <!-- <div class="right">sss</div> -->
  </article>
</template>

<script>
import Menu from "@/components/Menu";
import Header from "@/components/Header";
import Bread from "@/components/Bread";

export default {
  name: "Layout",

  components: {
    Menu,
    Header,
    Bread
  }
};
</script>

<style lang="less">
.main-content {
  background: #f6f6f6;
  height: 100%;

  .content-box {
    width: 100%;
    height: calc(~"100% - 76px");
    overflow: auto;
    display: flex;
  }

  .bread {
    padding: 20px;
  }

  .content-padding {
    background: #fff;
    height: calc(~"100% - 16px");
    margin: 0 16px;
    flex: 1;
    overflow: auto;
    position: relative;
    border-radius: 6px;
  }
}
.right {
  position: fixed;
  right: 10px;
  top: 80px;
  bottom: 0;
  width: 300px;
  background: #f80;
}
</style>