'use strict';

const path = require('path');
const util = require('util'); 
const { spawn, exec } = require('child_process');
const fs = require('@xan105/fs');

module.exports = (filePath, option = {}) => {

  let options = {
    dstDir : option.dstDir || path.parse(filePath).dir,
    binaryMerge : option.binaryMerge || false
  };

  return new Promise((resolve,reject) => {
  
    if (options.binaryMerge) {
      binaryMerge(filePath).then(()=>{
        return resolve(unzip(filePath,options.dstDir));
      }).catch((err)=>{
        return reject(err);
      });
    } else {
      return resolve(unzip(filePath,options.dstDir));
    }

  });
}

function unzip (filePath, dstDir) {
  return new Promise((resolve,reject) => {

    const errors = [
          { code: 1, msg: "Warning" },
          { code: 2, msg: "Fatal error" },
          { code: 7, msg: "Command line error" },
          { code: 8, msg: "Not enough memory for operation" },
          { code: 255, msg: "User stopped the process" },
    ];  
    
    const cmdline = ['e', path.resolve(filePath),'-tlzma','-aoa',`-o${path.resolve(dstDir)}`];
    
    const unzip = spawn(path.resolve(__dirname, `dist/7za.${(process.arch === "x64") ? 'x64' : 'x86'}.exe`), cmdline , {stdio: ['pipe', 'pipe', 'pipe']});
    
    let errorMessage = [];
    unzip.stderr.on('data', (data) => { errorMessage.push(data) });
      
    unzip.on('exit', (code) => {
         if (code == 0)
         { 
            resolve( path.join(dstDir,path.parse(filePath).name) );      
         }
         else
         {
            const message = errors.find( error => error.code == code).msg + "\r\n" + errorMessage.join('');
            reject( { code: code, message: message } );
         }
    });
  });
}

async function binaryMerge (target) { //Aion .z0* merge
  if (! await fs.exists(target) && path.parse(target).ext === ".zip" && await fs.exists(target.replace(".zip",".z01"))) {
      const output = await util.promisify(exec)(`copy /B "${path.resolve(target.replace(".zip",".z*"))}" "${path.resolve(target)}"`,{windowsHide: true});
      if (output.stderr) throw output.stderr;
  }
}

