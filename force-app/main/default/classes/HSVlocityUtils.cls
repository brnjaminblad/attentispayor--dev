global with sharing class HSVlocityUtils implements vlocity_ins.VlocityOpenInterface2 {

    public HSVlocityUtils() {

    }

    public Boolean invokeMethod(String methodName, Map<String,Object> inputMap, Map<String,Object> outMap, Map<String,Object> options) {

        Boolean result = true;
        try {            
            if(methodName.equals('createApplication')) {
                createApplication(inputMap, outMap, options);
            }
        } catch(Exception ex) {
            System.debug('Cause: '+ ex.getCause() + '\n Message '+ ex.getMessage() + '\n trace: ' + ex.getStackTraceString());
            result = false;
        }
        
        return result;

    }

    public Boolean createApplication(Map<String,Object> inputMap, Map<String,Object> outMap, Map<String,Object> options) {
        
        // Get the attributes from Health Sherpa
        String userName = 'staging-user';
        String password = '9u76mDeRdKhkuZ8mGCeP';
        Http http = new Http();
        HttpRequest httpRequest = new HttpRequest();
        httpRequest.setMethod('GET');
        //httpRequest.setEndpoint('https://healthsherpa-nl-sfdc-de-m47wfh.herokuapp.com/sso/tests/create_managed_app?carrier_id=sfdc');
        //httpRequest.setEndpoint('https://staging.healthsherpa.com/sso/tests/create_managed_app?carrier_id=sfdc');
        httpRequest.setEndpoint('https://healthsherpa-nl-sfdc-de-kft1tm.herokuapp.com/sso/tests/create_managed_app?carrier_id=sfdc');
        Blob headerValue = Blob.valueOf(userName + ':' + password);
        String authorizationHeader = 'Basic ' + EncodingUtil.base64Encode(headerValue);
        httpRequest.setHeader('Authorization', authorizationHeader);
        httpRequest.setTimeout(120000);

        HttpResponse response = http.send(httpRequest);
        String responseString = (String)response.getBody();

        System.debug('Response: '+ responseString);

        List<String> attributeList = responseString.split('\n');
        String apiToken = '0dbc23050d273e5cf90cc99db39de377';
        String timestamp;
        String firstName = 'Test';
        String lastName = 'Consumer';
        String dob = '1985-01-01';
        String ssn = '317201410';
        String StreetAddress = '123 M St';
        String city = 'Townsville';
        String state = 'FL';
        String zipCode = '33604';
        String fipCode = '12057';
        String email;
        String phone;
        String externalUserId;
        String userType = 'consumer';
        String returnTo = 'http%3A%2F%2Fwww.google.com';
        String signature;

        for (String currentAttribute : attributeList){
            if (currentAttribute.contains('timestamp')) {
                timestamp = currentAttribute.substring(currentAttribute.lastIndexOf('="') + 2, currentAttribute.lastIndexOf('"'));
            }
            if (currentAttribute.contains('email')) {
                email = currentAttribute.substring(currentAttribute.lastIndexOf('="') + 2, currentAttribute.lastIndexOf('"'));
            }
            if (currentAttribute.contains('phone')) {
                phone = currentAttribute.substring(currentAttribute.lastIndexOf('="') + 2, currentAttribute.lastIndexOf('"'));
            }
            if (currentAttribute.contains('signature')) {
                signature = currentAttribute.substring(currentAttribute.lastIndexOf('="') + 2, currentAttribute.lastIndexOf('"'));
            }
            if (currentAttribute.contains('external_user_id')) {
                externalUserId = currentAttribute.substring(currentAttribute.lastIndexOf('="') + 2, currentAttribute.lastIndexOf('"'));
            }
        }

        System.debug('timestamp: '      + timestamp);
        System.debug('email: '          + email);
        System.debug('phone: '          + phone);
        System.debug('signature: '      + signature);
        System.debug('externalUserId: ' + externalUserId);

        // Post to create the Application
        Http httpPost = new Http();
        HttpRequest httpPostRequest = new HttpRequest();
        httpPostRequest.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        httpPostRequest.setMethod('POST');
        //httpPostRequest.setEndpoint('https://healthsherpa-nl-sfdc-de-m47wfh.herokuapp.com/ede/applications');
        //httpPostRequest.setEndpoint('https://staging.healthsherpa.com/ede/applications');
        httpPostRequest.setEndpoint('https://healthsherpa-nl-sfdc-de-kft1tm.herokuapp.com/ede/applications');
        String body = 'api_token=' + EncodingUtil.urlEncode(apiToken,'UTF-8')
                    + '&timestamp=' + EncodingUtil.urlEncode(timestamp,'UTF-8')
                    + '&first_name=' + EncodingUtil.urlEncode(firstName,'UTF-8')
                    + '&last_name=' + EncodingUtil.urlEncode(lastName,'UTF-8')
                    + '&date_of_birth=' + EncodingUtil.urlEncode(dob,'UTF-8')
                    + '&ssn=' + EncodingUtil.urlEncode(ssn,'UTF-8')
                    + '&street_address=' + EncodingUtil.urlEncode(streetAddress,'UTF-8')
                    + '&city=' + EncodingUtil.urlEncode(city,'UTF-8')
                    + '&state=' + EncodingUtil.urlEncode(state,'UTF-8')
                    + '&zip_code=' + EncodingUtil.urlEncode(zipCode,'UTF-8')
                    + '&fip_code=' + EncodingUtil.urlEncode(fipCode,'UTF-8')
                    + '&email=' + EncodingUtil.urlEncode(email,'UTF-8')
                    + '&phone=' + EncodingUtil.urlEncode(phone,'UTF-8')
                    + '&external_user_id=' + EncodingUtil.urlEncode(externalUserId,'UTF-8')
                    + '&user_type=' + EncodingUtil.urlEncode(userType,'UTF-8')
                    + '&return_to=' + EncodingUtil.urlEncode(returnTo,'UTF-8')
                    + '&signature=' + EncodingUtil.urlEncode(signature,'UTF-8');
        System.debug('The body: ' + body);
        httpPostRequest.setBody(body);
        httpPostRequest.setTimeout(120000);

        HttpResponse postResponse = httpPost.send(httpPostRequest);
        String responsePostString = (String)postResponse.getBody();
        System.debug('The post response: ' + responsePostString);

        outMap.put('applicationId' , responsePostString);
        outMap.put('timestamp'     , EncodingUtil.urlEncode(timestamp,'UTF-8'));
        outMap.put('apitoken'      , EncodingUtil.urlEncode(apitoken,'UTF-8'));
        outMap.put('signature'     , EncodingUtil.urlEncode(signature,'UTF-8'));
        outMap.put('usertype'      , EncodingUtil.urlEncode(userType,'UTF-8'));
        outMap.put('externaluserid', EncodingUtil.urlEncode(externalUserId,'UTF-8'));
        outMap.put('returnto'      , EncodingUtil.urlEncode(returnTo,'UTF-8'));

        return true;
        
    }

}