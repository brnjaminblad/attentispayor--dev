import { LightningElement, api } from 'lwc';
import {OmniscriptBaseMixin} from 'vlocity_ins/omniscriptBaseMixin';

export default class PlanDetailedView extends OmniscriptBaseMixin(LightningElement) {

    @api plans;
    plansOrdered;
    product;
    viewState = true;
    openModal = false;
    openModalCompare = false;
    openDisclaimer = true;
   
    newPlans;
    errorNext = false;
    sendPlans;

    typeSelectedOption;
    pcpSelectedOption;
    sortSelectedOption

    pcprqrdy;
    pcprqrdn;
    showBoolY;
    showBoolN;
    resetSelect;

    connectedCallback() {
        this.plansOrdered = this.plans;

        this.origPlan = this.plans;

        this.pcprqrdy = "yes";
        this.pcprqrdn = "no";

        this.showBoolY = false;
        this.showBoolN = false;

        try {
            this.newPlans = JSON.parse(JSON.stringify(this.plansOrdered));

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
                            if (this.newPlans[i]['Price'] == null) {
                                this.newPlans[i]['Price'] = "0";
                            }

                        }
                    }
                }
            }

            for (let i = 0; i < this.plansOrdered.length; i++) {
                this.newPlans[i]['btnCompareLabel'] = 'Add Up to 3 Plans to Compare';
                this.newPlans[i]['btnCompareDisable'] = 'custom-btn';
                this.newPlans[i]['btnEnrollLabel'] = 'Enroll Now';
                this.newPlans[i]['btnEnrollDisable'] = 'custom-btn';
                this.newPlans[i]['btnQuote'] = 'false';
                this.newPlans[i]['cardBorder'] = 'plancard';
            }

            //console.log(JSON.stringify(this.newPlans));
            this.plansOrdered = this.newPlans;
            //console.log(JSON.stringify(this.plansOrdered));
        } catch (exception) {
            console.log('Exception:', exception);
        }

    }

    filterSortHandler(event) {
        try {
            let field = event.detail.name;

            if (field === 'optionSelectFilter') {
                this.typeSelectedOption = event.detail.value;
                console.log('The selected option: ', this.typeSelectedOption);

                if (this.typeSelectedOption === 'optionMedicalPrescript') {
                    console.log('optionMedicalPrescript');
                } else if (this.typeSelectedOption === 'optionSpecNeeds') {
                    console.log('optionSpecNeeds');
                }
            }

            if (field === 'pcpRequired') {
                this.pcpSelectedOption = event.detail.value;
                console.log('The selected option: ', this.pcpSelectedOption);
                if (this.pcpSelectedOption === "yes") {
                    this.showBoolY = true;
                    this.showBoolN = false;
                    console.log('checkded bool yes' + this.showBoolY);
                    console.log('checkded bool no' + this.showBoolN);
                } else if (this.pcpSelectedOption === "no") {
                    this.showBoolN = true;
                    this.showBoolY = false;
                    console.log('checkded bool yes' + this.showBoolY);
                    console.log('checkded bool no' + this.showBoolN);
                }
            }

            if (field === 'sortSelectedOption') {
                this.sortSelectedOption = event.detail.value;
                if (this.sortSelectedOption === "low-to-high") {
                    console.log('low-to-high');
                } else if (this.sortSelectedOption === "high-to-low") {
                    console.log('high-to-low');
                } else if (this.sortSelectedOption === "name") {
                    console.log('name');
                }
            }

            console.log('Inside filterSortHandler, typeSelectedOption: ', this.typeSelectedOption, ' pcpSelectedOption: ', this.pcpSelectedOption, ' sort: ', this.sortSelectedOption);

            let typeFilteredJson = this.plansOrdered;
            if (this.typeSelectedOption === 'optionMedicalPrescript') {
                typeFilteredJson = this.plansOrdered.filter(function (currentElement) {
                    return currentElement.PlanType === "HMO" || currentElement.PlanType === "HMO-POS";
                });
            } else if (this.typeSelectedOption === 'optionSpecNeeds') {
                typeFilteredJson = this.plansOrdered.filter(function (currentElement) {
                    return currentElement.PlanType === "D-SNP";
                });
            }

            let pcpFilteredJson = typeFilteredJson;
            if (this.pcpSelectedOption === 'yes') {
                pcpFilteredJson = typeFilteredJson.filter(function (currentElement) {
                    return currentElement.PCPRequiredMEDICAREBENEFITS === "Yes";
                });
            } else if (this.pcpSelectedOption === 'no') {
                pcpFilteredJson = typeFilteredJson.filter(function (currentElement) {
                    return currentElement.PCPRequiredMEDICAREBENEFITS === "No";
                });
            }

            if (this.sortSelectedOption === "low-to-high") {
                pcpFilteredJson.sort(this.getSortOrderIncrease("Price"));
            } else if (this.sortSelectedOption === "high-to-low") {
                pcpFilteredJson.sort(this.getSortOrderDecrease("Price"));
            }
            else if (this.sortSelectedOption === "name") {
                pcpFilteredJson.sort(this.getSortOrderIncrease("Name"));
            }

            this.plansOrdered = pcpFilteredJson;

        } catch (exception) {
            console.log('There was an exception: ', exception);
        }

    }

    changeHandler(event) {
        this.plansOrdered = this.newPlans;
        this.filterSortHandler(event);
    }

    //reset filters
    resetHandler(event) {

        this.plansOrdered = [...this.newPlans];
        this.specialChecked = "hide";
        this.medicalChecked = "hide";
        this.showBoolY = false;
        this.showBoolN = false;

        this.resetSelect = false;

        this.pcpSelectedOption = undefined;
        this.sortSelectedOption = undefined;
        this.typeSelectedOption = undefined;
        console.log('Inside filterSortHandler, typeSelectedOption: ', this.typeSelectedOption, ' pcpSelectedOption: ', this.pcpSelectedOption, ' sort: ', this.sortSelectedOption);

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

    //compare plans modal

        showModalCompare(event) {
        let cardid = event.target.dataset.id;
        //console.log("id:", cardid);
        this.product = this.plansOrdered[cardid];
        console.log("product:", JSON.stringify(this.product));
        this.openModalCompare = true;
    }

    closeModalCompare() {
        this.openModalCompare = false;
    }

    showModal(event) {
        let cardid = event.target.dataset.id;
        //console.log("id:", cardid);
        this.product = this.plansOrdered[cardid];
        //console.log("product:", JSON.stringify(this.product));
        this.openModal = true;
    }

    closeModal() {
        this.openModal = false;
    }

//compare up to 3 plans
// btnComparePlans(event) {
//     let cardid = event.target.dataset.id;
//     //console.log(cardid);
//     let comparingArray = JSON.parse(JSON.stringify(this.plansOrdered));
//     let countPlans = 0;
//     for (let i = 0; i < this.plansOrdered.length; i++) {
//         if (this.plansOrdered[i]['btnCompareLabel'] == 'Added to Compare') {
//             countPlans = countPlans + 1;
//         }
//     }
//     if (this.plansOrdered[cardid]['btnCompareLabel'] == 'Add Up to 3 Plans to Compare' && countPlans < 3) {
//         comparingArray[cardid]['btnCompareLabel'] = 'Added to Compare';
//         console.log(comparingArray)
//     }
//     if (this.plansOrdered[cardid]['btnCompareLabel'] == 'Added to Compare') {
//         comparingArray[cardid]['btnCompareLabel'] = 'Add Up to 3 Plans to Compare';
//     }
//     this.plansOrdered = comparingArray;
//     //console.log(JSON.stringify(this.plansOrdered));
// }
   
    //compare buttons dtnamucally changing
    btnCompare(event) {
        let cardid = event.target.dataset.id;
        //console.log(cardid);
        let temporalarray = JSON.parse(JSON.stringify(this.plansOrdered));
        let count = 0;
        for (let i = 0; i < this.plansOrdered.length; i++) {
            if (this.plansOrdered[i]['btnCompareLabel'] == 'Added to Compare') {
                count = count + 1;
            }
        }
        if (this.plansOrdered[cardid]['btnCompareLabel'] == 'Add Up to 3 Plans to Compare' && count < 3) {
            temporalarray[cardid]['btnCompareLabel'] = 'Added to Compare';
            console.log(temporalarray)
        }
        if (this.plansOrdered[cardid]['btnCompareLabel'] == 'Added to Compare') {
            temporalarray[cardid]['btnCompareLabel'] = 'Add Up to 3 Plans to Compare';
        }
        this.plansOrdered = temporalarray;
        //console.log(JSON.stringify(this.plansOrdered));
    }

    btnQuote(event) {
        let cardid = event.target.dataset.id;
        //console.log(cardid);
        let temporalarray = JSON.parse(JSON.stringify(this.plansOrdered));
        let count = 0;
        for (let i = 0; i < this.plansOrdered.length; i++) {
            if (this.plansOrdered[i]['btnEnrollLabel'] == 'Do Not Enroll') {
                count = count + 1;
            }
        }
        if (this.plansOrdered[cardid]['btnQuote'] == 'false' && count < 1) {
            temporalarray[cardid]['btnQuote'] = 'true';
            temporalarray[cardid]['cardBorder'] = 'highlightplancard';
        }
        if (this.plansOrdered[cardid]['btnQuote'] == 'true') {
            temporalarray[cardid]['btnQuote'] = 'false';
            temporalarray[cardid]['cardBorder'] = 'plancard';
        }
        this.plansOrdered = temporalarray;
        //console.log("plan:", cardid, "quote state:", this.plansOrdered[cardid]['btnQuote']);
    }

    btnEnroll(event) {
        let cardid = event.target.dataset.id;
        //console.log(cardid);
        let temporalarray = JSON.parse(JSON.stringify(this.plansOrdered));
        let count = 0;
        for (let i = 0; i < this.plansOrdered.length; i++) {
            if (this.plansOrdered[i]['btnEnrollLabel'] == 'Do Not Enroll') {
                count = count + 1;
            }
        }

        if (this.plansOrdered[cardid]['btnEnrollLabel'] == 'Enroll Now' && count < 1) {

            //check if a plan is selected to quote
            let countQuote = 0;
            for (let i = 0; i < this.plansOrdered.length; i++) {
                if (temporalarray[i]['btnQuote'] == 'true') {
                    countQuote = countQuote + 1;
                }
            }
            if (countQuote > 0) {
                window.alert("You are now choosing to enroll in this plan. You will not receive a quote for any other plans.");
            }

            //put the rest of enroll buttons disabled
            for (let i = 0; i < this.plansOrdered.length; i++) {
                temporalarray[i]['btnEnrollLabel'] = 'Enroll Now';
                temporalarray[i]['btnQuote'] = 'false';
                temporalarray[i]['cardBorder'] = 'plancard';
                temporalarray[i]['btnEnrollDisable'] = 'custom-btn-disabled';
            }

            temporalarray[cardid]['cardBorder'] = 'highlightplancard';
            temporalarray[cardid]['btnEnrollLabel'] = 'Do Not Enroll';
            temporalarray[cardid]['btnEnrollDisable'] = 'custom-btn';

            //Pin the plan card to the bottom
            let pincard = JSON.parse(JSON.stringify(temporalarray.splice(cardid, 1)));
            temporalarray.push(pincard[0]);
        }

        if (this.plansOrdered[cardid]['btnEnrollLabel'] == 'Do Not Enroll') {
            temporalarray[cardid]['cardBorder'] = 'plancard';
            temporalarray[cardid]['btnEnrollLabel'] = 'Enroll Now';
            for (let i = 0; i < this.plansOrdered.length; i++) {
                temporalarray[i]['btnEnrollDisable'] = 'custom-btn';
            }
        }
        this.plansOrdered = temporalarray;
        //console.log("original:", JSON.stringify(this.plansOrdered));

    }

    changeView() {
        this.viewState = !this.viewState;
        let temporalarray = JSON.parse(JSON.stringify(this.plansOrdered));

        //unselect add to compare
        for (let i = 0; i < this.plansOrdered.length; i++) {
            if (temporalarray[i]['btnCompareLabel'] == 'Added to Compare') {
                temporalarray[i]['btnCompareLabel'] = 'Add Up to 3 Plans to Compare';
            }
        }
        this.plansOrdered = temporalarray;
    }

    closeDisclaimer() {
        this.openDisclaimer = false;
    }

    next() {
        let temporalarray = JSON.parse(JSON.stringify(this.plansOrdered));
        //check if a plan is selected to enroll
        let enroll = 0;
        for (let i = 0; i < this.plansOrdered.length; i++) {
            if (this.plansOrdered[i]['btnEnrollLabel'] == 'Do Not Enroll') {
                enroll = 1;
                this.sendPlans = this.plansOrdered[i];
            }
        }
        //check if a plan is selected to quote
        let quote = 0;
        if (enroll == 0) {
            for (let i = 0; i < this.plansOrdered.length; i++) {
                if (this.plansOrdered[i]['btnQuote'] == 'true') {
                    quote = quote + 1;
                    if (quote == 1) {
                        this.sendPlans = this.plansOrdered[i];
                    } else if (quote > 1) {
                        //let pincard = JSON.parse(JSON.stringify(temporalarray.splice(i, 1)));
                        //this.sendPlans.push(pincard[0]);
                    }
                }
            }
        }

        if (quote > 0 || enroll == 1) {
            this.omniNextStep();
            console.log(JSON.stringify(this.sendPlans));
        } else {
            this.errorNext = true;
            console.log(JSON.stringify(this.sendPlans));
        }

    }

    previous() {
        this.omniPrevStep();
    }

    closeErrorNext() {
        this.errorNext = false;
    }

}