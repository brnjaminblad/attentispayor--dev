import { LightningElement, api, track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class customPreviousButton extends OmniscriptBaseMixin(LightningElement) {


    prevStep() {
        this.omniPrevStep();
    }

}