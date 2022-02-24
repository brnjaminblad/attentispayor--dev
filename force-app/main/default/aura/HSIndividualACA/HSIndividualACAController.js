({
    doInit: function(cmp) {
         
      setTimeout(() => {
  
               $A.get("e.force:closeQuickAction").fire();
  
           }, 1000);
  
      var urlEvent = $A.get("e.force:navigateToURL");
    
     urlEvent.setParams({
       // "url": "/lightning/cmp/vlocity_ins__vlocityLWCOmniWrapper?c__target=c:pBMQuoteEnglish&c__layout=newport&c__tabIcon=custom:custom18"
        //"url": "/lightning/cmp/vlocity_ins__vlocityLWCOmniWrapper?c__target=c:healthSherpaFlowEnglish&c__layout=newport&c__tabIcon=custom:custom18"
        "url": "/lightning/cmp/vlocity_ins__vlocityLWCOmniWrapper?c__target=c:healthSherpaIndividualACAFlowEnglish&c__layout=newport&c__tabIcon=custom:custom18"
     });
       urlEvent.fire();
                   //var dismissActionPanel = $A.get("e.force:closeQuickAction");
                   //dismissActionPanel.fire();
       
         
      }
     
  })