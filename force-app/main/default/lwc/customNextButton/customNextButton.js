import { LightningElement, api, track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class customNextButton extends OmniscriptBaseMixin(LightningElement) {

    nextStep() {
        this.omniNextStep();
    }

}