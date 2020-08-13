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

const os = require('os');
const path = require('path');
const fs = require('@xan105/fs');
const zip = require("adm-zip");
const request = require('request-zero');
const unzip = require('../util/un7z/un7z.js');
const pak2zip = require("../util/pak2zip/pak2zip.js");
const { getRealm } = require('./aion.js');

const TEMP = path.join(os.tmpdir() || process.env.TEMP, "Aion Voice Pack");

module.exports.make = async (version, manifest, option, callbackProgress = ()=>{}) => {
 
  if (typeof option === 'function') {
		callbackProgress = option
		option = null;
	}
	
	if (!option) option = {};
  
  const options = {
    cc: option.cc ?? 4,
    dest: option.dest || "./voicepack",
    prefix: option.prefix || null,
    patch: option.patch ?? true
  };

  const realm = getRealm(options.cc);
  
  callbackProgress(`Starting download...`);

  for (let file of manifest)
  {
      callbackProgress(file.path);
      
      let dest = path.join(options.dest, file.path.replace(`l10n\\${realm.locale}\\sounds`,"").replace("sounds",""));
      if (options.prefix) dest = addPrefix(dest,options.prefix);

      if (await fs.exists(dest) && await fs.hashFile(dest) === file.sha1) {
        callbackProgress("file is already up to date ! (same hash) > SKIPPING");
      } else {
        const chunks = file.url.map(url => realm.url.base + "/" + version + "/" + url);
        
        callbackProgress("Downloading...");
        await request.download.all(chunks, path.join(TEMP, `${version}`, path.parse(file.path).dir), (percent, speed, file) => { callbackProgress([percent, speed, file]) });
      
        callbackProgress("Extracting...");
        const extracted = await unzip( path.join(TEMP, `${version}`, file.path + ".zip"), {binaryMerge: true} );
        
        callbackProgress("Hash verification...");
        if (await fs.hashFile(extracted) !== file.sha1) throw "HASH_CHECK_FAILURE"                         
        
        if( realm.cc === 4 && options.patch === true && file.path.includes(`l10n\\${realm.locale}\\sounds\\voice`))
        {
          callbackProgress("Patching voice order...");
          const patched = path.join(TEMP, "patch", path.parse(extracted).base);
          await patch(extracted, patched);
          
          await fs.mv(patched,dest);
        } else {
          await fs.mv(extracted,dest);
        }
      
      }
 
  }
  
  callbackProgress("Cleaning up...");
  await fs.rmdir(TEMP).catch(()=>{});
  
  callbackProgress(`Done! Voice pack files are in "${path.resolve(options.dest)}"`);
  
}

async function patch (src, dest) {

    const map = [    
        {from: "_fdb", to: "_fdd"},
        {from: "_fdc", to: "_fdb"},
        {from: "_fdd", to: "_fdc"},
        {from: "_flb", to: "_fld"},
        {from: "_flc", to: "_flb"},
        {from: "_fld", to: "_flc"},
        {from: "_mdb", to: "_mdd"},
        {from: "_mdc", to: "_mdb"},
        {from: "_mdd", to: "_mdc"},
        {from: "_mlb", to: "_mld"},
        {from: "_mlc", to: "_mlb"},
        {from: "_mld", to: "_mlc"},
        {from: "f_b_", to: "f_d_"},
        {from: "f_c_", to: "f_b_"},
        {from: "f_d_", to: "f_c_"},
        {from: "m_b_", to: "m_d_"},
        {from: "m_c_", to: "m_b_"},
        {from: "m_d_", to: "m_c_"}
    ];

    const decrypted = await pak2zip(src,dest.replace(path.parse(dest).ext,".zip"));
    let archive = new zip(decrypted);
    let newArchive = new zip();
        
    archive.getEntries().forEach((entry)=> {

      const name = entry.entryName;
      const content = archive.readFile(entry);
      
      let newName;
          
      for (let patch of map) 
      {
       if (name.includes(patch.from))
       {
         newName = name.replace(patch.from,patch.to);
         break;
       }
      }
      
      newArchive.addFile(newName || name, content, '');  
             
     });

     newArchive.writeZip(path.resolve(dest));
}

function addPrefix(string,prefix){
  const base = path.parse(string).base;
  return string.replace(base,`${prefix}${base}`);
}