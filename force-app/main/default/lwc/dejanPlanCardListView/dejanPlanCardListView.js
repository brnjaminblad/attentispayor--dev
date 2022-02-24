import { LightningElement, track, wire, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
///////////////////////////////////////////////////////// BACKUP////////////////////////////////////////////////////////////
export default class DejanPlanCardListView extends OmniscriptBaseMixin(LightningElement) {

    @api plans;
    @track plansOrdered;
    @track origPlan;
    @track newPlans;

    product;
    @track openModal = false;

    //for select sorting
    @track selectedOption;

    @track chckcmed
    @track chckspec

    @track pcprqrdy
    @track pcprqrdn

    @track filterToAplly;


    connectedCallback() {
        //console.log("The original plans: ", this.plans);
        this.plansOrdered = this.plans;
        this.origPlan = this.plans;

        this.chckcmed = "hide";
        this.chckspec = "hide";

        this.pcprqrdy = "yes";
        this.pcprqrdn = "no";

        this.filterToAplly = [];

        console.log(`original filtertoapply`, this.filterToAplly)

        try {
            this.newPlans = JSON.parse(JSON.stringify(this.plansOrdered));
            //console.log(JSON.stringify(newPlans));

            //add buttonName = '', if click change name to ''

            //loop for attributeCategories
            for (let i = 0; i < this.plansOrdered.length; i++) {
                //console.log("plan:", i, JSON.stringify(this.plansOrdered[i]));
                for (let a = 0; a < this.plansOrdered[i].attributeCategories.records.length; a++) {
                    //console.log("plan:", i, "-", "AttCat record:", a, this.plansOrdered[i].attributeCategories.records[a]);
                    for (let b = 0; b < this.plansOrdered[i].attributeCategories.records[a].productAttributes.records.length; b++) {
                        //console.log("plan:", i, "-", "AttCat record:", a, "-", "ProAtt record:", b, this.plansOrdered[i].attributeCategories.records[a].productAttributes.records[b]);
                        let name = this.plansOrdered[i].attributeCategories.records[a].productAttributes.records[b].label.replace(/ /g, "");
                        name = name.replace(/-/g, "");
                        let value = this.plansOrdered[i].attributeCategories.records[a].productAttributes.records[b].userValues;
                        //console.log(name, "=", value);
                        this.newPlans[i][name] = value;
                    }
                }
            }
            //loop for childProducts
            for (let i = 0; i < this.plansOrdered.length; i++) {
                //console.log("plan:", i, JSON.stringify(this.plansOrdered[i]));
                for (let a = 0; a < this.plansOrdered[i].childProducts.records.length; a++) {
                    for (let b = 0; b < this.plansOrdered[i].childProducts.records[a].attributeCategories.records.length; b++) {
                        for (let c = 0; c < this.plansOrdered[i].childProducts.records[a].attributeCategories.records[b].productAttributes.records.length; c++) {

                            //console.log("plan:", i, "-", "childProducts record:", a, "-", "attributeCategories record:", b, "productAttributes record:", c, this.plansOrdered[i].childProducts.records[a].attributeCategories.records[b].productAttributes.records[c]);

                            let name = this.plansOrdered[i].childProducts.records[a].attributeCategories.records[b].productAttributes.records[c].label.replace(/ /g, "");
                            let code = this.plansOrdered[i].childProducts.records[a].ProductCode;
                            name = name.concat(code);
                            name = name.replace(/-/g, "");
                            name = name.replace("(", "");
                            name = name.replace(")", "");
                            name = name.replace("/", "");
                            name = name.replace(/24/g, "");
                            name = name.replace(/30/g, "t");
                            name = name.replace(/90/g, "n");
                            name = name.replace(/1/g, "");
                            name = name.replace(/2/g, "");
                            name = name.replace(/3/g, "");
                            name = name.replace(/4/g, "");
                            name = name.replace(/5/g, "");
                            let value = this.plansOrdered[i].childProducts.records[a].attributeCategories.records[b].productAttributes.records[c].userValues;
                            //console.log(name, "=", value);
                            this.newPlans[i][name] = value;
                            //problems with tiers (mail orders and retail)

                        }
                    }
                }
            }

            for (let i = 0; i < this.plansOrdered.length; i++) {
                newPlans[i]['btnCompareLabel'] = 'Add Up to 3 Plans to Compare';
                newPlans[i]['btnCompareDisabled'] = 'false';
                newPlans[i]['btnEnrollLabel'] = 'Enroll Now';
                newPlans[i]['btnEnrollDisabled'] = 'false';
                newPlans[i]['btnQuote'] = 'false';
                newPlans[i]['cardBorder'] = 'plancard';
            }

            //console.log(JSON.stringify(newPlans));
            this.plansOrdered = this.newPlans;
            // console.log(JSON.stringify(this.plansOrdered));

        } catch (exception) {
            //console.log('Exception:', exception);
        }

    }

    // handler for select options

    sortHandler(event) {
        console.log("sort calllling");
        // console.log("event.detail.name: ", event.detail.name)
        //console.log("event.detail.value: ", event.detail.value)


        this.selectedOption = event.detail.value;
        // console.log("you have selected : " + this.selectedOption);
        if (this.selectedOption === "low-to-high") {
            //console.log("low-to-high");
            this.plansOrdered.sort(this.getSortOrderIncrease("Price"));
            //console.log('The plans ordered from low to high: ', JSON.stringify(this.plansOrdered));
            let orderTmp = [...this.plansOrdered];
            this.plansOrdered = orderTmp;
        } else if (this.selectedOption === "high-to-low") {
            // console.log("high-to-low");
            this.plansOrdered.sort(this.getSortOrderDecrease("Price"));
            //  console.log('The plans ordered from high to low: ', JSON.stringify(this.plansOrdered));
            let orderTmp = [...this.plansOrdered];
            this.plansOrdered = orderTmp;
        }
        else if (this.selectedOption === "name") {
            // console.log("high-to-low");
            this.plansOrdered.sort(this.getSortOrderIncrease("Name"));
            // console.log('The plans ordered by the name: ', JSON.stringify(this.plansOrdered));
            let orderTmp = [...this.plansOrdered];
            this.plansOrdered = orderTmp;
        }

    }

    filterHandler(event) {

        let filteredPlan

        console.log("filter calllling");
        let field = event.detail.name;

        if (field === 'optionMedicalPrescript') {

            this.selectedOption = event.detail.value;
            // console.log("you have selected : " + this.selectedOption);
            // console.log("chckcmed: ", this.chckcmed)
            if (this.selectedOption === "hide") {
                //this.selectedOption = "show"; 
                this.chckcmed = 'show';
                console.log(this.chckcmed, " CHECKMED inside filterHandler")
                const filterHMO = ele => ele.PlanType === "HMO" || ele.PlanType === "HMO-POS";
                console.log(filterHMO)
                // let filteredPlans = this.plansOrdered.filter(function (currentElement) {
                //     return currentElement.PlanType === "HMO" || currentElement.PlanType === "HMO-POS";
                //     // return currentElement.SubType__c === "HMO";
                // });
                this.filterToAplly = [...this.filterApply, filterHMO]
                console.log('this filter to apply, after one function pushed inside', this.filterToAplly)
                filteredPlan = this.customFilter(this.plansOrdered, ...this.filterToApply)


                //console.log(JSON.stringify(filteredPlans));
                this.plansOrdered = filteredPlan;
                console.log(this.chckcmed);
                console.log(JSON.stringify(this.plansOrdered));
            }
            else if (this.selectedOption === "show") {

                this.chckcmed = "hide";
                //this.plansOrdered = [...this.origPlan];
                //this.plansOrdered = JSON.parse(JSON.stringify(this.origPlan));
                this.plansOrdered = this.newPlans;
                console.log(this.chckcmed);
                console.log(JSON.stringify(this.plansOrdered));

            }
        }
        if (field === 'optionSpecNeeds') {
            this.selectedOption = event.detail.value;
            //console.log("you have selected : " + this.selectedOption);
            // console.log("chckspec: ", this.chckspec);

            if (this.selectedOption === "hide") {
                //this.selectedOption = "show"; 

                this.chckspec = 'show';
                console.log(this.chckspec)
                let filteredPlans = this.plansOrdered.filter(function (currentElement) {
                    return currentElement.PlanType === "D-SNP";
                    //return currentElement.SubType__c === "PPO";
                });

                //console.log(JSON.stringify(filteredPlans));
                this.plansOrdered = filteredPlans;
            }
            else if (this.selectedOption === "show") {

                this.chckspec = "hide";
                //this.plansOrdered = [...this.origPlan];
                this.plansOrdered = this.newPlans;
                console.log(JSON.stringify(this.plansOrdered));
            }
        }
        //    radio buttons PCP required


        if (field === 'pcpRequired') {

            this.selectedOption = event.detail.value;
            if (this.selectedOption === "yes") {
                //this.selectedOption = "show"; 
                //this.pcprqrdy = 'show';
                //this.pcprqrdn = 'hide';

                let filteredPlans = this.plansOrdered.filter(function (currentElement) {
                    return currentElement.PCPRequiredMEDICAREBENEFITS === "Yes";
                    // return currentElement.SubType__c === "PPO";
                });

                //console.log(JSON.stringify(filteredPlans));
                this.plansOrdered = filteredPlans;
            } else if (this.selectedOption === "no") {

                let filteredPlans = this.plansOrdered.filter(function (currentElement) {
                    return currentElement.PCPRequiredMEDICAREBENEFITS === "No";
                    // return currentElement.SubType__c === "HMO";
                });

                this.plansOrdered = filteredPlans;
            }

        }

    }

    changeHandler(event) {
        let field = event.detail.name;
        this.plansOrdered = this.newPlans;
        console.log("change calllling");
        if (field === 'optionSelect') {
            this.sortHandler(event);
            return
        }
        this.filterHandler(event);


    }

    customFilter = (arr, fn) => {
        let result = [];
        for (let e of arr) {
            fn(e) ? result.push(e) : "";
        }
        return result
    }

    //reset order
    resetHandler(event) {
        //this.selectedOption = undefined;

        // this.querySelectorAll('form-item').forEach(element => {
        //     if(element.type === 'checkbox' || element.type === 'radio'){
        //       element.checked = false;
        //     }
        //   });

        console.log("resetttt");


        // this.plansOrdered = [...this.origPlan];
        // this.chckspec = "hide";
        // this.chckcmed = "hide";
        // document.getElementById("medical-prescription").checked = false;
        // document.getElementsByName("pcpRequired").checked = false;
        //document.getElementById("spec-needs").removeAttribute('checked');
        //document.querySelectorAll(".slds-checkbox [type=checkbox]:checked")
    }

    //sorting
    getSortOrderIncrease = (prop) => {
        console.log('Inside the getSortOrderIncrease, the prop: ', prop);
        try {
            return function (a, b) {
                if (a[prop] > b[prop]) {
                    return 1;
                } else if (a[prop] < b[prop]) {
                    return -1;
                }
                return 0;
            }
        } catch (exception) {
            console.log('There was an exception: ', exception);
        }
    }

    getSortOrderDecrease = (prop) => {
        return function (a, b) {
            if (a[prop] < b[prop]) {
                return 1;
            } else if (a[prop] > b[prop]) {
                return -1;
            }
            return 0;
        }
    }

    //end of sorting

    showModal(event) {
        let cid = event.target.dataset.id;
        console.log("id:", cid);

        this.product = this.plans[cid];
        console.log("product:", JSON.stringify(this.product));

        this.openModal = true;
    }

    closeModal() {
        this.openModal = false;
    }

    isSelectedQuote = false;
    isDisableQuote = false;
    btnQuote() {
        if (this.isSelectedEnroll == true) {
            //if enroll is selected do nothing
        } else if (this.isSelectedQuote == false) {
            this.isSelectedQuote = true;
        } else if (this.isSelectedQuote == true) {
            this.isSelectedQuote = false;
        }
    }

    isSelectedEnroll = false;
    btnEnroll() {
        if (this.isSelectedQuote == true && this.isSelectedEnroll == false) {
            this.isSelectedQuote = false;
            window.alert("You are now choosing to enroll in this plan. You will not receive a quote for any other plans.");
            //disable others enroll buttons
            this.isSelectedEnroll = true;
        } else if (this.isSelectedQuote == false && this.isSelectedEnroll == false) {
            //disable others enroll buttons
            this.isSelectedEnroll = true;
        } else if (this.isSelectedEnroll == true) {
            this.isSelectedEnroll = false;
        }

    }
}