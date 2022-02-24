({
	init : function(cmp, event, helper) {
        const contactId = cmp.get("v.recordId");
        
        const action = cmp.get("c.getContactUserId");
        action.setParams({ contactId });
        action.setCallback(this, function(response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                const userId = response.getReturnValue();
                cmp.find("navService").navigate({ 
                    type: "standard__component", 
                    attributes: {
                        componentName: 'vlocity_ins__vlocityLWCOmniWrapper'
                    },
                    state: {
                        c__target: 'c:vPNMProviderCredentialingApplicationPortalUserEnglish',
                        c__layout: 'lightning',
                        c__ContextId: contactId
                    }
                });
            } else if (state === "ERROR") {
                const errors = response.getError();
                if (errors && errors[0] && errors[0].message) {
                    console.log("Error message: " + errors[0].message);
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);        
    }
})