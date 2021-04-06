import request from "./lib/request/fetch.js"
import { DOMReady, select } from "./lib/vanilla-query/vanilla.js"

DOMReady(()=>{

  select("#menu li[data-link='legal'] .menu_item").click(function(){     
     let self = this; 
     self.css("pointer-events","none");
     self.parent("li").addClass("active");
     select("#legal").fadeIn(600).then(()=>{
        self.css("pointer-events","initial");
     });
  });
  
  select("#legal .overlay").click(function(){
     let self = this;
     self.css("pointer-events","none");
     select("#menu li[data-link='legal']").removeClass("active");
     select("#legal").fadeOut(600).then(()=>{
        self.css("pointer-events","initial");
     });
  });
  
  request("https://api.github.com/repos/xan105/Aion-Japanese-Voice-Pack/releases/latest",{cache: "default", headers: {"Accept" : "application/vnd.github.v3+json"}})
  .then((res) => {
    const github = JSON.parse(res.body);
    const date = new Date(github.published_at).toLocaleDateString();
    select("#github-last-update-date").text(date);
    select("#github-last-update").show();    
  }).catch(()=>{
    select("#github-last-update").hide();
  });

});