import { LightningElement, api, track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class datePickerHospitalPart extends OmniscriptBaseMixin(LightningElement) {

    datePickerValue;

    getdatepickerValue(event){
        console.log("testeventin ",event);
        if(event){
            this.datePickerValue = event.target.getAttribute('value');
            console.log("datepicker ",this.datePickerValue);
        }

    }
}