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

import BaseBtnReset from "@/components/BaseBtnReset";
Vue.component("btn-reset", BaseBtnReset);

import BaseLineEdit from "@/components/BaseLineEdit";
Vue.component("line-edit", BaseLineEdit);

import BaseBtnMove from "@/components/BaseBtnMove";
Vue.component("btn-move", BaseBtnMove);

import BaseBtnSearch from "@/components/BaseBtnSearch";
Vue.component("btn-search", BaseBtnSearch);

import BaseBtnDetect from "@/components/BaseBtnDetect";
Vue.component("btn-detect", BaseBtnDetect);

import TablePagination from "@/components/TablePagination";
Vue.component("table-page", TablePagination);

import CommonModal from "@/components/CommonModal";
Vue.component("common-modal", CommonModal);

import IviewLoading from "@/components/IviewLoading";
Vue.component("IviewLoading", IviewLoading);

import CommonProcess from "@/components/CommonProcess";
Vue.component("common-process", CommonProcess);

import CommonTab from "@/components/CommonTab";
Vue.component("common-tab", CommonTab);

import CommonForm from "@/components/CommonForm";
Vue.component("common-form", CommonForm);

import NoDataList from "@/components/NoDataList";
Vue.component("no-data-list", NoDataList);

import mixin from "./../mixin";
Vue.mixin(mixin);