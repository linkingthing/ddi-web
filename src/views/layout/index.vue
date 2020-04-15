<template>
  <article class="main-content">
    <!-- 菜单 -->
    <Menu />
    
    <section class="content-box">
      <Header />

      <div class="content-wrapper">
        <div class="content-padding">
          <Bread />

          <router-view />
        </div>
      </div>
    </section>
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
@import "./index.less";
</style>