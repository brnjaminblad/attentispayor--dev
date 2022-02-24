import { LightningElement, api, track } from 'lwc';

import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import { get } from 'vlocity_ins/lodash';
import pubsub from 'vlocity_ins/pubsub';

import { dataFormatter, omniscriptUtils } from 'vlocity_ins/insUtility';

export default class TestInsOsSingleInstance extends OmniscriptBaseMixin(LightningElement) {
    // One of these inputs is required
    @api initJson;
    @api assetId;
    @api quoteId;
    @api productId;
    @api clearStateOnChange;

    @track isLoaded = false;
    @track product;

    pubsubPayload = {
        changeAttributeValue: this.changeAttributeValue.bind(this),
        toggleOptionalCoverage: this.toggleOptionalCoverage.bind(this)
    };

    connectedCallback() {
        const dataOmniLayout = this.getAttribute('data-omni-layout');
        // Set theme to slds as default if no layout returned;
        this.theme = dataOmniLayout === 'newport' ? 'nds' : 'slds';
        this.rePriceAction = this.omniJsonDef.propSetMap.rePriceAction;
        this.stateData = omniscriptUtils.getSaveState(this);
        if (this.stateData) {
            this.formatProduct(this.stateData.product);
        } else if (this.initJson) {
            this.formatProduct(JSON.stringify(this.initJson));
        } else {
            this.getProduct();
        }
    }

    /**
     * Retrieves product data if it wasn't already provided
     */
    getProduct() {
        // Optionally defined in OS step's json
        const initAction = this.omniJsonDef.propSetMap.initAction;
        // Optionally defined in `CUSTOM LIGHTNING WEB COMPONENT PROPERTIES`
        const productMap = {
            assetId: this.assetId,
            quoteId: this.quoteId,
            productId: this.productId
        };
        const dataMapValue = omniscriptUtils.formatProductQuery(this.omniGetMergeField.bind(this), initAction, productMap);
        omniscriptUtils.omniGenericInvoke(this, dataMapValue)
        .then(response => {
            this.formatProduct(response);
        }, error => {
            console.error(error);
            this.isLoaded = true;
        });
    }

    /**
     * Formats product data and registers pubsub channel
     * @param {Object} data
     */
    formatProduct(data) {
        const unique = new Date();
        this.unformattedProductStr = data;
        this.product = dataFormatter.formatProduct(data);
        this.rootChannel = `singleInstanceChannel-${this.product.Id}-${unique}`;
        // Listens to `rootChannel` fired by `insCoverage` or `insAttribute` component
        pubsub.register(this.rootChannel, this.pubsubPayload);
        omniscriptUtils.updateDataJson(this, this.unformattedProductStr);
        this.isLoaded = true;
    }

    /** Updates attribute value when user changes it
     * @param {Object} changedAttribute
     */
    changeAttributeValue(changedAttribute) {
        const product = dataFormatter.parseResponse(this.unformattedProductStr);
        const attribute = get(product, changedAttribute.path);
        attribute.userValues = changedAttribute.userValues;
        this.rePriceProduct(product);
    }

    /** Updates `isSelected` flag when optional coverage is checked/unchecked
     * @param {String} selectedCoveragePath
     */
    toggleOptionalCoverage(selectedCoveragePath) {
        const product = dataFormatter.parseResponse(this.unformattedProductStr);
        const coverage = get(product, selectedCoveragePath);
        coverage.isSelected = !coverage.isSelected;
        this.rePriceProduct(product);
    }

    // Calls reprice method
    rePriceProduct(product) {
        omniscriptUtils.clearStateOnChange(this);
        this.isLoaded = false;
        omniscriptUtils.rePriceProduct(this, product, this.rePriceAction)
            .then(response => {
                this.unformattedProductStr = response;
                this.product = dataFormatter.formatProduct(response);
                omniscriptUtils.updateDataJson(this, this.unformattedProductStr);
                this.isLoaded = true;
            });
    }

    get totalPrice() {
        const price = this.product.Price || 0;
        const taxFee = this.product.totalTaxFeeAmount || 0;
        return price + taxFee;
    }

    get dataError() {
        return this.isLoaded && !this.product;
    }

    disconnectedCallback() {
        const stateData = {
            product: this.unformattedProductStr
        };
        this.omniSaveState(stateData, null, true);
        pubsub.unregister(this.rootChannel, this.pubsubPayload);
    }
}