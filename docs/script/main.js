import request from "./lib/request-zero/fetch.js"

(function($, window, document) {
   $(function() { 

      $("#menu li[data-link='legal'] .menu_item").click(function(){
          let self = $(this);
          self.css("pointer-events","none");
          self.parent("li").addClass("active");
          $("#legal").fadeIn(600,()=>{
            self.css("pointer-events","initial");
          });
      });

      $("#legal .overlay").click(function(){
          let self = $(this);
          self.css("pointer-events","none");
          $("#menu li[data-link='legal']").removeClass("active");
          $("#legal").fadeOut(600,()=>{
            self.css("pointer-events","initial");
          });
      });
      
      const url = `https://api.github.com/repos/xan105/Aion-Japanese-Voice-Pack/releases/latest`;
      request(url,{cache: "default", headers: {"Accept" : "application/vnd.github.v3+json"}}).then((res) => {
        const github = JSON.parse(res.body);
        
        const date = new Date(github.published_at).toLocaleDateString();
        $("#github-last-update-date").text(date);
        $("#github-last-update").show();
        
      }).catch(()=>{
        $("#github-last-update").hide();
      });

  });  
}(window.jQuery, window, document));