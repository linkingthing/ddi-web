const { exec } = require("child_process");
const path = require("path");
const compressing = require("compressing");
const ora = require("ora");
const chalk = require("chalk");

const Client = require("ssh2").Client;
const connect = new Client();

console.log(path.resolve(__dirname, "dist"));

const server = {
  host: "10.0.0.121",
  port: 22,
  username: "root",
  password: "123456"
};

const config = {
  uploadPath: "/opt/website",
  executePath: "/opt/website"
};
/**
 * 发布流程
 *
 * 1.构建
 * 2.压缩
 * 3.上传
 * 4.解压到指定目录
 *
 */

function build() {
  console.log(chalk.blue("[开始构建]"));
  const spinner = ora(`Loading ${chalk.blue("构建中")}`).start();

  exec("npm run build", (err, stdout, stderr) => {
    if (err) return console.error(`exec error : ${err}`);
    spinner.stop();
    console.log(chalk.green("[构建成功]"));
    compress();
  });
}

function compress() {
  console.log(chalk.blue("[开始打包]"));
  const spinner = ora(`Loading ${chalk.blue("打包中")}`).start();

  compressing.zip.compressDir("dist/", "dist.zip").then(() => {
    spinner.stop();
    console.log(chalk.green("[打包成功]"));
    conn();
  });
}

function conn() {
  console.log(chalk.blue("[开始连接服务器]"));
  connect
    .on("ready", () => {
      upload();
    })
    .on("error", err => {
      console.error(err);
      console.log(chalk.red("[连接出错]"));
    })
    .on("end", () => {
      console.log(chalk.red("[连接关闭]"));
    })
    .on("close", err => {
      if (err) throw err;
    })
    .connect(server);
}

function upload() {
  console.log(chalk.blue("[开始上传]"));
  const spinner = ora(`Loading ${chalk.blue("上传中")}`).start();
  connect.sftp((err, sftp) => {
    if (err) throw err;
    spinner.stop()
    sftp.fastPut("./dist.zip", `${config.uploadPath}/dist.zip`, (err, res) => {
      if (err) {
        console.error(err);
        console.log(chalk.red("[上传失败]"));
        connect.end();
        return;
      }
      console.log(chalk.green("[上传成功]"));
      unzipShell();
    });
  });
}

function unzipShell() {
  connect.shell((err, stream) => {
    console.log(chalk.blue("[开始解压]"));

    if (err) throw err;
    let buf = "";
    stream
      .on("close", err => {
        connect.end();
        if (err) return console.error(err);
        console.log(chalk.green("[解压成功]"));
      })
      .on("data", data => {
        buf += data;
        console.log(buf);
      });
    stream.write(`cd ${config.uploadPath} && unzip -o dist.zip \nnext\n`);
    stream.write(`cd dist && /bin/cp -r -f * ${config.executePath} \nnext\n`);
    stream.write(
      `cd ${config.uploadPath} && rm -r -f dist && rm -r -f dist.zip \nnext\n`
    );
    stream.end("ls -l\nexit\n");
    console.log(chalk.green("[finished]"));
  });
}

build();
