public with sharing class AccountControllerTest {
    public AccountControllerTest() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {

        //throw new AuraHandledException('Forced error');

        return [
            SELECT Name, Id
            FROM Account
            WITH SECURITY_ENFORCED
            limit 20
       ];
    }

}