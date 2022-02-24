public with sharing class GEN_ChartController {
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getClaims(){
        //return [SELECT SUM(annual_claims__c) annual_claims__c,SUM(annual_deductible__c) annual_deductible__c,SUM(out_of_pocket_maximum__c) out_of_pocket_maximum__c,plan_name__c FROM Asset WHERE (ContactId = '0033C00000SkK6YQAV') GROUP BY plan_name__c];
        return [SELECT SUM(Asset__r.annual_claims__c) annual_claims__c,SUM(Asset__r.annual_deductible__c) annual_deductible__c,SUM(Asset__r.out_of_pocket_maximum__c) out_of_pocket_maximum__c,Asset__r.plan_name__c FROM Contact WHERE (Asset__c = '02i3C000001hKkTQAU') GROUP BY Asset__r.plan_name__c];
    }
}