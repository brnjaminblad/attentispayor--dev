/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 11-10-2021
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class ReviewYourQuotePDFController {

    
    //public String currentQuoteId = System.currentPageReference().getParameters().get('QuoteId');

    public List<QuoteLineItem> qliList{get;set;}
    public String quoteId;
    public String letter{get;set;}
    public String quoteName {get;set;}
    public String quoteRecName {get;set;}
    public Date quoteEffectiveDate {get; set;}
    public Quote quoteRec{get;set;}

    //New atrtribute for JSON Deserialize 
    public Map<String, List<String> >  mapCovCodeProductList {get;set;}
    public Map<String, String> covCode {get;set;}
    public Set<String> productsIds =  new Set<String>();
    public Map<String,List<CoverageItem> > coverageAttrList{get;set;}
    public Map<String,List<CoverageItem> > attributeAttrList{get;set;}
    public Map<String, String> coverageCodeLabel {get;set;}
    public Map<String, String> attributeCodeLabel {get;set;}
    public User brokerUser {get; set;}
    public String county {get; set;}

    // List of indexes to divide medical tables
    public List<Integer> medicalSplitIndexes {get; private set;}
    // Max Plan size for medical list
    public Integer maxMedicalTablePlans {get; private set;}

    //Customer Order for Attributes & Coverages
    public List<String> coveragesCustomOrder {get;set;}
    public List<String> attributeCustomOrder {get;set;}

    //Custom Compare Plans
    public Integer repeatMedicalPlans {get; set;} 
    public Integer qliSize {get; set;}
    public Integer qlisMedicalSize {get; set;}
    
    //Address Billing or Shipping
    public String streetAddress {get;set;}
    public String secondStreetAddress {get;set;}
    public String cityAddress {get;set;}
    public String stateAddress {get;set;}
    public String postalCodeAddress {get;set;}


    public ReviewYourQuotePDFController(){
        try{
            // Set page size for medical premium details table here
            maxMedicalTablePlans = 4;
            letter = ApexPages.currentPage().getParameters().get('letter');
            quoteId = ApexPages.currentPage().getParameters().get('QuoteId');
            Boolean isSalesUser = false;
            String isEHorCCIRenewal = '';

            dataFetch();

            if (!String.isBlank(quoteName)) {
                // Set filename for download
                List<String> nameParts = quoteName.split(' ');
                List<String> encodedParts = new List<String>();
                for (String s : nameParts) {
                    encodedParts.add(EncodingUtil.urlEncode(s, 'UTF-8'));
                }
                Apexpages.currentPage().getHeaders().put('content-disposition', 'inline; filename=' + String.join(encodedParts, ' ') + '.pdf');
            }
        }catch(Exception ex){
            system.debug('*****ERRROR IS..'+ex.getCause()+'*****'+ex.getMessage()+'*****'+ex.getLineNumber()+'*****'+ex.getTypeName()+'*****'+ex.getStackTraceString()); 
        }
    } 

    public void dataFetch(){
        try {
            productsIds = new Set<String>();
            covCode = new Map<string, String>();
            coveragesCustomOrder = new List<String>();
                                                        
            coverageCodeLabel = New Map<String,String>{ 'MEDICAREBENEFITS' => 'Benefits', 'MEDIDRUGCOV' => 'Drug Coverage',
                                                        'PRFRRDRTL30' => 'Preferred Retail (30-day supply)', 'STNDRDRTL30' => 'Standard Retail (30-day supply)', 
                                                        'MLORDR30' => 'Mail Order (30-day supply)', 'MLORDR90' => 'Mail Order (90-day supply)'};

  
            //Retrieve Quote
            quoteRec = [SELECT id, QuoteNumber, vlocity_ins__EffectiveDate__c, CreatedDate,
                            QuoteToStreet, QuoteToCity, QuoteToState, QuoteToPostalCode,
                            ContactId, Contact.Name, Contact.MailingStreet, Contact.MailingCity, Contact.MailingState, Contact.MailingPostalCode,
                                Contact.OtherStreet, Contact.OtherCity, Contact.OtherState, Contact.OtherPostalCode,
                            AccountId, Account.Name, Account.BillingStreet, Account.BillingCity, Account.BillingState, Account.BillingPostalCode,
                                Account.ShippingStreet, Account.ShippingCity, Account.ShippingState, Account.ShippingPostalCode,
                            Account.County__c
                        FROM Quote
                        WHERE Id =: quoteId];

            //Retrieve Quote Line Items
            qliList = [SELECT id, CreatedDate, UnitPrice,
                            vlocity_ins__ProductName__c, vlocity_ins__Type__c,
                            vlocity_ins__JSONAttribute__c, 	vlocity_ins__AttributesData__c, vlocity_ins__AttributeSelectedValues__c,
                            Product2Id, Product2.ProductCode, Product2.Name
                    FROM QuoteLineItem WHERE QuoteId =: quoteId AND vlocity_ins__Type__c ='Medical'
                    ORDER BY vlocity_ins__ProductName__c ASC];

            
            //Final Address - From Quote
            if(quoteRec.QuoteToStreet != null){
                streetAddress = quoteRec.QuoteToStreet;
            }else if(quoteRec.Contact.MailingStreet != null){
                streetAddress = quoteRec.Contact.MailingStreet;
            }else if(quoteRec.Account.ShippingStreet != null){
                streetAddress = quoteRec.Account.ShippingStreet;
            }else if(quoteRec.Account.BillingStreet != null){
                streetAddress = quoteRec.Account.BillingStreet;
            }

            if(quoteRec.Contact.OtherStreet != null){
                secondStreetAddress = quoteRec.Contact.OtherStreet;
            }

            if(quoteRec.QuoteToCity != null){
                cityAddress = quoteRec.QuoteToCity;
            }else if(quoteRec.Contact.MailingCity != null){                     
                cityAddress = quoteRec.Account.ShippingCity;
            }else if(quoteRec.Account.ShippingCity != null){                     
                cityAddress = quoteRec.Account.ShippingCity;
            }else if(quoteRec.Account.BillingCity != null){
                cityAddress = quoteRec.Account.BillingCity;
            }

            if(quoteRec.QuoteToState != null){
                stateAddress = quoteRec.QuoteToState;
            }else if(quoteRec.Contact.MailingState != null){
                stateAddress = quoteRec.Contact.MailingState;
            }else if(quoteRec.Account.ShippingState != null){
                stateAddress = quoteRec.Account.ShippingState;
            }else if(quoteRec.Account.BillingState != null){
                stateAddress = quoteRec.Account.BillingState;
            }

            if(quoteRec.QuoteToPostalCode != null){
                postalCodeAddress = quoteRec.QuoteToPostalCode;
            }else if(quoteRec.Contact.OtherPostalCode != null){
                postalCodeAddress = quoteRec.Contact.OtherPostalCode;
            }else if(quoteRec.Account.ShippingPostalCode != null){
                postalCodeAddress = quoteRec.Account.ShippingPostalCode;
            }else if(quoteRec.Account.BillingPostalCode != null){
                postalCodeAddress = quoteRec.Account.BillingPostalCode;
            }


            for(QuoteLineItem qliTemp : qliList){
                productsIds.add(qliTemp.Product2Id);
            }


            //For 2021 Products
            attributeCustomOrder = new List<String> {'PRMRYCRPHYSCVST','SPCLSTOFFCVST','MEDDED','PRESDRCO','DEN','TELEHEALTH','FAD','VDC','EVCOV'};
            coveragesCustomOrder = new List<String> {'MEDICAREBENEFITS', 'MEDIDRUGCOV','PRFRRDRTL30', 'STNDRDRTL30', 'MLORDR30', 'MLORDR90'};
            
            //Call Method to Extract from Custom Fields with JSON Product Structure by Vlocity
            //Coverage (Compiled Attribute ) and Product2 Fields are needed to Desarialize Correctly

            createMappingFromJSONForAttributes();
            createMappingFromJSON();

            
            //Retrive number of files repeats
            qliSize = qliList.size();
            Integer sizeRepeat = 4;
            Decimal countRowsMedical;
            if(!(qlisMedicalSize > 0)){
                qlisMedicalSize = qliSize;
                countRowsMedical = ((Decimal) qliSize) / sizeRepeat;
                repeatMedicalPlans = (Integer)countRowsMedical.round(System.RoundingMode.UP);
            }else{
                countRowsMedical = ((Decimal) qlisMedicalSize) / sizeRepeat;
                repeatMedicalPlans = (Integer)countRowsMedical.round(System.RoundingMode.UP);
            } 
        }catch(Exception ex){
            system.debug('*****ERRROR IS..'+ex.getCause()+'*****'+ex.getMessage()+'*****'+ex.getLineNumber()+'*****'+ex.getTypeName()+'*****'+ex.getStackTraceString()); 
        }
    }

    public void createMappingFromJSONForAttributes(){ 
        try {
            Map<String, String> covCodeValues = new Map<string, String>();
            //Map Coverage Attribute Code + Product Id as Key - with value as return
            mapCovCodeProductList = new Map<String, List<String>>();
            //Map to Manage Attributes Values directly from Tab Attrbutes Products
            attributeAttrList = new Map<String,List<CoverageItem>>();
            for(Product2 prod : [Select Id,vlocity_ins__AttributeDefaultValues__c,vlocity_ins__AttributeMetadata__c From Product2 Where Id IN :productsIds]){
                Map <String, Object> attributesPerCoverage = (map<String, Object>) JSON.deserializeUntyped(prod.vlocity_ins__AttributeMetadata__c);
                Map <String, Object> attsPerCoverageWithCodeValue = (map<String, Object>) JSON.deserializeUntyped(prod.vlocity_ins__AttributeDefaultValues__c);

                List<Object> recordsList = (List<Object>) attributesPerCoverage.get('records');

                for(Object o : recordsList){
                    Map <String, Object> coverage = (Map<String, Object>) o ;
                    Integer dSequence = Integer.valueOf(coverage.get('displaySequence'));
                    Map <String, Object> recordAttributePerCoverage = (Map<String, Object>)coverage.get('productAttributes');
                    List<Object> recordsFromAttributes = (List<Object>)recordAttributePerCoverage.get('records');                            
                    //Map with Attribute Code and Attribute Label
                    //Sample: Specialist_Office_Visit - > Specialist Office Visit
                    for(Object attJSON : recordsFromAttributes){
                        AttributeInner att = (AttributeInner) JSON.deserialize(JSON.serializePretty(attJSON), AttributeInner.class);
                        if(covCode.get(att.code) == null ) covCode.put(att.code,att.label);
                        //if(!att.hidden) 
                        if(attributeAttrList.get(att.code)== null) attributeAttrList.put(att.code, new List<CoverageItem>());

                        System.debug('attributeAttrList: ' + attributeAttrList);
                    }
                    //Attribute Values from vlocity_ins__AttributeDefaultValues__c Field from vlocity_ins__CompiledAttributeOverride__c
                    for( String attCode : attsPerCoverageWithCodeValue.keySet()){
                        if(covCodeValues.get(attCode+'_'+prod.Id) == null){
                            if(covCode.get(attCode) != null){
                                covCodeValues.put(attCode+'_'+prod.Id,String.valueOf(attsPerCoverageWithCodeValue.get(attCode) ));

                                System.debug('covCodeValues: ' + covCodeValues);
                            }
                        }
                        //Attribute Name
                        String attCodeName = attCode;
                        if(attributeAttrList.get(attCodeName)!= null){
                            List<CoverageItem> listAttrs = attributeAttrList.get(attCodeName);
                            Boolean found = false;
                            for(CoverageItem i : listAttrs){
                            if(i.attributeCode == attCode) {
                                found = true;
                                if(i.prodValues.get(prod.Id) == null ){
                                    if(covCodeValues.get(attCodeName+'_'+prod.Id) == null) i.prodValues.put(prod.Id,  '');
                                    else i.prodValues.put(prod.Id,  covCodeValues.get(attCodeName+'_'+prod.Id) );  
                                }else{
                                        if(covCodeValues.get(attCodeName+'_'+prod.Id) == null) i.prodValues.put(prod.Id,  '');
                                        else i.prodValues.put(prod.Id,  covCodeValues.get(attCodeName+'_'+prod.Id) );  
                                }
                            }   
                            }
                            CoverageItem cItem;
                            if(!found){
                                cItem = new CoverageItem();
                                cItem.attributeCode = attCodeName;
                                cItem.displaySequence=dSequence;
                                cItem.attributeName = covCode.get(attCodeName);
                                cItem.prodValues = new Map<String,String>();
                                for(String prodId : productsIds){
                                    if(cItem.prodValues.get(prodId) == null){
                                        cItem.prodValues.put(prodId, '');
                                    }
                                }
                                if(covCodeValues.get(attCodeName+'_'+prod.Id) == null) cItem.prodValues.put(prod.Id,  '');
                                else cItem.prodValues.put(prod.Id,  covCodeValues.get(attCodeName+'_'+prod.Id) );  

                                System.debug('cItem: ' + cItem);

                                listAttrs.add(cItem);

                                System.debug('listAttrs: ' + listAttrs);

                                attributeAttrList.put(attCodeName,listAttrs);

                                System.debug('attributeAttrList: ' + attributeAttrList);
                            }
                        }
                    }
                }

            }
            //Sort list by Display Sequence
            List<String> newCoverageStringList = new List<String>();
            for( String covcodeTemp : attributeAttrList.keySet() ){
                newCoverageStringList.add(covcodeTemp);
                List<CoverageItem> covItemList = attributeAttrList.get(covcodeTemp);
                covItemList.sort();
                attributeAttrList.put(covcodeTemp,covItemList );
            }
        } catch(Exception ex){
            system.debug('*****ERRROR IS..'+ex.getCause()+'*****'+ex.getMessage()+'*****'+ex.getLineNumber()+'*****'+ex.getTypeName()+'*****'+ex.getStackTraceString()); 
        }
    }


    public void createMappingFromJSON(){
        try {
            Map<String, String> covCodeValues = new Map<string, String>();
            //Map Coverage Attribute Code + Product Id as Key - with value as return
            mapCovCodeProductList = new Map<String, List<String> >();
            //Map to Manage Coverage with List of Attributes to all Products for a given Quote. 
            coverageAttrList = new Map<String,List<CoverageItem>>();


            //Iterate on Coverages Custom CODES in case no Compiled attribute exists. 
            for( String covName : coveragesCustomOrder ){
                if(coverageAttrList.get(covName)== null){
                    coverageAttrList.put(covName, new List<CoverageItem>());                
                }
            }

            for(vlocity_ins__CompiledAttributeOverride__c comp : [SELECT Id, vlocity_ins__ProductChildItemId__r.vlocity_ins__ChildProductId__r.Name, vlocity_ins__ProductId__c, vlocity_ins__AttributeMetadata__c, vlocity_ins__AttributeDefaultValues__c 
                                                                FROM vlocity_ins__CompiledAttributeOverride__c 
                                                                WHERE vlocity_ins__ProductId__c IN :productsIds]){

                Map <String, Object> attributesPerCoverage = (map<String, Object>) JSON.deserializeUntyped(comp.vlocity_ins__AttributeMetadata__c);
                Map <String, Object> attsPerCoverageWithCodeValue = (map<String, Object>) JSON.deserializeUntyped(comp.vlocity_ins__AttributeDefaultValues__c);
                List<Object> recordsList = (List<Object>) attributesPerCoverage.get('records');
                Map <String, Object> coverage = (Map<String, Object>) recordsList.get(0);
                String covCod = String.valueOf(coverage.get('Code__c'));
                //becuase Code__c is not equalt no the code of benefits:
                if(covCod =='MED_Medical'){
                    covCod = 'MEDICAREBENEFITS';
                }
                Map <String, Object> recordAttributePerCoverage = (Map<String, Object>)coverage.get('productAttributes');
                List<Object> recordsFromAttributes = (List<Object>)recordAttributePerCoverage.get('records');

                //Initialize Map Coverage with List Of Inner

                //Only for 2021 Coverages Code (With same attribute category)
                if(covCod == 'DRGTRLVL' && comp.vlocity_ins__ProductChildItemId__r.vlocity_ins__ChildProductId__r.Name == 'Standard Retail (30-day supply)'){
                    covCod = 'STNDRDRTL30';
                }else if (covCod == 'DRGTRLVL' && comp.vlocity_ins__ProductChildItemId__r.vlocity_ins__ChildProductId__r.Name == 'Preferred Retail (30-day supply)'){
                    covCod = 'PRFRRDRTL30';
                }else if (covCod == 'DRGTRLVL' && comp.vlocity_ins__ProductChildItemId__r.vlocity_ins__ChildProductId__r.Name == 'Mail Order (30-day supply)'){
                    covCod = 'MLORDR30';
                }else if (covCod == 'DRGTRLVL' && comp.vlocity_ins__ProductChildItemId__r.vlocity_ins__ChildProductId__r.Name == 'Mail Order (90-day supply)'){
                    covCod = 'MLORDR90';
                }else{
                }

                if(coverageAttrList.get(covCod)== null){
                    coverageAttrList.put(covCod, new List<CoverageItem>());
                }

                //Map with Attribute Code and Attribute Label
                //Sample: Specialist_Office_Visit - > Specialist Office Visit
                Map<String, AttributeInner> mapCodeAttributeInner = new Map<String, AttributeInner>();
                for(Object attJSON : recordsFromAttributes){
                    AttributeInner att = (AttributeInner) JSON.deserialize(JSON.serializePretty(attJSON), AttributeInner.class);
                    if(covCode.get(att.code) == null ) covCode.put(att.code,att.label);
                    mapCodeAttributeInner.put(att.code,att);
                }

                //Attribute Values from vlocity_ins__AttributeDefaultValues__c Field from vlocity_ins__CompiledAttributeOverride__c
                for( String attCode : attsPerCoverageWithCodeValue.keySet()){

                    if(covCodeValues.get(attCode+'_'+comp.vlocity_ins__ProductId__c+'_'+comp.Id) == null){
                        if(covCode.get(attCode) != null){
                            covCodeValues.put(attCode+'_'+comp.vlocity_ins__ProductId__c+'_'+comp.Id,String.valueOf(attsPerCoverageWithCodeValue.get(attCode) ));
                        }
                    }
                    //Attribute Name
                    String attCodeName = attCode;
                    if(coverageAttrList.get(covCod)!= null){
                        List<CoverageItem> listAttrs = coverageAttrList.get(covCod);
                        Boolean found = false;
                        for(CoverageItem i : listAttrs){
                        if(i.attributeCode == attCode && i.coverageCode == covCod){
                            found = true;
                            if(i.prodValues.get(comp.vlocity_ins__ProductId__c) == '' ||  i.prodValues.get(comp.vlocity_ins__ProductId__c) == null   ){
                                if(covCodeValues.get(attCodeName+'_'+comp.vlocity_ins__ProductId__c+'_'+comp.Id) == null){
                                    i.prodValues.put(comp.vlocity_ins__ProductId__c,  '');
                                    }else{
                                    i.prodValues.put(comp.vlocity_ins__ProductId__c,  covCodeValues.get(attCodeName+'_'+comp.vlocity_ins__ProductId__c+'_'+comp.Id) );  
                                    }
                            }
                        }   
                        }
                        CoverageItem cItem;
                        if(!found){
                            if(!mapCodeAttributeInner.get(attCodeName).hidden){
                                cItem = new CoverageItem();
                                cItem.coverageCode = covCod;
                                cItem.attributeCode = attCodeName;
                                cItem.attributeName = covCode.get(attCodeName);
                                if(cItem.attributeName == 'Skilled nursing facility (SNF)'){
                                    cItem.attributeName = 'Skilled Nursing Facility (SNF)';
                                }
                                cItem.displaySequence = mapCodeAttributeInner.get(attCodeName).displaySequence;
                                cItem.prodValues = new Map<String,String>();
                                for(String prodId : productsIds){
                                    if(cItem.prodValues.get(prodId) == null){
                                        cItem.prodValues.put(prodId, '');
                                    }
                                }
                                if(covCodeValues.get(attCodeName+'_'+comp.vlocity_ins__ProductId__c+'_'+comp.Id) == null){
                                    cItem.prodValues.put(comp.vlocity_ins__ProductId__c,  '');
                                }else{
                                    cItem.prodValues.put(comp.vlocity_ins__ProductId__c,  covCodeValues.get(attCodeName+'_'+comp.vlocity_ins__ProductId__c+'_'+comp.Id) );  
                                }
                                listAttrs.add(cItem);
                                coverageAttrList.put(covCod,listAttrs);
                            }
                            
                        }
                    }
                }
            }   

            //Re Order Coverages 
            for( String covcodeTemp : coverageAttrList.keySet() ){
                List<CoverageItem> covItemList = coverageAttrList.get(covcodeTemp);
                covItemList.sort();
                coverageAttrList.put(covcodeTemp,covItemList );
                for(CoverageItem i : covItemList){
                }
            }
        } catch(Exception ex){
            system.debug('*****ERRROR IS..'+ex.getCause()+'*****'+ex.getMessage()+'*****'+ex.getLineNumber()+'*****'+ex.getTypeName()+'*****'+ex.getStackTraceString()); 
        }
    }

    //Inner Object to handle Coverages and list of Attributes
    public class CoverageItem implements Comparable{
        public String attributeName {get;set;}
        public String attributeCode {get;set;}
        public String coverageCode{get;set;}
        public Integer displaySequence {get;set;}
        public Map<String,String> prodValues {get;set;}
        public Integer CompareTo (Object compareTo){
            CoverageItem compareToEmp = (CoverageItem)compareTo;
            if (displaySequence == compareToEmp.displaySequence) return 0;
            if (displaySequence > compareToEmp.displaySequence) return 1;
            return -1;  
        }
    }
    //Attrbiute for a Coverage
    public class AttributeInner{
        public String code; //Specialist_Office_Visit
        public String dataType; //text
        public String inputType;    //text
        public boolean multiselect;
        public boolean required;
        public boolean readonly;
        public boolean disabled;
        public boolean filterable;
        public String attributeId;  //a1Wm0000004VqC6EAK
        public String label;    //Specialist Office Visit
        public Integer displaySequence; //0
        public boolean hasRules;
        public boolean hidden;
        public boolean cloneable;
        public boolean isNotTranslatable;
        public cls_values[] values;
        public cls_userValues userValues;
    }
    
    class cls_values {
        public boolean readonly;
        public boolean disabled;
    }
    class cls_userValues {
    }
    
    public class PersonValues{
        public String ID {get; set;}
        public String ProductRelated {get; set;}
        public String IndividualRate {get; set;}
        public Integer PersonAge {get; set;}
        public Map<String,String> productPrices {get;set;}
    }

}