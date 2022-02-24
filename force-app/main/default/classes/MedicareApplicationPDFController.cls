/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 11-10-2021
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class MedicareApplicationPDFController {

    
    //public String currentapplicationId = System.currentPageReference().getParameters().get('applicationId');

  
    public String applicationId;
    public String applicationRecName {get;set;}
    public vlocity_ins__Application__c applicationRec{get;set;}

    public Contact contactRec{get;set;}


 
    
    //Address Billing or Shipping
    public String streetAddress {get;set;}
    public String secondStreetAddress {get;set;}
    public String cityAddress {get;set;}
    public String stateAddress {get;set;}
    public String postalCodeAddress {get;set;}


    public MedicareApplicationPDFController(){
        try{
            // Set page size for medical premium details table here
            applicationId = ApexPages.currentPage().getParameters().get('ApplicationId');
            
            dataFetch();

    
        }catch(Exception ex){
            system.debug('*****ERRROR IS..'+ex.getCause()+'*****'+ex.getMessage()+'*****'+ex.getLineNumber()+'*****'+ex.getTypeName()+'*****'+ex.getStackTraceString()); 
        }
    } 

    public void dataFetch(){
        try {
            
                                                    
            //Retrieve Applicaction
            applicationRec = [SELECT id, 
                            vlocity_ins__PrimaryContactId__c, vlocity_ins__PrimaryContactId__r.Name,  vlocity_ins__PrimaryContactId__r.Salutation, vlocity_ins__PrimaryContactId__r.FirstName, vlocity_ins__PrimaryContactId__r.LastName, vlocity_ins__PrimaryContactId__r.Title, vlocity_ins__PrimaryContactId__r.MailingStreet, vlocity_ins__PrimaryContactId__r.OtherAddress,vlocity_ins__PrimaryContactId__r.MailingCity, vlocity_ins__PrimaryContactId__r.MailingState, vlocity_ins__PrimaryContactId__r.MailingPostalCode,
                                vlocity_ins__PrimaryContactId__r.OtherStreet, vlocity_ins__PrimaryContactId__r.OtherCity, vlocity_ins__PrimaryContactId__r.OtherState, vlocity_ins__PrimaryContactId__r.OtherPostalCode, vlocity_ins__PrimaryContactId__r.vlocity_ins__MiddleName__c, vlocity_ins__PrimaryContactId__r.HomePhone, vlocity_ins__PrimaryContactId__r.Birthdate, vlocity_ins__PrimaryContactId__r.vlocity_ins__Gender__c, vlocity_ins__PrimaryContactId__r.MobilePhone, vlocity_ins__PrimaryContactId__r.Emergency_Contact__c, vlocity_ins__PrimaryContactId__r.Emergency_Phone__c, vlocity_ins__PrimaryContactId__r.Emergency_Relationship__c, vlocity_ins__PrimaryContactId__r.Primary_Phone__c,
                                vlocity_ins__AccountId__c, vlocity_ins__AccountId__r.Name, vlocity_ins__AccountId__r.BillingAddress,
                                Medi_App_Agreement_Date__c, vlocity_ins__AccountId__r.BillingStreet, vlocity_ins__AccountId__r.BillingCity, vlocity_ins__AccountId__r.BillingState, vlocity_ins__AccountId__r.BillingPostalCode, vlocity_ins__AccountId__r.County__c,
                                vlocity_ins__Product2Id__c,  vlocity_ins__Product2Id__r.Name, Medi_Requested_Effective_Date__c, Medicare_Number__c, Medi_Hospital_PartA__c, Medi_Medical_PartB__c, Medi_Other_PD_Cov__c,Medi_PD_Cov_Name__c, Medi_Medicaid_Number__c, Medi_PD_Cov_Id__c, Medi_PCP_FirstName__c, Medi_PCP_LastName__c, Medi_PCP_Number__c, Medi_PD_Cov_Group__c, Medi_PCP_Current_Patient__c, Medi_SEP_Reason__c, Medi_SEP_Date__c, Medi_Deduct_from_SSA_or_RRB__c,	Medi_SSA_RRB__c, Medi_Enrolled_Medicaid__c, vlocity_ins__QuoteId__r.TotalPrice, Req_Eff_Date__c



                        FROM vlocity_ins__Application__c
                        WHERE Id =: applicationId];
            

         
        }catch(Exception ex){
            system.debug('*****ERRROR IS..'+ex.getCause()+'*****'+ex.getMessage()+'*****'+ex.getLineNumber()+'*****'+ex.getTypeName()+'*****'+ex.getStackTraceString()); 
        }
    }
    // let birthdate = ((applicationRec.vlocity_ins__PrimaryContactId__r.Birthdate.getMonth() > 8) ? (applicationRec.vlocity_ins__PrimaryContactId__r.Birthdate.getMonth() + 1) : ('0' + (applicationRec.vlocity_ins__PrimaryContactId__r.Birthdate.getMonth() + 1))) + '-' + '01' + '-' + applicationRec.vlocity_ins__PrimaryContactId__r.Birthdate.getFullYear();
   
   

}