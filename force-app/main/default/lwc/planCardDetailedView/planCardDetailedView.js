import { LightningElement, api, track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class PlanCardDetailedView extends OmniscriptBaseMixin(LightningElement) {

    countPlansToQuote = 0;
    countPlansToCompare = 0;

    @api plans;
    @track plansOrdered;
    @track origPlans;
    @track temporalarray;

    product;
    viewState = false;
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

        this.origPlan = this.plans;

        this.pcprqrdy = "yes";
        this.pcprqrdn = "no";

        this.showBoolY = false;
        this.showBoolN = false;

        try {
            this.newPlans = JSON.parse(JSON.stringify(this.plansOrdered));

            //loop for attributeCategories(attributes)
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
            //loop for childProducts(coverages)
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
                this.newPlans[i]['btnCompareLabel'] = 'Add Up to 3 to Compare';
                this.newPlans[i]['checkCompareDisabled'] = false;
                this.newPlans[i]['checkboxQuoteDisabled'] = false;
                this.newPlans[i]['checkboxQuote'] = false;

                this.newPlans[i]['btnEnrollLabel'] = 'Enroll Now';
                this.newPlans[i]['btnEnrollDisable'] = 'custom-btn';

                this.newPlans[i]['cardBorder'] = 'plancard';

                //add decimals to prices
                if (this.newPlans[i]['Price'] == 0) {
                    this.newPlans[i]['Price'] = (this.newPlans[i]['Price'] / 100).toFixed(2);
                } else {
                    this.newPlans[i]['Price'] = this.newPlans[i]['Price'].toFixed(Math.max(((this.newPlans[i]['Price'] + '').split(".")[1] || "").length, 2));
                }
            }

            //console.log(JSON.stringify(this.newPlans));
            this.plansOrdered = this.newPlans;
            //console.log(JSON.stringify(this.plansOrdered));
        } catch (exception) {
            console.log('Exception:', exception);
        }

    }

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
                this.newPlans[i]['btnCompareLabel'] = 'Add Up to 3 to Compare';
                this.newPlans[i]['checkCompareDisabled'] = false;
                this.newPlans[i]['checkboxQuoteDisabled'] = false;
                this.newPlans[i]['checkboxQuote'] = false;

                this.newPlans[i]['btnEnrollLabel'] = 'Enroll Now';
                this.newPlans[i]['btnEnrollDisable'] = 'custom-btn';

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
            //this.plansOrdered = this.newPlans;
            this.origPlans = [...this.newPlans];
         
            //default sorted plans - low to high

            let defaultSort = [...this.newPlans];
            
    
            for (let i = 0; i < defaultSort.length; i++) {
                defaultSort[i]['Price'] = Number(defaultSort[i]['Price']);
            }
            defaultSort.sort(this.getSortOrderIncrease("Price"));
            //add decimals again
            for (let i = 0; i < defaultSort.length; i++) {
                if (defaultSort[i]['Price'] == 0) {
                    defaultSort[i]['Price'] = (defaultSort[i]['Price'] / 100).toFixed(2);
                } else {
                    defaultSort[i]['Price'] = defaultSort[i]['Price'].toFixed(Math.max(((defaultSort[i]['Price'] + '').split(".")[1] || "").length, 2));
                }
            }
            this.plansOrdered = defaultSort;



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
            else {
                console.log('inside')
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
            }

            this.plansOrdered = pcpFilteredJson;

        } catch (exception) {
            console.log('There was an exception: ', exception);
        }
        console.log("outsiede");
       

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
        const modal = this.template.querySelector("c-plan-modal");
        modal.show();
    }

    comparecheckbox(event) {
        let cardid = event.target.dataset.id;

        let compareTemporalArray = JSON.parse(JSON.stringify(this.plansOrdered));

        //change label and add to compare
        if (event.target.checked == true && this.countPlansToCompare < 3) {
            compareTemporalArray[cardid]['btnCompareLabel'] = 'Added to Compare';
            this.countPlansToCompare = this.countPlansToCompare + 1;
            //console.log('label:', this.plansOrdered[cardid]['btnCompareLabel']);

            this.planCount++;
            this.product = compareTemporalArray[cardid];
            this.countArray = [...this.countArray, this.product];
            this.template.querySelector(".compare-modal-btn").disabled = false;
            console.log('product:', this.product, '-' , 'array to compare', this.countArray);
        //change label and put off from compare
        } else if (event.target.checked == false) {
            compareTemporalArray[cardid]['btnCompareLabel'] = 'Add Up to 3 to Compare';
            this.countPlansToCompare = this.countPlansToCompare - 1;
            //console.log('label:', this.plansOrdered[cardid]['btnCompareLabel']);
            
            this.planCount--;
            if (this.planCount == 0) {
                this.template.querySelector(".compare-modal-btn").disabled = true;
            }
            this.product = compareTemporalArray[cardid];
            this.countArray.splice(this.product, 1);
            console.log('product:', this.product, '-' , 'array to compare', this.countArray);

        }

        //console.log('cardid:', cardid, '-', 'Plans to Compare:', this.countPlansToCompare);

        //disable the rest of compare checkboxes when 3 are selected
        if (this.countPlansToCompare == 3) {
            //console.log('cant add more plans to compare');

            for (let i = 0; i < this.plansOrdered.length; i++) {
                let checkcompare = document.getElementsByName(compareTemporalArray[i].Name);
                if (compareTemporalArray[i]['btnCompareLabel'] == 'Add Up to 3 to Compare') {
                    //console.log('checkbox:', i, checkcompare);
                    compareTemporalArray[i]['checkCompareDisabled'] = true;
                    //console.log(compareTemporalArray[i]['checkCompareDisabled']);

                    //checkcompare.setAttribute("checked", "true");
                    //checkcompare.setAttribute('disabled', '');
                    //checkcompare.setAttribute('title', 'testing title');
                }
            }
 
        //enable the rest of compare checkboxes when less than 3 are selected
        } else if (this.countPlansToCompare < 3) {
            for (let i = 0; i < this.plansOrdered.length; i++) {
                if (compareTemporalArray[i]['btnCompareLabel'] == 'Add Up to 3 to Compare') {
                    compareTemporalArray[i]['checkCompareDisabled'] = false;
                }
            }
        }

        this.plansOrdered = compareTemporalArray;

    }

    quoteCheckbox(event) {
        let cardid = event.target.dataset.id;

        let quoteTemporalArray = JSON.parse(JSON.stringify(this.plansOrdered));

        
        if (event.target.checked == true) {
            this.countPlansToQuote = this.countPlansToQuote + 1;
            quoteTemporalArray[cardid]['cardBorder'] = 'highlightplancard';
            quoteTemporalArray[cardid]['checkboxQuote'] = 'true';
        } else if (event.target.checked == false) {
            this.countPlansToQuote = this.countPlansToQuote - 1;
            quoteTemporalArray[cardid]['cardBorder'] = 'plancard';
            quoteTemporalArray[cardid]['checkboxQuote'] = 'false';
        }
        console.log('cardid', cardid);
        console.log('for quote: ', this.countPlansToQuote);

        this.plansOrdered = quoteTemporalArray;
    }

    btnEnroll(event) {
        let cardid = event.target.dataset.id;

        //console.log(cardid);
        let enrollTemporlArray = JSON.parse(JSON.stringify(this.plansOrdered));
        let count = 0;
        for (let i = 0; i < this.plansOrdered.length; i++) {
            if (this.plansOrdered[i]['btnEnrollLabel'] == 'Do Not Enroll') {
                count = count + 1;
            }
        }

        //click enroll
        if (this.plansOrdered[cardid]['btnEnrollLabel'] == 'Enroll Now' && count < 1) {

            //check if a plan is selected to quote
            
            if (this.countPlansToQuote > 0) {
                window.alert("You are now choosing to enroll in this plan. You will not receive a quote for any other plans.");
                this.countPlansToQuote = 0;
            }

            //put the rest of enroll buttons disabled
            for (let i = 0; i < this.plansOrdered.length; i++) {
                enrollTemporlArray[i]['btnEnrollLabel'] = 'Enroll Now';
                enrollTemporlArray[i]['checkboxQuoteDisabled'] = true;
                enrollTemporlArray[i]['checkboxQuote'] = 'false';
                enrollTemporlArray[i]['cardBorder'] = 'plancard';
                enrollTemporlArray[i]['btnEnrollDisable'] = 'custom-btn-disabled';
            }

            enrollTemporlArray[cardid]['cardBorder'] = 'highlightplancard';
            enrollTemporlArray[cardid]['btnEnrollLabel'] = 'Do Not Enroll';
            enrollTemporlArray[cardid]['btnEnrollDisable'] = 'custom-btn';

            //Pin the plan card to the bottom
            let pincard = JSON.parse(JSON.stringify(enrollTemporlArray.splice(cardid, 1)));
            enrollTemporlArray.push(pincard[0]);
        }

        //click do not enroll
        if (this.plansOrdered[cardid]['btnEnrollLabel'] == 'Do Not Enroll') {
            enrollTemporlArray[cardid]['cardBorder'] = 'plancard';
            enrollTemporlArray[cardid]['btnEnrollLabel'] = 'Enroll Now';
            for (let i = 0; i < this.plansOrdered.length; i++) {
                enrollTemporlArray[i]['btnEnrollDisable'] = 'custom-btn';
                enrollTemporlArray[i]['checkboxQuoteDisabled'] = false;
            }
        }
        this.plansOrdered = enrollTemporlArray;
        //console.log("original:", JSON.stringify(this.plansOrdered));

    }

    changeView() {
        this.viewState = !this.viewState;
        this.countPlansToCompare = 0;
        this.countPlansToQuote = 0;

        let changeViewTemporalArray = JSON.parse(JSON.stringify(this.plansOrdered));


        for (let i = 0; i < this.plansOrdered.length; i++) {
            //unselect add to compare
            if (changeViewTemporalArray[i]['btnCompareLabel'] == 'Added to Compare') {
                changeViewTemporalArray[i]['btnCompareLabel'] = 'Add Up to 3 Plans to Compare';
            }

            //put off the highlight
            if (changeViewTemporalArray[i]['cardBorder'] == 'highlightplancard') {
                changeViewTemporalArray[i]['cardBorder'] = 'plancard';
            }

            /*
            //keep quote checkbox selected
            if(changeViewTemporalArray[i]['cardBorder'] == 'highlightplancard'){
                console.log('a card is selected to quote:', i);
                console.log('state:', document.getElementById(i));
               // document.getElementsByName('checkQuote').checked = true; this is not working
            }*/
        }
        this.plansOrdered = changeViewTemporalArray;
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
                if (this.plansOrdered[i]['checkboxQuote'] == 'true') {
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
        }

    }

    previous() {
        this.omniPrevStep();
    }

    closeErrorNext() {
        this.errorNext = false;
    }

    btnprint() { }

}