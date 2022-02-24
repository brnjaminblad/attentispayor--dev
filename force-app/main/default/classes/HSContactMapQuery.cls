public with sharing class HSContactMapQuery {
    @AuraEnabled(cacheable=true)
    public static List<Location> getContact() {
        List< Contact> cons =  [Select Id, Name, MailingAddress, MailingStreet,
                                MailingCity, MailingCountry, MailingPostalCode,
                                MailingState,Phone from Contact where MailingStreet!=NULL AND
                                MailingCity!=NULL AND MailingCountry!=NULL AND  MailingPostalCode!=NULL AND
                                MailingState!=NULL] ;
        
        List<Location> loc = new List<Location>();
        for(Contact con :cons){
            System.debug(con);
            GeoLocation geoInfo = new GeoLocation();
            geoInfo.Street = con.MailingStreet;
            geoInfo.PostalCode = con.MailingPostalCode;
            geoInfo.City = con.MailingCity;
            geoInfo.State = con.MailingState;
            geoInfo.Country = con.MailingCountry;
            Location locDetail = new Location();
            locDetail.icon = 'action:map'; 
            locDetail.title = con.Name;
            locDetail.description = con.Name;
            locDetail.location = geoInfo;
            
            loc.add(locDetail);
        }
        return loc ;
    }
    public class Location{
        @AuraEnabled 
        public String icon{get;set;} 
        @AuraEnabled 
        public String title{get;set;} 
        @AuraEnabled
        public String description{get;set;} 
        @AuraEnabled 
        public GeoLocation location{get;set;} 
    }
    public class GeoLocation{
        @AuraEnabled 
        public String Street{get;set;}
        @AuraEnabled 
        public String PostalCode{get;set;}
        @AuraEnabled 
        public String City{get;set;}
        @AuraEnabled 
        public String State{get;set;}
        @AuraEnabled 
        public String Country{get;set;}
    }
}