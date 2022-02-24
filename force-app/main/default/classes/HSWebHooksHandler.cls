@RestResource(urlMapping='/HSWebhooks/*')
global with sharing class HSWebHooksHandler  {

    @HttpGet
    global static void doGet() { 
        String result = '';
        RestRequest request = RestContext.request;
        String accountId = request.requestURI.substringAfter( '/HSWebhooks/' );
        List<Account> accs = [Select Id, Name from Account where Id = :accountId LIMIT 1];
        if (accs.size() > 0) {
            Account acc = accs[0];
            Map<String,String> resultMap = new Map<String,String> {
                'accountId' => acc.Id,
                'accountStatus' => acc.Name
            };

            result = JSON.serialize( resultMap );
        } else {
            result = 'Account with ID ' + accountId + ' not found123!';
        }

        RestContext.response.addHeader('Content-Type','application/json');
        RestContext.response.responseBody = Blob.valueOf(result);
    }

    @HttpPost
    global static void doPost() {
        
        RestRequest request = RestContext.request;
        system.debug('The request: ' + request.requestBody);
        Map<String, Object> bodyParsed = (Map<String, Object>) JSON.deserializeUntyped(request.requestBody.toString());
        system.debug('The request2: ' + bodyParsed);
        system.debug('The operation: ' + bodyParsed.get('operation'));

         /* Initialize variables */
         //String procedureName = 'HS_CreateEnrollment';
         String procedureName = 'HS_LeadCreate';
         Map<String, Object> ipInput = new Map<String, Object> ();
         Map<String, Object> ipOptions = new Map<String, Object> ();
         
         vlocity_ins.IntegrationProcedureService.runIntegrationService(procedureName, 
         bodyParsed, ipOptions);
    }    
}