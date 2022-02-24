import { LightningElement, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import { BaseState } from "vlocity_ins/baseState";

const expectedValues = [
    {product: "01t3C000005jAjLQAU" , brandExpectedICDiscount: 24.00 , genericExpectedICDiscount: 86.16, brandExpectedDFRX: 0.00, genericExpectedDFRX: 0.00, label: "Mail Non-Specialty"},
    {product: "01t3C000005jAjQQAU" , brandExpectedICDiscount: 17.26, genericExpectedICDiscount: 0.00, brandExpectedDFRX: 0.00, genericExpectedDFRX: 0.00, label: "Mail Specialty"},
    {product: "01t3C000005jAjVQAU", brandExpectedICDiscount: 18.18, genericExpectedICDiscount: 86.24, brandExpectedDFRX: 0.54, genericExpectedDFRX: 0.54, label: "Retail 30 Non-specialty"},
    {product: "01t3C000005jAjRQAU", brandExpectedICDiscount: 23.56, genericExpectedICDiscount: 90.04, brandExpectedDFRX: 0.00, genericExpectedDFRX: 0.00, label: "Retail 90 Non-specialty"},
    {product: "01t3C000005jAjaQAE", brandExpectedICDiscount: 18.44, genericExpectedICDiscount: 0.00, brandExpectedDFRX: 0.59, genericExpectedDFRX: 0.00, label: "Retail Specialty"},
]

export default class ProductInformationTable extends OmniscriptBaseMixin(BaseState(LightningElement)) {
    @api product;
    values = {};
    inputs = [];
    json = '';
    @api editable;
    @api changeOutput;
    @api simulationOutput;
    
    connectedCallback() {
        if(this.editable) {
            this.callgetRatingInputOutput()
        } 
    }

    async callgetRatingInputOutput() {
        const paramsRatingInputOutput = {
            input: {
                "inputJson": {
                    "productId": this.product.Id
                }
            },
            sClassName: "vlocity_ins.IntegrationProcedureService",
            sMethodName: "PBM_RatingInputOutputs",
            options: {},
        };
        
        let responseRatingInputOutput = await this.omniRemoteCall (paramsRatingInputOutput, true);
        let responseRatingInputOutputParsed = JSON.parse(JSON.stringify(responseRatingInputOutput));

        const { productRatingInputs } = responseRatingInputOutputParsed.result.IPResult.ratingMappings.productRatingInfo;
        const toLoop =  Object.keys(productRatingInputs)[0];
        const defaults = Object.keys(productRatingInputs[toLoop]).map((productRatingInputKey) => {
            const ratingInput = productRatingInputs[toLoop][productRatingInputKey]
            if (ratingInput && ratingInput.attributeDefaultValue) {
                return {label: ratingInput.ratingInput, value: ratingInput.attributeDefaultValue, dataId: productRatingInputKey}
            }
        });

        this.inputs = defaults.filter(n=>n);
        this.json = responseRatingInputOutput;
        this.editable
        this.simulate(responseRatingInputOutputParsed.result.IPResult.ratingMappings)
    }

    handleInputChange = (event) => {
        let newInputs = this.inputs.slice();
        const input =  this.inputs.find(input => input.dataId === event.target.dataset.id);
        input.value = event.target.value;
        newInputs = newInputs.filter(element => element.dataId !== event.target.dataset.id);
        newInputs.push(input);
        this.inputs = newInputs
        this.changeJSON(event);
        this.simulate((this.json.result.IPResult.ratingMappings))
    }

    changeJSON = (event) => {
        let newResponseRatingInputOutput = (this.json);
        const key = Object.keys(newResponseRatingInputOutput.result.IPResult.ratingMappings.productRatingInfo.productRatingInputs)[0]
        const {productRatingInputs} = newResponseRatingInputOutput.result.IPResult.ratingMappings.productRatingInfo
        Object.keys(productRatingInputs[key]).forEach((inputKey) => {
            if (inputKey === event.target.dataset.id) {
                newResponseRatingInputOutput.result.IPResult.ratingMappings.productRatingInfo.productRatingInputs[key][inputKey].attributeDefaultValue = event.target.value;
            }
        });
        this.json = newResponseRatingInputOutput;
    }

    simulate = async (input) => {
        const paramsSimulateRate = {
            input:input,
            sClassName: "vlocity_ins.IntegrationProcedureService",
            sMethodName: "PBM_SimulateRate",
            options: {},
        };

        let responseSimulateRate = await this.omniRemoteCall (paramsSimulateRate, true);
        const values = JSON.parse(responseSimulateRate.result.IPResult.result);
        this.values = values;

        let outputForThisProduct = {}
        outputForThisProduct = {...this.values}
        outputForThisProduct.brandProposedICDiscount = parseFloat(this.brandProposedICDiscount)
        outputForThisProduct.genericProposedICDiscount = parseFloat(this.genericProposedICDiscount)
        outputForThisProduct.brandProposedDFRX = parseFloat(this.brandProposedDFRX)
        outputForThisProduct.genericProposedDFRX = parseFloat(this.genericProposedDFRX)
        outputForThisProduct.productId = this.product.Id;
        outputForThisProduct.priceBookEntryId = responseSimulateRate.result.IPResult.priceBookEntryId;
        this.changeOutput(this.product.Id, outputForThisProduct)
        console.log('outputForThisProduct: ', JSON.stringify(outputForThisProduct));
    }

    get brandExpectedICDiscount() {
        const product = expectedValues.find(element => element.product === this.product.Id)
        return product.brandExpectedICDiscount
    }
    
    get brandExpectedDFRX() {
        const product = expectedValues.find(element => element.product === this.product.Id)
        return product.brandExpectedDFRX
    }

    get genericExpectedICDiscount() {
        const product = expectedValues.find(element => element.product === this.product.Id)
        return product.genericExpectedICDiscount
    }

    get genericExpectedDFRX() {
        const product = expectedValues.find(element => element.product === this.product.Id)
        return product.genericExpectedDFRX
    }

    get brandProposedICDiscountId() {
        const item = this.inputs.find(element => element.label === "BrandProposedICDiscount");
        return item ? item.dataId : 0;
    }

    get brandProposedDFRXId() {
        const item = this.inputs.find(element => element.label === "BrandProposedDFRX");
        return item ? item.dataId : 0;
    }

    get genericProposedICDiscountId() {
        const item = this.inputs.find(element => element.label === "GenericProposedICDiscount");
        return item ? item.dataId : 0;
    }

    get genericProposedDFRXId() {
        const item = this.inputs.find(element => element.label === "GenericProposedDFRX");
        return item ? item.dataId : 0;
    }

    //* Values HERE */
    getProductFromLocalSorage(label) {
        console.log(label)
        let products = JSON.parse(localStorage.getItem('PBMQuotesValues')).products;
        let product = products.find(e => Object.keys(e)[0] === this.product.Id)
        console.log(JSON.parse(JSON.stringify(product)))
        return JSON.parse((product[this.product.Id][label]))
    }

    get brandProposedICDiscount() {
        if(!this.editable) {
            return this.getProductFromLocalSorage("brandProposedICDiscount")
        }
       
        const item = this.inputs.find(element => element.label === "BrandProposedICDiscount");
        return item ? item.value : 0;
    }

    get brandProposedDFRX() {
        if(!this.editable) {
            return this.getProductFromLocalSorage("brandProposedDFRX")
        }

        const item = this.inputs.find(element => element.label === "BrandProposedDFRX");
        return item ? item.value : 0;
    }

    get genericProposedICDiscount() {
        if(!this.editable) {
            return this.getProductFromLocalSorage("genericProposedICDiscount")
        }

        const item = this.inputs.find(element => element.label === "GenericProposedICDiscount");
        return item ? item.value : 0;
    }

    get genericProposedDFRX() {
        if(!this.editable) {
            return this.getProductFromLocalSorage("genericProposedDFRX")
        }

        const item = this.inputs.find(element => element.label === "GenericProposedDFRX");
        return item ? item.value : 0;
    }

    get brandBillableGuaranteeIC() {
        console.log('Inside brandBillableGuaranteeIC');
        if(!this.editable) {
            return this.getProductFromLocalSorage("BrandBillableGuaranteeIC")
        }

        return this.values.BrandBillableGuaranteeIC
    }

    get brandBillableGuaranteeDF() {
        if(!this.editable) {
            return this.getProductFromLocalSorage("BrandBillableGuaranteeDF")
        }

        return this.values.BrandBillableGuaranteeDF
    }

    get brandRiskSpreadIC() {
        if(!this.editable) {
            return this.getProductFromLocalSorage("BrandRiskSpreadIC")
        }

        return this.values.BrandRiskSpreadIC
    }

    get brandRiskSpreadDF() {
        if(!this.editable) {
            return this.getProductFromLocalSorage("BrandRiskSpreadDF")
        }
        
        return this.values.BrandRiskSpreadDF
    }

    get genericBillableGuaranteeIC() {
        if(!this.editable) {
            return this.getProductFromLocalSorage("GenericBillableGuaranteeIC")
        }

        return this.values.GenericBillableGuaranteeIC
    }

    get genericBillableGuaranteeDF() {
        if(!this.editable) {
            return this.getProductFromLocalSorage("GenericBillableGuaranteeDF")
        }

        return this.values.GenericBillableGuaranteeDF
    }

    get genericRiskSpreadIC() {
        if(!this.editable) {
            return this.getProductFromLocalSorage("GenericRiskSpreadIC")
        }

        return this.values.GenericRiskSpreadIC
    }

    get genericRiskSpreadDF() {
        if(!this.editable) {
            return this.getProductFromLocalSorage("GenericRiskSpreadDF")
        }

        return this.values.GenericRiskSpreadDF
    }

    //* Class HERE */
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