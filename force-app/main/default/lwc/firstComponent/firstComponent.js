import { LightningElement, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import { BaseState } from "vlocity_ins/baseState";

export default class FirstComponent extends OmniscriptBaseMixin(BaseState(LightningElement)) {

    @api accountName;
    @api uiName;

    connectedCallback() {
        console.log('This is the Account Name: ', this.accountName);
        console.log('This is the input on the UI: ', this.uiName);
    }

    renderedCallback() {
        console.log('This is the Account Name: ', this.accountName);
        console.log('This is the input on the UI: ', this.uiName);
    }

}