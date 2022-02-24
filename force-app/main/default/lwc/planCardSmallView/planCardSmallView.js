import { LightningElement, api, track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class PlanCardSmallView extends OmniscriptBaseMixin(LightningElement) {

    @api plans;
    product;

    connectedCallback() {
        try {
            this.newPlans = JSON.parse(JSON.stringify(this.plans));

            //loop for attributes
            for (let i = 0; i < this.plans.length; i++) {
                //console.log("plan:", i, JSON.stringify(this.plans[i]));
                if (this.plans[i].attributeCategories) {
                    for (let a = 0; a < this.plans[i].attributeCategories.records.length; a++) {
                        //console.log("plan:", i, "-", "AttCat record:", a, this.plans[i].attributeCategories.records[a]);
                        for (let b = 0; b < this.plans[i].attributeCategories.records[a].productAttributes.records.length; b++) {
                            //console.log("plan:", i, "-", "AttCat record:", a, "-", "ProAtt record:", b, this.plans[i].attributeCategories.records[a].productAttributes.records[b]);
                            let name = this.plans[i].attributeCategories.records[a].productAttributes.records[b].label.replace(/ /g, "");
                            name = name.replace(/-/g, "");
                            let value = this.plans[i].attributeCategories.records[a].productAttributes.records[b].userValues;
                            //console.log(name, "=", value);
                            this.newPlans[i][name] = value;
                        }
                    }
                } else {
                    console.log(this.plans[i].Name, 'no attributes');
                }
            }
            //loop for coverages
            for (let i = 0; i < this.plans.length; i++) {
                //console.log("plan:", i, JSON.stringify(this.plans[i]));
                if (this.plans[i].childProducts) {
                    for (let a = 0; a < this.plans[i].childProducts.records.length; a++) {
                        for (let b = 0; b < this.plans[i].childProducts.records[a].attributeCategories.records.length; b++) {
                            for (let c = 0; c < this.plans[i].childProducts.records[a].attributeCategories.records[b].productAttributes.records.length; c++) {

                                //console.log("plan:", i, "-", "childProducts record:", a, "-", "attributeCategories record:", b, "productAttributes record:", c, this.plans[i].childProducts.records[a].attributeCategories.records[b].productAttributes.records[c]);

                                let name = this.plans[i].childProducts.records[a].attributeCategories.records[b].productAttributes.records[c].label.replace(/ /g, "");
                                let code = this.plans[i].childProducts.records[a].ProductCode;
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
                                let value = this.plans[i].childProducts.records[a].attributeCategories.records[b].productAttributes.records[c].userValues;
                                //console.log(name, "=", value);
                                this.newPlans[i][name] = value;

                            }
                        }
                    }
                } else {
                    console.log(this.plans[i].Name, 'no coverages');
                }
            }

            for (let i = 0; i < this.plans.length; i++) {
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
            this.plans = this.newPlans;
            //console.log(JSON.stringify(this.plans));
        } catch (exception) {
            console.log('Exception:', exception);
        }

    }

    openModal(event) {
        let cardid = event.target.dataset.id;
        this.product = this.plans[cardid];
        const modal = this.template.querySelector("c-plan-modal");
        modal.show();
    }

}