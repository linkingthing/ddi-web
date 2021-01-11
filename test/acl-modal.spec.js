import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import aclModal from "./src/views/access-control/modules/acl-modal.vue";

describe("Counter.vue", () => {
  it("increments count when button is clicked", () => {
    const wrapper = shallowMount(aclModal);
    console.log(wrapper)
    wrapper.find("button").trigger("click");
    expect(wrapper.find("div").text()).contains("1");
  });
});
