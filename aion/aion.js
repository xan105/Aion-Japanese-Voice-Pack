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
const request = require('@xan105/request');
const parseTorrent = require('parse-torrent');
const unzip = require('../util/un7z/un7z.js');
const realms = require('./cc.js');

const TEMP = path.join(os.tmpdir() || process.env.TEMP, "Aion Voice Pack");

module.exports.getRealm = (cc) => Object.values(realms).find( realm => realm.cc == cc );

module.exports.GetRemoteVersion = async (option, callbackProgress = ()=>{}) => {

  if (typeof option === 'function') {
		callbackProgress = option
		option = null;
	}
	
  if (!option) option = {};
  
  const options = {
    cc: option.cc ?? 4,
    searchStart: option.searchStart ?? 0
  };

  const realm = this.getRealm(options.cc);
    
  let version = options.searchStart, status, firstQuery = true;
    
  await request.head(realm.url.base); //Try if base url is available before scraping
    
  do {
    status = ( await request.head(realm.url.fileInfo(version), {maxRetry: 3}) ).code;
    callbackProgress(realm.cc,version,status);
    if (status == 200) version++;
    else 
    {
       if (firstQuery) 
       {   
          version++;
          do {
              status = ( await request.head(realm.url.fileInfo(version), {maxRetry: 3}) ).code;
              callbackProgress(realm.cc,version,status);
              version++;  
          }while ( status == 404);   
       } else { version--; }         
    }
    firstQuery = false;
  }while(status == 200);

  return version;
}

module.exports.GetManifest = async (version, option = {}) => {
  
    const options = {
      cc: option.cc ?? 4
    };
    
    const realm = this.getRealm(options.cc);
    
    const fileInfoMap = await new Promise((resolve,reject) => {
        request.download(realm.url.fileInfo(version), TEMP)
        .then((file) => { return unzip(file.path) })
        .then((file) => { return fs.readFile(file,'utf16le') })
        .then((data) => { return parseInfoMap(data) })
        .then((data) => { return data.filter(({path : file}) => { if (file.includes(`l10n\\${realm.locale}\\sounds`) || (realm.cc === 0 && file.includes("sounds\\voice") && !file.endsWith("login.pak")) ) return true }) })
        .then((data) => { resolve(data) })
        .catch((err) => { reject(err); })  
    });
    
    const torrent = await new Promise((resolve,reject) => {
        request.download(realm.url.torrent(version), TEMP)
        .then((file) => { return unzip(file.path) })
        .then((file) => { return fs.readFile(file) })
        .then((data) => { return parseTorrent(data).files })
        .then((data) => { return data.map(file => file.path.toLowerCase()) })
        .then((data) => { return data.filter((file) => { if (file.includes(`l10n\\${realm.locale}\\sounds`) || (realm.cc === 0 && file.includes("sounds\\voice") && !file.endsWith("login.pak")) ) return true }) })
        .then((data) => { resolve(data) })
        .catch((err) => { reject(err); })
    });
  
    let manifest = [];
    
    for (let file of fileInfoMap)
    {
        file.url = [];
        let matches = torrent.filter(el => el.replace('patch\\zip\\','').replace(path.parse(el).ext,"") === file.path );
        for (let match of matches) file.url.push(match.replace(/\\/g,"/"));
        if (file.url.length === 0) throw "UNEXPECTED_FILE_HAS_NO_URL";
        manifest.push(file);
    }

    if (manifest.length === 0) throw "UNEXPECTED_MANIFEST_EMPTY";
  
    return manifest;
}

function parseInfoMap(data) {

   let result = data.split("\r\n").map((row) => {
                let column = row.split(":"); 
                return { path: column[0].toLowerCase(), size : column[1], sha1 : column[2], litestep : column[3] }
   });
       
  result.pop(); //Remove last empty line  
       
  return result;
  
}