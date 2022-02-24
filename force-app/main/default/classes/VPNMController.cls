public with sharing class VPNMController {
    @AuraEnabled
    public static Id getContactUserId(Id contactId) {
        User u = [SELECT Id FROM User WHERE ContactId = :contactId LIMIT 1];
        return u.Id;
    }
}