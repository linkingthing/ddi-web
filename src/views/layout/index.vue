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