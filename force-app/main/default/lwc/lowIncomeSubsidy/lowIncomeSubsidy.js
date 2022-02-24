import { LightningElement, api, wire } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class LowIncomeSubsidy extends OmniscriptBaseMixin(LightningElement) {
    percentageVisible = false;


    handleChange(event) {
        selectedValue = event.target.value
        console.log(selectedValue)
        if (selectedValue === "recieve") {
            this.percentageVisible = true;
        }
        else { this.percentageVisible = false }
    }
}