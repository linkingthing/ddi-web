import Vue from "vue";

import ViewUI from "view-design";
Vue.use(ViewUI);

import tags from "@/components/tags";
Vue.component("Tags", tags);

import vuescroll from "vuescroll";
Vue.use(vuescroll); 

import BaseBtnEdit from "@/components/BaseBtnEdit";
Vue.component("btn-edit", BaseBtnEdit);

import BaseBtnDel from "@/components/BaseBtnDel";
Vue.component("btn-del", BaseBtnDel);

import TablePagination from "@/components/TablePagination";
Vue.component("table-page", TablePagination);

import CommonModal from "@/components/CommonModal";
Vue.component("common-modal", CommonModal);

import IviewLoading from "@/components/IviewLoading";
Vue.component("IviewLoading", IviewLoading);

import mixin from "./../mixin";
Vue.mixin(mixin);