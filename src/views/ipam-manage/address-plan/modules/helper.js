import _ from "lodash";
export const defaultBitWidth = 4;

export function treeEach(tree, fn) {
  const _tree = _.cloneDeep(tree);
  fn(_tree);
  if (_tree.nodes && Array.isArray(_tree.nodes)) {
    _tree.nodes.forEach(item => {
      fn(item);
    });
  }
  return _tree;
}
