export class Line {
  // 默认值
  values = [];
  labels = [];
  multiple = false; // 如果对values进行二为数组判定，这个参数都可以省略了
  isPercent = false;
  seriesName = "";
  lineTheme = "blue";
  showLine = "all"; // 默认是全部，但是可以指定只显示某一部分
  legend = [];

  constructor(props) {}

  init() {}

  static create(props) {
    return new Line(props);
  }
}
