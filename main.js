/*
MIT License

Copyright (c) 2012-2020 Anthony Beaumont

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict';

const path = require('path');
const aion = require('./aion/aion.js');
const voicepack = require('./aion/voicepack.js');
const fs = require('@xan105/fs');
const debug = new (require('@xan105/log'))({
  console: true,
  file: "./log.txt"
});

(async()=>{
try{
  
  let options = require("./option.json");
  
  const realm = aion.getRealm(options.cc);
  
  if (!options.dest) options.dest = path.join("./voicepack",realm.locale);
  
  let lastKnownVersion;
  try{
    lastKnownVersion = JSON.parse( await fs.readFile("./aion/version.json", "utf8") );
  }catch{
    lastKnownVersion = {jpn: 221, kor: 578}; //As of writting. You can safely use 0 instead. It will just take a longer time. Never use a value greater than the actual remote version (infinite loop)
  }
  
  debug.log(`Finding Aion ${realm.locale.toUpperCase()} latest version ...`);
  const version = await aion.GetRemoteVersion({searchStart: lastKnownVersion[realm.locale], cc: realm.cc},(cc,version,status) => { debug.log(`is ${version} ? => ${status}`); });
  debug.log(`Last version is: ${version}`);
  
  lastKnownVersion[realm.locale] = version;
  await fs.writeFile("./aion/version.json",JSON.stringify(lastKnownVersion, null, 2),"utf8").catch((err) => { debug.warn(err) });
  
  debug.log(`Generating file manifest for Aion ${realm.locale.toUpperCase()} v${version}...`);
  const manifest = await aion.GetManifest(version, {cc: realm.cc});
  debug.log(`Manifest has ${manifest.length} files`);
  
  await voicepack.make(version, manifest, options, (progress) => { (typeof(progress) === "string") ? debug.log(progress) : printProgress(...progress) });
  
  debug.log(`Copy Voicepack files to "Aion\\L10N\\[***YOUR LANGUAGE CODE***]\\sounds" folder`);
  
}catch(err){debug.error(err)}
})().catch((err)=>{debug.error(err)});

function printProgress(percent, speed, file){
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${percent}% @ ${speed} kb/s [${file}]`);
    if ( percent >= 99 && speed == 0) {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
    }
}
