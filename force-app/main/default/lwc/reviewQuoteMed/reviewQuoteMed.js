import { LightningElement, api, track } from 'lwc';
import {OmniscriptBaseMixin} from 'vlocity_ins/omniscriptBaseMixin';
import OmniscriptStep from 'vlocity_ins/omniscriptStep';

export default class ReviewQuoteMed extends OmniscriptBaseMixin(LightningElement) {
    
    @track openModal = false;
    showModal() {
        this.openModal = true;
    }
    closeModal() {
        this.openModal = false;
    }

    @api attlist = [
        {
            Id: 1,
            Name: 'Primary Care Physician Visit',
            Value: '$0'
        },
        {
            Id: 2,
            Name: 'Specialist Office Visit',
            Value: '$0'
        },
        {
            Id: 3,
            Name: 'Medical Deductible',
            Value: '$0.00'
        }
    ];/*array test*/

    btnEnroll(){

    }

}