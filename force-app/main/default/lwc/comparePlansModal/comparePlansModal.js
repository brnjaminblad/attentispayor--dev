import { LightningElement, track } from 'lwc';

export default class ComparePlansModal extends LightningElement {
    @track openModal = false;
    showModal() {
        this.openModal = true;
    }
    closeModal() {
        this.openModal = false;
    }
}