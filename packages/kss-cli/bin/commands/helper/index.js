const fs = require('fs-extra')
const path = require('path')

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

module.exports = {
    copyDir
}