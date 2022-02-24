import { LightningElement, api, track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class PlanCards extends OmniscriptBaseMixin(LightningElement) {

    @api plans;
    @track plansOrdered;
    @track origPlans;
    @track temporalarray;

    product;
    viewState = true;
    openModalCompare = false;
    openDisclaimer = true;
    @track newPlans;
    errorNext = false;
    sendPlans = [];

    typeSelectedOption;
    pcpSelectedOption;
    sortSelectedOption

    @track pcprqrdy;
    @track pcprqrdn;
    @track showBoolY;
    @track showBoolN;
    @track resetSelect;

    countArray = [];
    @track planCount = 0;

    matchHeight;
    getHighest;

    connectedCallback() {
        this.plansOrdered = this.plans;
        this.pcprqrdy = "yes";
        this.pcprqrdn = "no";
        this.showBoolY = false;
        this.showBoolN = false;

        try {
            this.newPlans = JSON.parse(JSON.stringify(this.plansOrdered));

            //loop for attributes
            for (let i = 0; i < this.plansOrdered.length; i++) {
                //console.log("plan:", i, JSON.stringify(this.plansOrdered[i]));
                if (this.plansOrdered[i].attributeCategories) {
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
                } else {
                    console.log(this.plansOrdered[i].Name, 'no attributes');
                }
            }
            //loop for coverages
            for (let i = 0; i < this.plansOrdered.length; i++) {
                //console.log("plan:", i, JSON.stringify(this.plansOrdered[i]));
                if (this.plansOrdered[i].childProducts) {
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

                            }
                        }
                    }
                } else {
                    console.log(this.plansOrdered[i].Name, 'no coverages');
                }
            }

            for (let i = 0; i < this.plansOrdered.length; i++) {
                this.newPlans[i]['btnCompareLabel'] = 'Add Up to 3 Plans to Compare';
                this.newPlans[i]['btnCompareDisable'] = 'custom-btn';
                this.newPlans[i]['btnEnrollLabel'] = 'Enroll Now';
                this.newPlans[i]['btnEnrollDisable'] = 'custom-btn';
                this.newPlans[i]['btnQuote'] = 'false';
                this.newPlans[i]['cardBorder'] = 'plancard';

                if (this.newPlans[i]['Price'] == null) {
                    this.newPlans[i]['Price'] = 0;
                }

                //add decimals to prices
                if (this.newPlans[i]['Price'] == 0) {
                    this.newPlans[i]['Price'] = (this.newPlans[i]['Price'] / 100).toFixed(2);
                } else {
                    this.newPlans[i]['Price'] = this.newPlans[i]['Price'].toFixed(Math.max(((this.newPlans[i]['Price'] + '').split(".")[1] || "").length, 2));
                }
            }

            //console.log(JSON.stringify(this.newPlans));
            this.plansOrdered = this.newPlans;
            this.origPlans = [...this.newPlans];
            //console.log(JSON.stringify(this.plansOrdered));
        } catch (exception) {
            console.log('Exception:', exception);
        }
    }

    //focus on close modal
    renderedCallback() {
        let compareModalContainer = this.template.querySelector(".compare-modal-container");
        if (this.template.querySelector(".close-compare") != undefined || this.template.querySelector(".close-compare") != null) {
            this.template.querySelector(".close-compare").focus();
        }
        if (this.planCount == 1 && compareModalContainer != null) {
            compareModalContainer.style.width = "50%";

        } else if (this.planCount == 2 && compareModalContainer != null) {
            compareModalContainer.style.width = "70%"
        } else if (this.planCount == 3 && compareModalContainer != null) {
            compareModalContainer.style.width = "90%"
        }

        if (this.planCount > 0) {
            this.template.querySelector(".compare-modal-btn").disabled = false;
        }

        this.matchHeight();
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
                //remove decimals
                for (let i = 0; i < pcpFilteredJson.length; i++) {
                    pcpFilteredJson[i]['Price'] = Number(pcpFilteredJson[i]['Price']);
                }
                pcpFilteredJson.sort(this.getSortOrderIncrease("Price"));
                //add decimals again
                for (let i = 0; i < pcpFilteredJson.length; i++) {
                    if (pcpFilteredJson[i]['Price'] == 0) {
                        pcpFilteredJson[i]['Price'] = (pcpFilteredJson[i]['Price'] / 100).toFixed(2);
                    } else {
                        pcpFilteredJson[i]['Price'] = pcpFilteredJson[i]['Price'].toFixed(Math.max(((pcpFilteredJson[i]['Price'] + '').split(".")[1] || "").length, 2));
                    }
                }
            } else if (this.sortSelectedOption === "high-to-low") {
                //remove decimals
                for (let i = 0; i < pcpFilteredJson.length; i++) {
                    pcpFilteredJson[i]['Price'] = Number(pcpFilteredJson[i]['Price']);
                }
                pcpFilteredJson.sort(this.getSortOrderDecrease("Price"));
                //add decimals again
                for (let i = 0; i < pcpFilteredJson.length; i++) {
                    if (pcpFilteredJson[i]['Price'] == 0) {
                        pcpFilteredJson[i]['Price'] = (pcpFilteredJson[i]['Price'] / 100).toFixed(2);
                    } else {
                        pcpFilteredJson[i]['Price'] = pcpFilteredJson[i]['Price'].toFixed(Math.max(((pcpFilteredJson[i]['Price'] + '').split(".")[1] || "").length, 2));
                    }
                }
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
       // this.plansOrdered = this.newPlans;
       if (this.temporalarray != null) {
        this.plansOrdered = [...this.temporalarray];
      }
        else {
            this.plansOrdered = this.newPlans;
        }
        this.filterSortHandler(event);
    }

    //reset filters
    resetHandler(event) {
        this.countArray = [];
        this.planCount = 0;
        if (this.template.querySelector(".compare-modal-btn") != null) {
            this.template.querySelector(".compare-modal-btn").disabled = true;
        }

        this.plansOrdered = [...this.origPlans];
        this.temporalarray = [...this.origPlans];
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

  

    //set cells to be high as the heighest cell
    matchHeight = () => {
        let getDivs = this.template.querySelectorAll(".match-height");
        let arrayLength = getDivs.length;
        let heights = [];

        for (let i = 0; i < arrayLength; i++) {
            heights.push(getDivs[i].offsetHeight);
        }

        this.getHighest = () => {
            return Math.max(...heights);
        }

        let tallest = this.getHighest();

        for (let i = 0; i < getDivs.length; i++) {
            getDivs[i].style.height = tallest + "px";
        }

    }

    //compare plans modal
    showModalCompare(event) {
        let cardid = event.target.dataset.id;
        this.product = this.plansOrdered[cardid];
        console.log("product:", JSON.stringify(this.product));
        this.openModalCompare = true;
    }

    closeModalCompare() {
        this.openModalCompare = false;
    }
    //end compare plans modal

    openModal(event) {
        let cardid = event.target.dataset.id;
        this.product = this.plansOrdered[cardid];
        const modal = this.template.querySelector("c-hs-plan-modal");
        modal.show();
    }

    // compare plans
    btnCompare(event) {
        let cardid = event.target.dataset.id;
        let addCompareButton = event.target.label;
        //console.log(cardid);
        this.temporalarray = JSON.parse(JSON.stringify(this.plansOrdered));
        let count = 0;

        for (let i = 0; i < this.plansOrdered.length; i++) {
            if (this.plansOrdered[i]['btnCompareLabel'] == 'Added to Compare') {
                count = count + 1;
            }
        }

        // counting plans
        if (addCompareButton == 'Add Up to 3 Plans to Compare' && this.planCount < 3) {
            this.planCount++;
            this.product = this.plansOrdered[cardid];
            this.temporalarray[cardid]['btnCompareLabel'] = 'Added to Compare';
            this.countArray = [...this.countArray, this.product];
            this.template.querySelector(".compare-modal-btn").disabled = false;

        } else if (addCompareButton == 'Added to Compare') {
            this.planCount--;

            if (this.planCount == 0) {
                this.template.querySelector(".compare-modal-btn").disabled = true;
            }

            this.product = this.plansOrdered[cardid];
            this.temporalarray[cardid]['btnCompareLabel'] = 'Add Up to 3 Plans to Compare';

            this.countArray.splice(this.product, 1);

        }

        this.plansOrdered =[...this.temporalarray];

    }

    // btnQuote(event) {
    //     let cardid = event.target.dataset.id;
    //     let quoteArray = JSON.parse(JSON.stringify(this.plansOrdered));
    //     let count = 0;
    //     for (let i = 0; i < this.plansOrdered.length; i++) {
    //         if (this.plansOrdered[i]['btnEnrollLabel'] == 'Do Not Enroll') {
    //             count = count + 1;
    //         }
    //     }
    //     if (this.plansOrdered[cardid]['btnQuote'] == 'false' && count < 1) {
    //         quoteArray[cardid]['btnQuote'] = 'true';
    //         quoteArray[cardid]['cardBorder'] = 'highlightplancard';
    //     }
    //     if (this.plansOrdered[cardid]['btnQuote'] == 'true') {
    //         quoteArray[cardid]['btnQuote'] = 'false';
    //         quoteArray[cardid]['cardBorder'] = 'plancard';
    //     }
    //     this.plansOrdered = quoteArray;
    // }

    btnQuote(event) {
        let cardid = event.target.dataset.id;
        let quoteArray = JSON.parse(JSON.stringify(this.plansOrdered));
        console.log(JSON.parse(JSON.stringify(this.plansOrdered)));
        for (let i = 0; i < this.plansOrdered.length; i++) {
            if (i.toString() === cardid) {
                if (this.plansOrdered[cardid]['btnQuote'] == 'false') {
                    quoteArray[i]['btnQuote'] = 'true';
                    quoteArray[i]['cardBorder'] = 'highlightplancard';
                }
                if (this.plansOrdered[cardid]['btnQuote'] == 'true') {
                    quoteArray[i]['btnQuote'] = 'false';
                    quoteArray[i]['cardBorder'] = 'plancard';
                }
            } else if (this.plansOrdered[cardid]['btnQuote'] == 'false') {
                quoteArray[i]['btnQuote'] = 'false';
                quoteArray[i]['cardBorder'] = 'plancard';
            }
        }
       
        this.plansOrdered = quoteArray;
    }

    // btnEnroll(event) {
    //     let cardid = event.target.dataset.id;
    //     //console.log(cardid);
    //     let enrollArray = JSON.parse(JSON.stringify(this.plansOrdered));
    //     let count = 0;
    //     for (let i = 0; i < this.plansOrdered.length; i++) {
    //         if (this.plansOrdered[i]['btnEnrollLabel'] == 'Do Not Enroll') {
    //             count = count + 1;
    //         }
    //     }

    //     if (this.plansOrdered[cardid]['btnEnrollLabel'] == 'Enroll Now' && count < 1) {

    //         //check if a plan is selected to quote
    //         let countQuote = 0;
    //         for (let i = 0; i < this.plansOrdered.length; i++) {
    //             if (enrollArray[i]['btnQuote'] == 'true') {
    //                 countQuote = countQuote + 1;
    //             }
    //         }
    //         if (countQuote > 0) {
    //             window.alert("You are now choosing to enroll in this plan. You will not receive a quote for any other plans.");
    //         }

    //         //put the rest of enroll buttons disabled
    //         for (let i = 0; i < this.plansOrdered.length; i++) {
    //             enrollArray[i]['btnEnrollLabel'] = 'Enroll Now';
    //             enrollArray[i]['btnQuote'] = 'false';
    //             enrollArray[i]['cardBorder'] = 'plancard';
    //             enrollArray[i]['btnEnrollDisable'] = 'custom-btn-disabled';
    //         }

    //         enrollArray[cardid]['cardBorder'] = 'highlightplancard';
    //         enrollArray[cardid]['btnEnrollLabel'] = 'Do Not Enroll';
    //         enrollArray[cardid]['btnEnrollDisable'] = 'custom-btn';

    //         //Pin the plan card to the bottom
    //         let pincard = JSON.parse(JSON.stringify(enrollArray.splice(cardid, 1)));
    //         enrollArray.push(pincard[0]);
    //     }

    //     if (this.plansOrdered[cardid]['btnEnrollLabel'] == 'Do Not Enroll') {
    //         enrollArray[cardid]['cardBorder'] = 'plancard';
    //         enrollArray[cardid]['btnEnrollLabel'] = 'Enroll Now';
    //         for (let i = 0; i < this.plansOrdered.length; i++) {
    //             enrollArray[i]['btnEnrollDisable'] = 'custom-btn';
    //         }
    //     }
    //     this.plansOrdered = enrollArray;
    //     //console.log("original:", JSON.stringify(this.plansOrdered));
    // }

    changeView() {
        this.viewState = !this.viewState;
        let changeViewArray = JSON.parse(JSON.stringify(this.plansOrdered));

        //unselect add to compare
        // for (let i = 0; i < this.plansOrdered.length; i++) {
        //     if (changeViewArray[i]['btnCompareLabel'] == 'Added to Compare') {
        //         changeViewArray[i]['btnCompareLabel'] = 'Add Up to 3 Plans to Compare';
        //     }
        // }
        if (this.planCount > 0) {
            this.template.querySelector(".compare-modal-btn").disabled = false;
        }
        this.plansOrdered = changeViewArray;
    }

    closeDisclaimer() {
        this.openDisclaimer = false;
    }

    next() {
        //check if a plan is selected to enroll
        let enroll = 0;
        for (let i = 0; i < this.plansOrdered.length; i++) {
            if (this.plansOrdered[i]['btnEnrollLabel'] == 'Do Not Enroll') {
                enroll = 1;
                this.sendPlans[0] = this.plansOrdered[i];
            }
        }
        //check if a plan is selected to quote
        let quote = 0;
        if (enroll == 0) {
            //let testArray = JSON.parse(JSON.stringify(this.plansOrdered));
            for (let i = 0; i < this.plansOrdered.length; i++) {
                if (this.plansOrdered[i]['btnQuote'] == 'true') {
                    quote = quote + 1;
                    if (quote == 1) {
                        this.sendPlans[0] = this.plansOrdered[i];
                    } else if (quote > 1) {
                        //let pincard = JSON.parse(JSON.stringify(temporalArray.splice(i, 1)));
                        this.sendPlans.push(this.plansOrdered[i]);
                    }
                }
            }
        }
        let tempSelectedPlans = { "selectedPlans": this.sendPlans };
        if (quote > 0 || enroll == 1) {
            //console.log(JSON.stringify(this.sendPlans));
            //console.log(tempSelectedPlans);
            this.omniApplyCallResp(tempSelectedPlans);
            this.omniNextStep();
        } else {
            this.errorNext = true;
            //console.log(JSON.stringify(this.sendPlans));
            //console.log(tempSelectedPlans);
            this.omniApplyCallResp(tempSelectedPlans);
        }
    }

    previous() {
        this.omniPrevStep();
    }

    closeErrorNext() {
        this.errorNext = false;
    }

}