<template>
  <main class="main-content">
    <!-- 菜单 -->
    <menu-nav-dns></menu-nav-dns>
    <section class="content">
      <div class="header">
        <div class="bread">
          <!-- <Breadcrumb>
            <BreadcrumbItem
              :key="item.path"
              :to="index === breadcrumbList.length-1 ? '': item.path"
              v-for="(item, index) in breadcrumbList"
            >
              {{item.title}}
              <template v-if="item.name">({{item.name}})</template>
            </BreadcrumbItem>
          </Breadcrumb> -->
        </div>

        <div class="user">
          <Badge :count="3">
            <Icon type="ios-notifications-outline" style="font-size: 20px" />
          </Badge>
          <Dropdown style="margin-left: 20px" @on-click="handleClickMenu">
            <a href="javascript:void(0)">
              <img src="../../assets/images/avatar.png" alt class="avatar" />

              <!-- <img src="../../assets/images/setting.png" alt /> -->
              Admin
              <Icon type="md-arrow-dropdown" />
            </a>
            <dropdownMenu slot="list">
              <DropdownItem name="user" key="user">用户信息</DropdownItem>
              <DropdownItem name="password" key="password">修改密码</DropdownItem>
              <DropdownItem name="out" key="out">退出系统</DropdownItem>
            </dropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div class="content-wrapper">
        <router-view></router-view>
      </div>
    </section>
    <Modal v-model="visible" title="修改密码">
      <Form :label-width="80" style="width: 400px;margin:0 auto">
        <FormItem label="账号">admin</FormItem>
        <FormItem label="密码">
          <Input v-model="password" type="password" placeholder="请输入密码" />
        </FormItem>
        <FormItem label="再次输入">
          <Input v-model="rePassword" type="password" placeholder="请在此输入密码" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" @click="handleSubmit">确认</Button>
      </div>
    </Modal>
  </main>
</template>

<script>
import menuNavDns from "./MenuDns";

export default {
  name: "DnsLayout",
  data() {
    return {
      visible: false,
      // loading: true,
      password: "",
      rePassword: "",
      breadcrumbList: []
    };
  },
  components: {
    menuNavDns
  },
  mounted() {
    this.excuteBreadcrumbList(this.$route, this.$route);
  },
  methods: {
    handleClickMenu(name) {
      const self = this;
      if (name === "out") {
        self.SET_TOKEN("");
        self.$router.push({
          path: "/login"
        });
      }
      if (name === "password") {
        this.visible = true;
      }
    },
    handleSubmit() {
      if (this.password === this.rePassword) {
        services
          .updatePassword({
            username: "admin",
            password: this.password
          })
          .then(res => {
            this.$Message.success("修改成功");
            this.visible = false;
          });
      } else {
        this.visible = true;
        this.$Message.error("两次密码输入不一致");
      }
    },
    cancel() {
      this.visible = false;
    },
    excuteBreadcrumbList(currentRoute, prevRoute) {
      const {
        fullPath: currentFullPath,
        meta: { parent, title: currentTitle },
        query: { name }
      } = currentRoute;
      const {
        fullPath,
        meta: { title }
      } = prevRoute;
      if (prevRoute.name === parent) {
        this.breadcrumbList.pop();
        this.breadcrumbList.push({
          path: fullPath,
          title,
          name
        });
      } else if (
        this.breadcrumbList.map(item => item.path).includes(currentFullPath)
      ) {
        // 面包屑回退
        const index = this.breadcrumbList
          .map(item => item.path)
          .indexOf(currentFullPath);
        this.breadcrumbList = this.breadcrumbList.slice(0, index);
      } else {
        const { path } = this.$route;
        const [, , menu] = path.split("/");
        const menuConfig = {
          authority: "权威管理",
          recursion: "递归管理",
          forward: "转发管理",
          accessControl: "访问控制"
        };
        this.breadcrumbList = [
          {
            title: menuConfig[menu]
          }
        ];
      }
      this.breadcrumbList.push({
        path: currentFullPath,
        title: currentTitle
      });
    }
  },
  watch: {
    $route(currentRoute, prevRoute) {
      this.excuteBreadcrumbList(currentRoute, prevRoute);
    }
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

.header {
  display: flow-root;
  height: 100px;
  box-sizing: border-box;
  padding: 25px 30px;
  .bread {
    float: left;
  }

  .user {
    font-size: 16px;
    float: right;
    .avatar {
      height: 36px;
      height: 36px;
      padding-right: 20px;
      vertical-align: middle;
    }
  }
}
.content-wrapper {
  background: #fff;
  margin: 0 40px;
  height: 100%;
}
</style>