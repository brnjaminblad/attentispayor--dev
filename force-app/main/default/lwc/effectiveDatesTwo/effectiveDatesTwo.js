import { LightningElement, track } from 'lwc';



export default class EffectiveDatesTwo extends LightningElement {

    @track firstMonthDate;
    @track secondMonthDate;
    @track thirdMonthDate;


    // selectDate = new Date().addMonths(1).toStartofMonth().addDays(-1);
    connectedCallback() {
        // Get the current date/time in UTC
        let rightNow = new Date();
        let firstMonth;
        let secondMonth;
        let thirdMonth;

        // Adjust for the user's time zone
        rightNow.setMinutes(
            new Date().getMinutes() - new Date().getTimezoneOffset()
        );

        // next 3 months

        firstMonth = new Date(rightNow.getFullYear(), rightNow.getMonth() + 1, 1);
        secondMonth = new Date(rightNow.getFullYear(), rightNow.getMonth() + 2, 1);
        thirdMonth = new Date(rightNow.getFullYear(), rightNow.getMonth() + 3, 1);

          // next 3 months without time

        this.firstMonthDate = firstMonth.toISOString().slice(0, 10);
        this.secondMonthDate = secondMonth.toISOString().slice(0, 10);
        this.thirdMonthDate = thirdMonth.toISOString().slice(0, 10);

        console.log(this.firstMonthDate); // Displays the user's current date, e.g. "2020-05-15"
    

    }
    get optionsTwo() {
        return [
          
            { label:  this.secondMonthDate, value: this.secondMonthDate },
            { label:  this.thirdMonthDate, value: this.thirdMonthDate },
        ];
    }


}