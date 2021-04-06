> Change the voice acting of your Aion client into sweet Japanese or Korean.

💡 If you are just looking for the Aion Japanese / Korean voice pack go to the [release section](https://github.com/xan105/Aion-Japanese-Voice-Pack/releases).

😎 If you want to fetch the latest audio files directly from the Japanese / Korean update server then continue reading.

<hr> 

This is a Node.js script _inspired by / copied from_ my previous work with my alternative [Aion Launcher](https://github.com/xan105/Aion-Launcher) to fetch audio files directly from the game update server.

You will need Node.js (≥ 14) and NPM installed : https://nodejs.org/en/

<p align="center">
  <img src="https://github.com/xan105/Aion-Japanese-Voice-Pack/raw/master/screenshot/aion%20voice%20pack.png">
</p>

Get the script
==============

To get everything and its dependencies :

```
git clone https://github.com/xan105/Aion-Japanese-Voice-Pack
cd Aion-Japanese-Voice-Pack
npm i
```

Configure
=========

Modify `option.json` to suit your needs :

- cc : Japanese is `4`, Korean is `0` (default to 4). Region info are in `aion/cc.js`
- dest : `"path/where/to/create/voicepack"` (default to "./voicepack/[_realm.locale_]" if omitted)
- prefix: "a-z" Use `"z"` to prefix every files with the letter z so you can use the files with official launcher, etc (file check bypass). If omitted doesn't add any prefix (default).
- patch : true/false (default true) Recommended to use `true` so the voice order matches Aion NA/EU. (Only for Japanese Pack)

NB: `%temp%\Aion Voice Pack` is used as temporary folder (downloading, extracting, patching). 
If you want to change that edit both `aion/voicepack.js` and `aion/aion.js`
There is a `const TEMP = ...` in the top of the file.

### Some examples:

- Download and update Japanese Pack directly to your Aion folder

`{"cc": 4, dest: "C:\\Game\\Aion\L10N\\ENU\\Sounds",prefix: "z", patch: true }`

- Download raw Japanese Pack in the folder "voicepack"

`{"cc": 4, dest: "./voicepack", patch: false }`

- Download Korean Pack in Aion EU (FRA) folder

`{"cc": 0, dest: "G:\\Steam\\steamapps\\common\\Aion\\client\\L10N\\FRA\\Sounds",prefix: "z" }`

- Download English NA Pack in the folder "voicepack/na"

`{"cc": 1}`

Run
===

`node main.js`

NB: You can also use it to update an existing voice pack : file that already exists and have the same hash are skipped from any download.

Legal
=====

Software provided here is to be use at your own risk. This is provided as is without any express or implied warranty. In no event or circumstances will the authors or company 
be held liable for any damage to yourself or your computer that may arise from the installation or use of the materials provided.
As well as for anything that may occur as a result of your use, or inability to use said provided materials and associated documentation.
We accept no responsibilities in case your Aion provider decides to suspend your Aion account.

© 2009 NCSOFT Corporation. NCJapan K.K. The Tower of AION™, AION ® is a trademark of NCSOFT Corporation. 
This Voice Pack is not affiliated nor associated with NCSOFT Corporation, NCJapan K.K. 
No copyright or trademark infringement is intended in using The Tower of AION™, AION ® content.    
Other trademarks are the property of their respective owners.
