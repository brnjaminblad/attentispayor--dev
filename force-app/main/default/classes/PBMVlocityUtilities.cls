global with sharing class PBMVlocityUtilities implements vlocity_ins.VlocityOpenInterface2 {

    public PBMVlocityUtilities() {

    }

    public Boolean invokeMethod(String methodName, Map<String,Object> inputMap, Map<String,Object> outMap, Map<String,Object> options) {

        Boolean result = true;
        try {            
            if(methodName.equals('attachQuotePDF')) {
                attachQuotePDF(inputMap, outMap, options);
            }
        } catch(Exception ex) {
            System.debug('Cause: '+ ex.getCause() + '\n Message '+ ex.getMessage() + '\n trace: ' + ex.getStackTraceString());
            result = false;
        }
        
        return result;

    }

    public Boolean attachQuotePDF(Map<String,Object> inputMap, Map<String,Object> outMap, Map<String,Object> options) {

        system.debug('Init execution AccountIdSearch: ' + (String)inputMap.get('AccountIdSearch'));
        
        PageReference pdf = Page.PBMPDF;

        String accountId = inputMap.get('AccountIdSearch') != null && inputMap.get('AccountIdSearch') != '' ? (String)inputMap.get('AccountIdSearch') : (String)inputMap.get('AccountIdCreated');
        
        pdf.getParameters().put('AccountId', accountId);
        pdf.getParameters().put('QuoteId', (String)inputMap.get('QuoteId'));

        Blob body = pdf.getContentAsPDF();
        Quote quoteNumber = [SELECT QuoteNumber
                               FROM Quote
                              WHERE id =: (String)inputMap.get('QuoteId') ];

        Attachment attachQuote = new Attachment();
        attachQuote.Body = body;
        attachQuote.Name = 'Quote - ' + quoteNumber.QuoteNumber;
        attachQuote.ParentId = (String)inputMap.get('QuoteId');
        insert attachQuote;

        Attachment attachCase = new Attachment();
        attachCase.Body = body;
        attachCase.Name = 'Quote - ' + quoteNumber.QuoteNumber;
        attachCase.ParentId = (String)inputMap.get('CaseId');
        insert attachCase;

        Attachment attachContract = new Attachment();
        attachContract.Body = body;
        attachContract.Name = 'Quote - ' + quoteNumber.QuoteNumber;
        attachContract.ParentId = (String)inputMap.get('ContractId');
        insert attachContract;

        system.debug('Finished execution');
        return true;
        
    }

}