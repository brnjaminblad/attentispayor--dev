import { LightningElement, api, track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class PlanCardSelected extends OmniscriptBaseMixin(LightningElement) {

    @api plans;
    @track plansOrdered;

    product;
    viewState = false;
    openModalCompare = false;
    openDisclaimer = true;
    newPlans;
    errorNext = false;
    sendPlans;

    countArray = [];
    @track planCount = 0;

    countPlansToCompare = 0;

    connectedCallback() {
        this.plansOrdered = this.plans;

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
                this.newPlans[i]['btnCompareLabel'] = 'Add Up to 3 to Compare';
                this.newPlans[i]['checkCompareDisabled'] = false;
                this.newPlans[i]['btnEnrollLabel'] = 'Enroll Now';
                this.newPlans[i]['btnEnrollDisable'] = 'custom-btn';
                this.newPlans[i]['btnQuote'] = 'false';
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
            console.log('product:', this.product, '-', 'array to compare', this.countArray);
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
            console.log('product:', this.product, '-', 'array to compare', this.countArray);

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

    btnEnroll(event) {
        let cardid = event.target.dataset.id;
        //console.log(cardid);
        let enrollArray = JSON.parse(JSON.stringify(this.plansOrdered));
        let count = 0;
        for (let i = 0; i < this.plansOrdered.length; i++) {
            if (this.plansOrdered[i]['btnEnrollLabel'] == 'Do Not Enroll') {
                count = count + 1;
            }
        }

        if (this.plansOrdered[cardid]['btnEnrollLabel'] == 'Enroll Now' && count < 1) {

            //put the rest of enroll buttons disabled
            for (let i = 0; i < this.plansOrdered.length; i++) {
                enrollArray[i]['btnEnrollLabel'] = 'Enroll Now';
                enrollArray[i]['btnQuote'] = 'false';
                enrollArray[i]['cardBorder'] = 'plancard';
                enrollArray[i]['btnEnrollDisable'] = 'custom-btn-disabled';
            }

            enrollArray[cardid]['cardBorder'] = 'highlightplancard';
            enrollArray[cardid]['btnEnrollLabel'] = 'Do Not Enroll';
            enrollArray[cardid]['btnEnrollDisable'] = 'custom-btn';

            //Pin the plan card to the bottom
            let pincard = JSON.parse(JSON.stringify(enrollArray.splice(cardid, 1)));
            enrollArray.push(pincard[0]);
        }

        if (this.plansOrdered[cardid]['btnEnrollLabel'] == 'Do Not Enroll') {
            enrollArray[cardid]['cardBorder'] = 'plancard';
            enrollArray[cardid]['btnEnrollLabel'] = 'Enroll Now';
            for (let i = 0; i < this.plansOrdered.length; i++) {
                enrollArray[i]['btnEnrollDisable'] = 'custom-btn';
            }
        }
        this.plansOrdered = enrollArray;
        //console.log("original:", JSON.stringify(this.plansOrdered));

    }

    changeView() {
        this.viewState = !this.viewState;
        let changeViewArray = JSON.parse(JSON.stringify(this.plansOrdered));

        this.countPlansToCompare = 0;
        this.countArray = [];
        this.planCount = 0;
        //unselect add to compare
        for (let i = 0; i < this.plansOrdered.length; i++) {
            if (changeViewArray[i]['btnCompareLabel'] == 'Added to Compare') {
                changeViewArray[i]['btnCompareLabel'] = 'Add Up to 3 Plans to Compare';
            }
            changeViewArray[i]['checkCompareDisabled'] = false;
        }

        this.template.querySelector(".compare-modal-btn").disabled = true;
        /*if (this.planCount > 0) {
            this.template.querySelector(".compare-modal-btn").disabled = false;
        }*/
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
                this.sendPlans = this.plansOrdered[i];
            }
        }

        let selectedPlan = { "selectedPlan": this.sendPlans };
        if (enroll == 1) {
            //console.log(JSON.stringify(this.sendPlans));
            //console.log(tempSelectedPlans);
            this.omniApplyCallResp(selectedPlan);   
            this.omniNextStep();
        } else {
            this.errorNext = true;
        }

    }

    previous() {
        this.omniPrevStep();
    }

    closeErrorNext() {
        this.errorNext = false;
    }


}