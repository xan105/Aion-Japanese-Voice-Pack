'use strict';

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

module.exports = (pak,zip) => {

  const errorMessage = ["Error:","Unknow ","Bad signature:"];

  return new Promise((resolve, reject) => {
  
    if (!pak || pak === "" || !zip || zip === "") { return reject("Unvalid parameter(s)") }
    
    pak = path.resolve(pak);
    zip = path.resolve(zip);
    
    fs.mkdir(path.parse(zip).dir, { recursive: true }, (err) => {
    
        if (err) { return reject(err); }
    
        const cmdline = [`${pak.replace(/\\\\/g,"\\")}`,`${zip.replace(/\\\\/g,"\\")}`];

        const decrypt = spawn(path.resolve(__dirname, `dist/pak2zip.${(process.arch === "x64") ? 'x64' : 'x86'}.exe`), cmdline , {stdio: ['pipe', 'pipe', 'pipe']});

          decrypt.stdout.on('data', (data) => {
          
            if (errorMessage.some(error => data.includes(error))){ 
              fs.unlink(zip, () => { return reject(`${data}`) });
            }
            
          });
         
          decrypt.stderr.on('data', (data) => {
          
            return reject(`${data}`);
          
          });     

          decrypt.on('exit', (code) => {
     
                if (code == 0)
                { 
                   return resolve(zip);      
                }
                else
                {
                   return reject(`Process failed with code ${code}`);
                }
            });
        
    });
    
  });
  
}