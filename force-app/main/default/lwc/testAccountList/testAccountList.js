import { LightningElement, api, track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

//import { NavigationMixin } from "lightning/navigation";
//import NAME_FIELD from '@salesforce/schema/Account.Name';
//import ID_FIELD from '@salesforce/schema/Account.Id';
//import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
//import getAccounts from '@salesforce/apex/AccountControllerTest.getAccounts';

// const COLUMNS = [
//     { label: 'Name', fieldName: NAME_FIELD.fieldApiName, type: 'text' },
//     { label: 'Id', fieldName: ID_FIELD.fieldApiName, type: 'text' }
//     // { label: 'Email', fieldName: EMAIL_FIELD.fieldApiName, type: 'text' }
// ];

export default class TestAccountList extends OmniscriptBaseMixin(LightningElement) {

    // columns = COLUMNS;
    // @wire(getAccounts)
    // accounts;

    // get errors() {
    //     return (this.accounts.error) ?
    //         reduceErrors(this.accounts.error) : [];
    // }

    @api accounts;
    account;

    connectedCallback(){

        
        this.newAccounts = JSON.parse(JSON.stringify(this.accounts));


    }

    openModal(event) {
        let cardid = event.target.dataset.id;

        console.log('cardid: ' + cardid);
        
        this.account = this.newAccounts[cardid];

        console.log('account: ' + JSON.stringify(this.account));

        const modal = this.template.querySelector("c-account-modal");

        modal.show();
    }

}