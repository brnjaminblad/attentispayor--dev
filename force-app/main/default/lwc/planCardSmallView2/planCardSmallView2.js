import { LightningElement, api, track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class PlanCardSmallView extends OmniscriptBaseMixin(LightningElement) {

    @api plans;
    @track plansOrdered;
    product;

    connectedCallback() {
        this.plansOrdered = this.plans;
        //console.log("Plans:",JSON.stringify(this.plans));
        //console.log("Plans Ordered:",JSON.stringify(this.plansOrdered));

        try {
            let newPlans = JSON.parse(JSON.stringify(this.plansOrdered));
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
                        newPlans[i][name] = value;
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
                            newPlans[i][name] = value;
                            //problems with tiers (mail orders and retail)

                        }
                    }
                }
            }

            for (let i = 0; i < this.plansOrdered.length; i++) {
                newPlans[i]['btnCompareLabel'] = 'Add Up to 3 Plans to Compare';
                newPlans[i]['btnEnrollLabel'] = 'Enroll Now';
                newPlans[i]['btnQuote'] = 'false';
                newPlans[i]['cardBorder'] = 'plancard';
            }

            //console.log(JSON.stringify(newPlans));
            this.plansOrdered = newPlans;
            //console.log(JSON.stringify(this.plansOrdered));
        } catch (exception) {
            console.log('Exception:', exception);
        }

    }

    @track openModal = false;
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

}