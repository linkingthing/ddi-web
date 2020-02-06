#vue iviewui



> 技术栈：vue + vuex + vue-router + vue-resource + less + iview

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```


### 目录说明

> components

用于存放公用组件,仅在模块中使用过的组件属于模块组件，应该放在对应模块文件夹下，不放在components文件夹

> services 

用于统一管理 api ，配置多业务系统代理地址前缀

|变量|用途|
|-|-|
|nodeBaseUrl| api地址前缀，用于指向node模块api部署的服务器地址|
|dnsBaseUrl| api地址前缀，用于指向dns模块api部署的服务器地址|
|DHCP | 规划中|
|IPAM|规划中|
|System|规划中|






