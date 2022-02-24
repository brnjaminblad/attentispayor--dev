import { LightningElement, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class AccountModal extends OmniscriptBaseMixin(LightningElement) {

    showModal = false;
    @api account;

    @api show() {
        this.showModal = true;
    }
    
    closeModal() {
        this.showModal = false;
    }
}