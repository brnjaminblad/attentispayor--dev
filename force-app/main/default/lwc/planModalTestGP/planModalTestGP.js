import { LightningElement, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class PlanModal extends OmniscriptBaseMixin(LightningElement) {
    showModal = false;
    @api product;
    
    

    @api show() {
        this.showModal = true;
    }
    
    closeModal() {
        this.showModal = false;
    }

    
}