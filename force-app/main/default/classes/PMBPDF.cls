public with sharing class PMBPDF {

    public String currentAccountId = System.currentPageReference().getParameters().get('AccountId');
    public String currentQuoteId   = System.currentPageReference().getParameters().get('QuoteId');

    public PMBPDF() {

    }

    public List<QuoteLineItem> getQuoteLineItems() {

        System.debug('Inside getQuoteLineItems');
        List<QuoteLineItem> qlis = [SELECT id, Product2.Name, Generic_Proposed_IC_Discount__c, Generic_Proposed_DF_RX__c, Brand_Proposed_IC_Discount__c,
                                           Generic_Billable_Guarantee_DF__c, Brand_Billable_Guarantee_DF__c, Brand_Proposed_DF_RX__c, Brand_Risk_Spread_DF__c,
                                           Generic_Risk_Spread_DF__c, Brand_Billable_Guarantee_IC__c, Generic_Billable_Guarantee_IC__c, Brand_Risk_Spread_IC__c,
                                           Generic_Risk_Spread_IC__c
                                      FROM QuoteLineItem
                                     WHERE QuoteId =: this.currentQuoteId
                                     ORDER BY Product2.Name ASC];

        return qlis;

    }

    public Account getAccountInformation() {

        System.debug('Current account: ' + this.currentAccountId);
        Account account = [SELECT id, Name, BillingStreet, BillingCity, BillingState, BillingPostalCode
                             FROM Account
                            WHERE Id =: this.currentAccountId];

        return account;

    }

    public Quote getQuoteInformation() {

        String currentQuoteId = System.currentPageReference().getParameters().get('QuoteId');
        System.debug('Current quote: ' + this.currentQuoteId);

        Quote quote = [SELECT id, Name, vlocity_ins__EffectiveDate__c, CreatedDate
                         FROM Quote
                        WHERE id =: this.currentQuoteId];

        return Quote;

    }

}