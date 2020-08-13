/*
Information on the different version of the game Aion (region).
If you notice a mistake or know any of the missing information;
Please don't hesitate to share, thank you.
*/

"use strict";

const realms = {
  kr : {
    cc : 0,
    locale: "kor",
    url : {
      base : "http://aionkor.ncupdate.com/AION_KOR",
      fileInfo : function (version) {
        return `${this.base}/${version}/Patch/FileInfoMap_AION_KOR_${version}.dat.zip`;
      },
      torrent : function (version) {
        return `${this.base}/${version}/Patch/Full_AION_KOR_${version}.torrent.zip`;
      }
    },
    reg : {
      key: "PlayNC/AION_KOR",
      name: "BaseDir"
    },
    displayName: "Aion KR",
    publisher: "PlayNC"
  },
  na : {
    cc : 1,
    locale: "enu",
    url : {
      base : "http://aion.patcher.ncsoft.com/AION",
      fileInfo : function (version) {
        return `${this.base}/${version}/Patch/FileInfoMap_AION_${version}.dat.zip`;
      },
      torrent : function (version) {
        return `${this.base}/${version}/Patch/Full_AION_${version}.torrent.zip`;
      }
    },
    reg : {
      key: "NCWEST/AION",
      name: "BaseDir"
    },
    displayName: "Aion NA",
    publisher: "NCWest"
  }, 
  eu : {
    cc : 2,
    locale: ["eng","fra","deu","esn","ita","plk"],
    url : {
      base : "http://dl.aion.gameforge.com/aion/AION-LIVE",
      fileInfo : function (version) {
        return `${this.base}/${version}/Patch/FileInfoMap_AION-LIVE_${version}.dat.zip`;
      },
      torrent : function (version) {
        return `${this.base}/${version}/Patch/Full_AION-LIVE_${version}.torrent.zip`;
      }
    },
    reg : {
      key:  "Gameforge/AION-LIVE",
      name: "BaseDir",
    },
    steam: { 
      appid: 261430,
      dir: "AION/client"
    },
    displayName: "Aion EU",
    publisher: "Gameforge"
  },
  jp : {
    cc : 4,
    locale: "jpn",
    url : {
      base : "http://aionrepository.ncsoft.jp/AION_JP",
      fileInfo : function (version) {
        return `${this.base}/${version}/Patch/FileInfoMap_AION_JP_${version}.dat.zip`;
      },
      torrent : function (version) {
        return `${this.base}/${version}/Patch/Full_AION_JP_${version}.torrent.zip`;
      }
    },
    reg : {
      key:  "PlayNC/AION_JP",
      name: "BaseDir",
    },
    displayName: "Aion JP",
    publisher: "PlayNC"
  },
  cn : { //Probably out of date and missing url
    cc : 5, //correct cc ?
    locale: "chs",
    reg : {
      key:  "shandagames/\u{6C38}\u{6052}\u{4E4B}\u{5854}", //永恒之塔
      name: "Path",
    },
    displayName: "Aion CN",
    publisher: "Shandagames"
  },
  ru : { //Probably out of date and missing url
    cc : 7, //correct cc ?
    locale: "rus",
    reg : {
      key:  "4game/4gameservice/Games/Aion",
      name: "path",
    },
    displayName: "Aion RU",
    publisher: "4Game"
  }
};

module.exports = realms;