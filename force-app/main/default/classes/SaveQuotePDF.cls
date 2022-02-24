global without sharing class SaveQuotePDF implements vlocity_ins.VlocityOpenInterface2 {

	global Boolean invokeMethod(String methodName, Map<String,Object> inputMap, Map<String,Object> outMap, Map<String,Object> options) {        
        Boolean result = true;
        try{
            if(methodName.equals('saveQuoteDocument')) {
                saveQuoteDocument(inputMap, outMap, options);
            }
        } catch(Exception ex){
            System.debug('Cause:'+ex.getCause()+'\n Message '+ex.getMessage()+'\n trace'+ex.getStackTraceString());
            result = false;
        }
        return result;
    }

    global Boolean saveQuoteDocument(Map<String,Object> inputMap, Map<String,Object> outMap, Map<String,Object> options){
        
        String idQuote = (String)inputMap.get('quoteId');
        
        PageReference pref = page.ReviewYourQuotePDF;
        pref.getParameters().put('QuoteId', idQuote);
        pref.setRedirect(true);
        Blob bData=null;
        try{
            if(!Test.isRunningTest()){
            	bData = pref.getContentAsPDF();
            }else{
                blob.valueOf('Unit.Test');
				bData=blob.valueOf('Unit.Test');

            }
            System.debug('contentpdf' + bData);
                
            QuoteDocument quoteDoc = new QuoteDocument();
                
            quoteDoc.Document = bData;
            quoteDoc.QuoteId = idQuote;
            
            insert quoteDoc;
            
            return true;
        }catch(Exception e){
            System.debug('e' + e);
            return false;
        }
    }
}