import { LightningElement, api, track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class EffectiveDates extends OmniscriptBaseMixin(LightningElement) {

    @api effective_date_a;
    @api effective_date_b;

    sendEffDate = [];

    firstMonthDate;
    secondMonthDate;
    thirdMonthDate;
    dateB;
    dateA;
    rightNow;
    effDateSelected;

    connectedCallback() {
    
        let effDateA = this.effective_date_a;
        let effDateB = this.effective_date_b;

       
        console.log("this is effective date letA " + effDateA);
    
        console.log("this is effective date letB " + effDateB);
       
        
        // test dates
        // this.rightNow = new Date();
        //  this.dateB = new Date('December 25, 2022 01:30:00');
        // this.rightNow = new Date('December 15, 2021 01:30:00');
        // this.dateA = new Date('April 25, 2017 01:30:00');
        
        this.dateB = new Date(effDateB);
        this.rightNow = new Date();
        this.dateA = new Date(effDateA);


        // Adjust for the user's time zone
        this.rightNow.setMinutes(
            new Date().getMinutes() - new Date().getTimezoneOffset()
        );


        // today's date in mm-dd-yyyy format conversion
        // this.firstMonthDate = ((this.rightNow.getMonth() > 8) ? (this.rightNow.getMonth() + 1) : ('0' + (this.rightNow.getMonth() + 1))) + '-' + '01' + '-' + this.rightNow.getFullYear();

        // first day of next 1, or, 2, or 3 months recursively
        if ((this.rightNow.getMonth() >= 8) && (this.rightNow.getMonth() < 11)) {
            this.firstMonthDate = ((this.rightNow.getMonth() + 2) + '-' + '01' + '-' + (this.rightNow.getFullYear()))
        }
        else if ((this.rightNow.getMonth() >= 11)) {
            this.firstMonthDate = ('0' + (this.rightNow.getMonth() - 10) + '-' + '01' + '-' + (this.rightNow.getFullYear() + 1))
        }
        else if (this.rightNow.getMonth() < 6) {
            this.firstMonthDate = ('0' + (this.rightNow.getMonth() + 2) + '-' + '01' + '-' + (this.rightNow.getFullYear()))
        }


        if ((this.rightNow.getMonth() >= 7) && (this.rightNow.getMonth() < 10)) {
            this.secondMonthDate = ((this.rightNow.getMonth() + 3) + '-' + '01' + '-' + (this.rightNow.getFullYear()))
        }
        else if ((this.rightNow.getMonth() >= 10)) {
            this.secondMonthDate = ('0' + (this.rightNow.getMonth() - 9) + '-' + '01' + '-' + (this.rightNow.getFullYear() + 1))
        }
        else if (this.rightNow.getMonth() < 7) {
            this.secondMonthDate = ('0' + (this.rightNow.getMonth() + 3) + '-' + '01' + '-' + (this.rightNow.getFullYear()))
        }



        if ((this.rightNow.getMonth() >= 6) && (this.rightNow.getMonth() < 9)) {
            this.thirdMonthDate = ((this.rightNow.getMonth() + 4) + '-' + '01' + '-' + (this.rightNow.getFullYear()))
        }
        else if ((this.rightNow.getMonth() >= 9)) {
            this.thirdMonthDate = ('0' + (this.rightNow.getMonth() - 8) + '-' + '01' + '-' + (this.rightNow.getFullYear() + 1))
        }
        else if (this.rightNow.getMonth() < 8) {
            this.thirdMonthDate = ('0' + (this.rightNow.getMonth() + 4) + '-' + '01' + '-' + (this.rightNow.getFullYear()))
        }


    }


    changeHandler(e) {
       
        this.effDateSelected = e.target.value;
      //  let effDate = { "effDateSelected": this.effDateSelected };
         let effDate = { "effDateSelected":  new Date(this.effDateSelected) };
        this.omniApplyCallResp(effDate);
    }

    //two data sets in combobox depending on Part A & Part B Effective Dates


    get options() {
        if (this.rightNow.getTime() < this.dateA.getTime() || this.rightNow.getTime() < this.dateB.getTime()) {
            return [

                { label: this.secondMonthDate, value: this.secondMonthDate },
                { label: this.thirdMonthDate, value: this.thirdMonthDate },
            ];
        }
        if (this.rightNow.getTime() > this.dateA.getTime() && this.rightNow.getTime() > this.dateB.getTime()) {
            return [

                { label: this.firstMonthDate, value: this.firstMonthDate },
                { label: this.secondMonthDate, value: this.secondMonthDate },
                { label: this.thirdMonthDate, value: this.thirdMonthDate },
            ];
        }
    }

}