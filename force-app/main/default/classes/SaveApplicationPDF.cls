global without sharing class SaveApplicationPDF implements vlocity_ins.VlocityOpenInterface2 {

	global Boolean invokeMethod(String methodName, Map<String,Object> inputMap, Map<String,Object> outMap, Map<String,Object> options) {        
        Boolean result = true;
        try{
            if(methodName.equals('saveApplicationDocument')) {
                saveApplicationDocument(inputMap, outMap, options);
            }
        } catch(Exception ex){
            System.debug('Cause:'+ex.getCause()+'\n Message '+ex.getMessage()+'\n trace'+ex.getStackTraceString());
            result = false;        
        }
        return result;        
    }

    global Boolean saveApplicationDocument(Map<String,Object> inputMap, Map<String,Object> outMap, Map<String,Object> options){
        String idApplication = (String)inputMap.get('applicationId');
        
        PageReference pref = page.MedicareApplicationPDF;
        pref.getParameters().put('ApplicationId', idApplication);
        pref.setRedirect(true);
        Blob bData=null;
        bData = pref.getContentAsPDF();
        ContentDocumentLink applicationDoc = new ContentDocumentLink();
        Attachment attach = new Attachment();
        applicationDoc.LinkedEntityId = idApplication;
        
        
        applicationDoc.ShareType = 'V';
        applicationDoc.Visibility = 'AllUsers';
        // applicationDoc.Document = bData;
        // applicationDoc.ApplicationId = idApplication;
        
        insert applicationDoc;
        insert attach;
        
        return true;
    }

    public boolean UploadContent(Map < String, Object > inputs, Map < String, Object > output, Map < String, Object > options){
        try{
        Id enrollId = (Id)inputs.get('EnrollmentId');
        Boolean hasDoc= (Boolean)inputs.get('HasDocument');
        set<id> contentVersionId = new set<id>();
        Integer existingPDF = [SELECT count() FROM ContentDocumentLink WHERE LinkedEntityId =: enrollId];
        if(existingPDF > 0){
        delete [SELECT Id FROM ContentDocumentLink WHERE LinkedEntityId =: enrollId];
        }
        System.debug('Enroll Id: '+enrollId);
        if(hasDoc){
        Map<String,object> lContentVersion = (Map<String,object>)inputs.get('DR-L-ContentVersion-Medicare');
        List<Object> uploadDocList = (List<Object>)lContentVersion.get('ContentVersion_1');
        for(Object obj:uploadDocList){
        Map<String,object> fileData = (Map<String,Object>)obj;
        contentVersionId.add(fileData.get('Id')+'');
        }
        
        for(ContentVersion contentver:[SELECT ContentDocumentId FROM ContentVersion WHERE Id in:contentVersionId]){
        //Create ContentDocumentLink
        ContentDocumentLink cdl = New ContentDocumentLink();
        cdl.LinkedEntityId = enrollId;
        cdl.ContentDocumentId = contentver.ContentDocumentId;
        cdl.ShareType = 'V';
        cdl.Visibility = 'AllUsers';
        Insert cdl;
        }
        }
        return true;
        }
        catch(Exception e){
        output.put('error',e.getMessage());
        return false;
        }
        }
        private Boolean updateDocumentMedicareContact (Map<String, Object> input, Map<String, Object> outMap,Map<String, Object> options){
            Boolean result = true;
            try {
                //Scope of apointment document uploaded on medicare, should be associated with the contact.
                //In case back and forth, we delete the previous one 
                Id enrollId = (Id) input.get('EnrollmentId');
                Map<String, Object> getAppHelp = (Map<String, Object>)input.get('ApplicantInformation');
                Id contactId =(Id) getAppHelp.get('ContactId');
                Map<String, Object> getApplicantHelp = (Map<String, Object>)input.get('ApplicantHelp');
                Boolean hasScopeAttachment =(Boolean) getApplicantHelp.get('ScopeOfAppointment');
                Id contentId;
                
                
                if(hasScopeAttachment){
                    List<Object>jads=(List<Object>)getApplicantHelp.get('ScopeOfAppointmentFile');
                    Map<String, Object> getScope2 = (Map<String, Object>)jads[0];
                    contentId =(Id) getScope2.get('contentDocumentId');    
                
                    List<ContentDocument> dcWithId=[Select Id FROM ContentDocument WHERE Id=:contentId ];
                    if(dcWithId.size()>0){
                        List<contentDocumentLink> clInit=[Select id, contentDocumentId, ShareType, LinkedEntityId FROM contentDocumentLink Where contentDocumentId=:dcWithId[0].Id AND LinkedEntityId=:contactId];
                        if(clInit.size()>0){
                            delete clInit;
                        }
                        //Create ContentDocumentLink 
                        ContentDocumentLink cdl = New ContentDocumentLink();
                        cdl.LinkedEntityId = contactId;
                        cdl.ContentDocumentId = contentId;
                        cdl.ShareType = 'V';
                        cdl.Visibility = 'AllUsers';
                        Insert cdl;                           
                    }
                }
                result=true;
                
            } catch (Exception e) {
                result = false;
                System.debug(e);
                System.debug(LoggingLevel.ERROR, 'Error in line ' + e.getLineNumber());
                outMap.put('error', e.getMessage());
                outMap.put('errorLineNumber', e.getLineNumber());
            }
            return result;
    
        }
}