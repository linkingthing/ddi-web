<template>
  <article class="main-content">
    <!-- 菜单 -->
    <Menu />
    
    <section class="content-box">
      <Header />

      <div class="content-wrapper">
        <div class="content-padding">
          <bread />

          <router-view />
        </div>
      </div>
    </section>
  </article>
</template>

<script>
import Menu from "@/components/Menu";
import Header from "@/components/Header";

export default {
  name: "Layout",
  
  components: {
    Menu,
    Header
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>