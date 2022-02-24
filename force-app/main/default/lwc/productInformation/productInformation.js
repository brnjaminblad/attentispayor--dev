import { LightningElement, track, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import { BaseState } from "vlocity_ins/baseState";

export default class ProductInformation extends OmniscriptBaseMixin(BaseState(LightningElement)) {
    @api productInformation;
    @track data;
    @api editable;
    output = [];
    processedProductCount = 0;
    totalProducts = 0;
    spinnerLoading;
    @api currentStep;

    connectedCallback() {

        if(this.currentStep == 'QuoteCalculation') {
            this.spinnerLoading = true;
        }

        this.totalProducts = this.productInformation.length;
        console.log('this.totalProducts: ', this.totalProducts);

        if(this.editable) {
            localStorage.removeItem('PBMQuotesValues');
            localStorage.setItem('PBMQuotesValues', JSON.stringify({products: []}));
        }
       
        console.log('The informationnnn: ', JSON.parse(JSON.stringify(this.productInformation)));
        this.data = JSON.parse(JSON.stringify(this.productInformation));
        let clonedData = [];
        let i;
        console.log(JSON.parse(JSON.stringify(this.productInformation)));

        for (i = 0; i < this.data.length; i++) {
            let currentElement = {...this.data[i]};
            currentElement.openCloseButtonLabel = 'Details';
            clonedData.push (currentElement);
        }
        this.data = clonedData;
    }

    handleClickOpenClose(event) {
        try {
            if (this.template.querySelector(`[data-id="${event.target.dataset.id}"]`)){
                this.template.querySelector(`[data-id="${this.data[event.target.dataset.id].Id}"]`).classList.toggle('slds-is-open');
            }
            if (this.data[event.target.dataset.id].openCloseButtonLabel === 'Details') {
                this.data[event.target.dataset.id].openCloseButtonLabel = 'Close';
            } else {
                this.data[event.target.dataset.id].openCloseButtonLabel = 'Details';
            }
        } catch(error) {
            console.log('The error: ', error);
        }
    }

    handleExpandAll() {
        this.data.forEach(element => {
            console.log(JSON.parse(JSON.stringify(element)))
            this.template.querySelector(`[data-id="${element.Id}"]`).classList.add('slds-is-open');
            element.openCloseButtonLabel = 'Close';
        });
    }

    handleCollapseAll() {
        this.data.forEach(element => {
            this.template.querySelector(`[data-id="${element.Id}"]`).classList.remove('slds-is-open');
            element.openCloseButtonLabel = 'Details';
        });
    }

    changeOutput = (productId, product) => {
        let lS = JSON.parse(localStorage.getItem('PBMQuotesValues'));
        const productIndex = this.output.findIndex(e => Object.keys(e)[0] === productId)
        if(productIndex >= 0) {
            this.output[productIndex][productId] = {...product}
            lS.products[productIndex][productId] = {...product};
            lS.products[lS.products.findIndex(e => Object.keys(e)[0] === productId)][productId] = {...product};
            localStorage.setItem('PBMQuotesValues', JSON.stringify(lS))
        } else {
            let myObj = {[productId]: {...product}};
            this.output.push(myObj);
            lS.products.push(myObj);
            localStorage.setItem('PBMQuotesValues', JSON.stringify(lS))
        }
        this.omniApplyCallResp({
            simulationOutput:  this.output
        });
        this.reformatJson (this.output);
    }

    reformatJson(inputJson) {
        let newOutput = [];

        /*for (let i = 0; i < inputJson.length; i++) {
            let key = Object.keys(inputJson[i]);
            newOutput.push([inputJson[i][key]][0]);
        }*/
        inputJson.forEach(element => {
            let key = Object.keys(element);
            newOutput.push([element[key]][0]);
        });

        console.log('The newOutput: ', newOutput);

        this.omniApplyCallResp({
            simulationOutputFormatted: newOutput
        });
        this.processedProductCount++;
        console.log('The count: ', this.processedProductCount);
        if (this.processedProductCount == this.totalProducts) {
            this.spinnerLoading = false;
        } 

        /*let key0 = Object.keys(inputJson[0]);
        console.log('this is the important: ', inputJson[0][key0]);
        let key1 = Object.keys(inputJson[1]);
        console.log('this is the important: ', inputJson[1][key1]);
        
        newOutput.push([inputJson[0][key0]][0]);
        newOutput.push([inputJson[1][key1]][0]);
        this.omniApplyCallResp({
            simulationOutputFormatted:  newOutput
        });*/
    }

    // async callgetRatingInputOutputs() {

    //     const paramsRatingInputOutput = {
    //         input: {
    //             "inputJson": {
    //                 "productId": "01t6u0000007PyuAAE"
    //             }
    //         },
    //         sClassName: "vlocity_ins.IntegrationProcedureService",
    //         sMethodName: "PBM_RatingInputOutputs",
    //         options: {},
    //     };
        
    //     let responseRatingInputOutput       = await this.omniRemoteCall (paramsRatingInputOutput, true);
    //     let responseRatingInputOutputParsed = JSON.parse(JSON.stringify (responseRatingInputOutput));

    //     console.log('The responseParsed for RatingInputOutput: ', JSON.stringify(responseRatingInputOutputParsed.result.IPResult.ratingMappings));

    //     const paramsSimulateRate = {
    //         input: responseRatingInputOutputParsed.result.IPResult.ratingMappings,
    //         sClassName: "vlocity_ins.IntegrationProcedureService",
    //         sMethodName: "PBM_SimulateRate",
    //         options: {},
    //     };

    //     let responseSimulateRate       = await this.omniRemoteCall (paramsSimulateRate, true);
    //     let responseSimulateRateParsed = JSON.parse(JSON.stringify (responseSimulateRate));

    //     console.log('The responseParsed for responseSimulateRate: ', JSON.stringify(responseSimulateRateParsed.result.IPResult));
        
    // }

}