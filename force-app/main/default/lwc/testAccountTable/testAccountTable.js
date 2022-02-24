import { LightningElement, api, track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
// import { refreshApex } from '@salesforce/apex';


export default class TestAccountTable extends OmniscriptBaseMixin(LightningElement) {

    errorNext = false;
    editable = false;
    @api accounts;
    @track tempAccounts;

    @track arrayMember = [];

    

    options = [
        { value: 'new', label: 'New', description: 'A new item' },
        { value: 'in-progress', label: 'In Progress', description: 'Currently working on this item', },
        {  value: 'finished', label: 'Finished', description: 'Done working on this item', },
    ];

    columns = [
        { label: 'Name', fieldName: 'Name', editable: true },
        { label: 'Id', fieldName: 'Id', type: 'phone', editable:false }];

    connectedCallback(){

        
        //this.tempAccounts = JSON.parse(JSON.stringify(this.accounts));
        
        this.arrayMember.push({Id:'1', Name: 'locooo', Parent:'true', DOB:'', Email:'as@as.com' });
        this.arrayMember.push({Id:'2', Name: 'rgrg', Parent:'false', DOB:'', Email:'fe@fe.com' });
        this.arrayMember.push({Id:'3', Name: 'locoththtoo', Parent:'false', DOB:'', Email:'gt@fr.com' });

        
    }


    //multiple records
    handleSave(event) {
        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
    
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(accounts => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contacts updated',
                    variant: 'success'
                })
            );
             // Clear all draft values
             this.draftValues = [];
    
             // Display fresh data in the datatable
             //return refreshApex(this.tempAccounts);
        }).catch(error => {
            // Handle error
        });
    }

    
    //SINGLE RECORD
    // handleSave(event) {

    //     const fields = {}; 
    //     fields['Id'] = event.detail.draftValues[0].Id;
    //     fields['Name'] = event.detail.draftValues[0].Name;
    //     fields[LASTNAME_FIELD.fieldApiName] = event.detail.draftValues[0].LastName;

    //     const recordInput = {fields};

    //     updateRecord(recordInput)
    //     .then(() => {
    //         this.dispatchEvent(
    //             new ShowToastEvent({
    //                 title: 'Success',
    //                 message: 'Account updated',
    //                 variant: 'success'
    //             })
    //         );
    //         //Display fresh data in the datatable
    //         // return refreshApex(this.account).then(() => {

    //         //     // Clear all draft values in the datatable
    //         //     this.draftValues = [];

    //         // });
    //     }).catch(error => {

    //         this.dispatchEvent(
    //             new ShowToastEvent({
    //                 title: 'Error updating or reloading record',
    //                 message: error.body.message,
    //                 variant: 'error'
    //             })
    //         );
    //     });
    // }

    setName(event){
        //let ind = event.target.dataset.item;

        console.log('eventeee: ' + event.target.dataset.id);

        let cardid = event.target.dataset.id;
        //this.account = this.tempAccounts[cardid];
        this.member = this.arrayMember[cardid];
        console.log('cuenta: ' + this.member);

        //let enteredRecord = this.allRecords.find((rec, index) => index === parseInt(ind, 10));
        console.log('elvalorrrr' + event.target.value);

        this.arrayMember[cardid].Name = event.target.value;
        //console.log("this.allRecords => ", JSON.stringify(this.allRecords));

        
        let members = { "myFamily": this.arrayMember };
        
        this.omniApplyCallResp(members);
    }


    setDOB(event){
        //let ind = event.target.dataset.item;

        console.log('eventeee: ' + event.target.dataset.id);

        let cardid = event.target.dataset.id;
        //this.account = this.tempAccounts[cardid];
        this.member = this.arrayMember[cardid];
        console.log('cuenta: ' + this.member);

        //let enteredRecord = this.allRecords.find((rec, index) => index === parseInt(ind, 10));
        console.log('elvalorrrr' + event.target.value);

        this.arrayMember[cardid].DOB = event.target.value;
        //console.log("this.allRecords => ", JSON.stringify(this.allRecords));

        
        let members = { "myFamily": this.arrayMember };
        
        this.omniApplyCallResp(members);
    }

    setProgress(event){
        //let ind = event.target.dataset.item;

        console.log('eventeee: ' + event.target.dataset.id);

        let cardid = event.target.dataset.id;
        //this.account = this.tempAccounts[cardid];
        this.member = this.arrayMember[cardid];
        console.log('cuenta: ' + this.member);

        //let enteredRecord = this.allRecords.find((rec, index) => index === parseInt(ind, 10));
        console.log('elvalorrrr' + event.target.value);

        this.arrayMember[cardid].Progress = event.target.value;
        //console.log("this.allRecords => ", JSON.stringify(this.allRecords));

        
        let members = { "myFamily": this.arrayMember };
        
        this.omniApplyCallResp(members);
    }


    setPhone(event){

        console.log('eventeee: ' + event.target.dataset.id);

        let cardid = event.target.dataset.id;
        //this.account = this.tempAccounts[cardid];
        this.member = this.arrayMember[cardid];
        console.log('cuenta: ' + this.member);

        //let enteredRecord = this.allRecords.find((rec, index) => index === parseInt(ind, 10));
        console.log('elvalorrrr' + event.target.value);

        this.arrayMember[cardid].Phone = event.target.value;
        //console.log("this.allRecords => ", JSON.stringify(this.allRecords));

        
        let members = { "myFamily": this.arrayMember };
        
        this.omniApplyCallResp(members);
    }

    addDependent(){

        this.arrayMember.push({ Name: '', Id: '' });

        let members = { "myFamily": this.arrayMember };
        
            this.omniApplyCallResp(members);
    }

    removeDependent(event){
        //let ind = event.target.dataset.item;

        console.log('eventeee: ' + event.currentTarget.name);

        //let cardid = event.target.dataset.id;
        let cardid = event.currentTarget.name;
        //this.account = this.tempAccounts[cardid];
         this.arrayMember.splice(cardid, 1);
        
         let members = { "myFamily": this.arrayMember };
        
         this.omniApplyCallResp(members);
    }


    handleChange(event) {
        // Get the string of the "value" attribute on the selected option
        this.value = event.detail.value;
    }


    showInfoToast() {
        this.errorNext = true;
    }

    closeErrorNext(){
        this.errorNext = false;
    }

    get brandProposedICDiscountClass() {
        return this.brandProposedICDiscount >= 0 ? '' : 'red'
    }

    get brandProposedDFRXClass() {
        return this.brandProposedDFRX >= 0 ? '' : 'red'
    }

    get genericProposedICDiscountClass() {
        return this.genericProposedICDiscount >= 0 ? '' : 'red'
    }

    get genericProposedDFRXClass() {
        return this.genericProposedDFRX >= 0 ? '' : 'red'
    }

    get brandBillableGuaranteeICClass() {
        return this.brandBillableGuaranteeIC >= 0 ? '' : 'red'
    }

    get brandBillableGuaranteeDFClass() {
        return this.brandBillableGuaranteeDF >= 0 ? '' : 'red'
    }

    get brandRiskSpreadICClass() {
        return this.brandRiskSpreadIC >= 0 ? '' : 'red'
    }

    get brandRiskSpreadDFClass() {
        return this.brandRiskSpreadDF >= 0 ? '' : 'red'
    }

    get genericBillableGuaranteeICClass() {
        return this.genericBillableGuaranteeIC >= 0 ? '' : 'red'
    }

    get genericBillableGuaranteeDFClass() {
        return this.genericBillableGuaranteeDF >= 0 ? '' : 'red'
    }

    get genericRiskSpreadICClass() {
        return this.genericRiskSpreadIC >= 0 ? '' : 'red'
    }

    get genericRiskSpreadDFClass() {
        return this.genericRiskSpreadDF >= 0 ? '' : 'red'
    }
}