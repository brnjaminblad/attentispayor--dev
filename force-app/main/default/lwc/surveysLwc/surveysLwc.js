import { LightningElement } from 'lwc';

export default class SurveysLwc extends LightningElement {
    showWebsite = false;
    isLoading = false;
    showSurvey = false;
    websiteLabel = 'Show HeySalesforce.org';
    surveyLabel = 'Show Surveys';

    gotowebsite(event){
        this.showWebsite = true;
        this.surveyLabel = 'Show Surveys';
        this.showSurvey = false;
        if(event.target.label =='Show HeySalesforce.org')
        {
            this.websiteLabel = 'Hide HeySalesforce.org';
            this.showWebsite = true;
        }
            
        if(event.target.label =='Hide HeySalesforce.org')
        {
            this.websiteLabel = 'Show HeySalesforce.org';
            this.showWebsite = false;
        }
            
    }
    gotosurveys(event){
        this.websiteLabel = 'Show HeySalesforce.org';
        this.showSurvey = true;
        this.showWebsite = false;
        if(event.target.label =='Show Surveys')
        {
            this.isLoading = true;
            this.surveyLabel = 'Hide Surveys';
            this.showSurvey = true;
            setTimeout(()=>{
                this.isLoading = false;                          
              },3000);

        }
            
        if(event.target.label =='Hide Surveys')
        {
            this.surveyLabel = 'Show Surveys';
            this.showSurvey = false;
        }
            
    }
    
}