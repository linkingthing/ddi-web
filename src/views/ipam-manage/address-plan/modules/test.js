
import { v4 as uuidv4 } from "uuid";


const planNode = {
  id: uuidv4(),
  prefix: prefix,
  parentsemanticid,
  parentplannodeid: "0", // 网络节点的上层网络节点
  sequence: index,
  value: index + 1,
  name: `plannodes root`,
  bitWidth: 4,
  maxmaskwidth: 64
};

const semanticnodes = [{
  id: parentsemanticid,
  modified: 1,
  name: "语义节点1",
  parentsemanticid: "0",
  stepsize: 2,
  sequence: 1,
  autocreate: false,
  ipv4s: [],
  plannodes: rootPlanNodes
}];