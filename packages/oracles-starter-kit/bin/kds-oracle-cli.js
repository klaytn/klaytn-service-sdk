#!/usr/bin/env node

const chalk = require('chalk')
const program = require('commander')
const figlet = require('figlet')
const fs = require('fs-extra')
const path = require('path')

program.version('0.0.1')

// Functions
const copyDir = (src, dest, callback) => {
  const copy = (copySrc, copyDest) => {
    fs.readdir(copySrc, (err, list) => {
      if (err) {
        callback(err);
        return;
      }
      list.forEach((item) => {
        const ss = path.resolve(copySrc, item);
        fs.stat(ss, (err, stat) => {
          if (err) {
            callback(err);
          } else {
            const curSrc = path.resolve(copySrc, item);
            const curDest = path.resolve(copyDest, item);

            if (stat.isFile()) {
              fs.createReadStream(curSrc).pipe(fs.createWriteStream(curDest));
            } else if (stat.isDirectory()) {
              let parsedItem = curDest.replace(/\\/g, ' ')
              let searchKey = "node_modules";
              if(parsedItem.indexOf(searchKey)+searchKey.length !== parsedItem.length) {
                fs.mkdirSync(curDest, { recursive: true });
                copy(curSrc, curDest);
              }
            }
          }
        });
      });
    });
  };

  fs.access(dest, (err) => {
    if (err) {
      fs.mkdirSync(dest, { recursive: true });
    }
    copy(src, dest);
  });
};

async function init() {
  console.log("Initializing the oracle setup")
  copyDir(path.join(__dirname, ".."), path.join(process.cwd(), "oracle-starter-kit"), (err) => {
    if(err) {
      console.log(err);
      return;
    }
  })
  console.log('created "oracle-starter-kit" folder')
  console.log('Please follow instructions from README file inside the "oracle-starter-kit" folder')
}

// Commands
program
.name('kds-cli')
 .usage('[options] <command> <subcommand>')
.command('oracle')
.description('klaytn developer sdk cli')
.command('init')
.description('initialize the oracle hardhat project')
.alias('i')
.action(init)

if(process.argv.slice(2).length == 0) {
  console.log(
    chalk.yellow(
      figlet.textSync('kds-oracle-cli', { horizontalLayout: 'full' })
    )
  );
}

program.parse(process.argv)