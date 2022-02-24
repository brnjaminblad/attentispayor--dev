import { LightningElement, api, track } from 'lwc';

import pubsub from 'vlocity_ins/pubsub';

import { clientRules107, dataFormatter } from 'vlocity_ins/insUtility';
import sldsTemplate from "./testInsAttribute.html";
import ndsTemplate from "./testInsAttribute_nds.html";

export default class TestInsAttribute extends LightningElement {
    @api rootChannel;
    @api theme = 'slds';
    @api attributeStyle;
    @api currencySymbol;
    @api isReadonly = false;
    @api ruleContext;

    @api
    get attribute() {
        return this._attribute;
    }

    set attribute(data) {
        this._attribute = JSON.parse(JSON.stringify(data));
        if (!this.cachedRules) {
            this.messages = this.formatMessages(data.messages); //events are used for rules, cache the rules bc re-rate is out of sync
        } else {
            this.attribute.rules = this.cachedRules;
        }
        if (this.cachedChanges) {
            this.implementRuleChanges(this.cachedChanges);
        }
        if (this.isReadonly) {
            this.displayValue = dataFormatter.formatDisplayValue(data);
        }
        this.isDisabled = data.readonly;
        this.isHidden = data.hidden || data.inputType === 'equalizer' || data.hiddenByRule || this.isHiddenByRule;
        this.isLabelHidden = data.hideLabel;

        this.isCurrency = data.dataType === 'currency';
        this.isPercentage = data.dataType === 'percentage';
        this.isPlainNumber = !this.isCurrency && !this.isPercentage;
        this.isDateTime = data.dataType === 'datetime';
        this.isDate = data.dataType === 'date';

        this.isInputText = data.inputType === 'text';
        this.isInputTextarea = data.inputType === 'textarea';
        this.isInputNumber = data.inputType === 'number';
        this.isInputRange = data.inputType === 'range';
        this.isInputRadio = data.inputType === 'radio';

        this.isInputDropdown = data.inputType === 'dropdown' && !data.multiselect;
        this.isInputMultiSelectDropdown = data.inputType === 'dropdown' && data.multiselect;
        this.isInputCheckbox = data.inputType === 'checkbox' && !data.multiselect;
        this.isInputMultiSelectCheckbox = data.inputType === 'checkbox'&& data.multiselect;

        if (this.isInputDropdown) {
            if (this._attribute.userValues === 0) {
                this._attribute.userValues = JSON.stringify(this._attribute.userValues);
            } else if(typeof this._attribute.userValues === 'boolean') {
                // Combobox component expects value to be a string or number
                this._attribute.userValues = JSON.stringify(this._attribute.userValues);
            }
        }

        if (this.isInputMultiSelectDropdown) {
            const isUserValuesArr = this._attribute.userValues && Array.isArray(this._attribute.userValues) && this._attribute.userValues.length;
            // In Omniscript, userValues can be returned as list containing empty string
            if(isUserValuesArr && this._attribute.userValues[0] === '') {
                this._attribute.userValues = [];
            }
            this.multiSelectLabel = `${isUserValuesArr ? this._attribute.userValues.length : '0'} Selected`; 
        }
        this.userValues = this._attribute.userValues;
        this.setCheckedFlag(data.userValues);
    }

    @track userValues;
    @track isDisabled;
    @track isHidden;
    @track isInputText;
    @track isInputNumber;
    @track isInputDropdown;
    @track isInputCheckbox;
    @track isInputRange;
    @track isComboboxOpen;

    //Rules:
    @track messages;
    @track interests;
    @track rulesDebug;
    @track inDebugMode;

    isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    dateFormat = this.isMobile ? '' : 'MM/DD/YYYY';

    render() {
        return this.theme === 'nds' ? ndsTemplate : sldsTemplate;
    }

    connectedCallback() {
        this.initRules();
        this._currencySymbol = this.currencySymbol || '$';
        this.imaskCurrencyAttributes = {
            mask: `${this._currencySymbol}num`,
            numberMask: true,
            blocks: {
                num: {
                    mask: new Number(),
                    scale: 2,
                    radix: '.',
                    thousandsSeparator: ',',
                    padFractionalZeros: true
                },
            },
        };

        this.imaskNumberAttributes = {
            mask: new Number(),
            numberMask: true,
            scale: 50,
            radix: '.',
            thousandsSeparator: ',',
        }

        if (this.isReadonly) {
            this.displayValue = dataFormatter.formatDisplayValue(this.attribute);
        }
    }

    disconnectedCallback() {
        if (this.pubsubPayload) {
            pubsub.unregister(this.uniqueProductChannel, this.pubsubPayload.uniqueProductChannel);
            pubsub.unregister(this.rootChannel, this.pubsubPayload.rootChannel);
        }
    }

    formatMessages(messages) {
        //Set classes for message
        let result = [];
        if (!messages) {
            return result;
        }
        for (let i = 0; i < messages.length; i++) {
            let message = JSON.parse(JSON.stringify(messages[i]));
            let styles = `${this.theme}-text-title ${this.theme}-p-top_xx-small `;
            if (message.severity === 'ERROR') {
                styles += `${this.theme}-text-color_error`;
            } else if (message.severity === 'WARN') {
                styles += `vloc-ins-text-color_warn`;
            } else {
                styles += `vloc-ins-text-color_info`;
            }
            message.id = message.code + '-' + i;
            message.styles = styles;
            result.push(message);
        }
        return result;
    }

    setCheckedFlag(userValues) {
        if (this.isInputCheckbox) {
            this.userValues = userValues === true || userValues === 'true' ? true : false;
        } else if (this.isInputMultiSelectCheckbox) {
            this.attribute.values.forEach(attrValue => {
                attrValue.checkboxId = `checkbox-${attrValue.id}`;
                if (userValues && Array.isArray(userValues)) {
                    userValues.forEach(userValue => {
                        if (userValue[attrValue.value] !== undefined) {
                            attrValue.checked = userValue[attrValue.value];
                        }
                    });
                } else {
                    this.userValues = [];
                }
            });
        } else if (this.isInputMultiSelectDropdown) {
            if (userValues && Array.isArray(userValues)) {
                this.attribute.values.forEach(attrValue => {
                    userValues.forEach(userVal => {
                        let userValue = JSON.parse(JSON.stringify(userVal));
                        if (userValue === attrValue.value) {
                            attrValue.checked = true;
                        }
                    });
                });
            } else {
                this.attribute.values.forEach(attrValue => {
                    if (userValues === attrValue.value) {
                        attrValue.checked = !attrValue.checked;
                    }
                });
            }
        }
    }

    handleValueChange(e) {
        if (this.isDisabled) return; //ensures never change on readonly

        let newUserValues = this.isInputCheckbox ? e.target.checked : e.target.value;

        if (this.isInputMultiSelectCheckbox) {
            if(this.userValues && Array.isArray(this.userValues)) {
                const userValue = this.userValues.find(attrUserValues => {
                    return attrUserValues.hasOwnProperty(newUserValues);
                });
                // In Omniscript, userValues can be returned as null or contain no metadata
                if(userValue) {
                    userValue[newUserValues] = !userValue[newUserValues];
                } else {
                    const newUserValue = {};
                    newUserValue[newUserValues] = true;
                    this.userValues.push(newUserValue);
                }
            }
            newUserValues = this.userValues;
        } else if (this.isInputMultiSelectDropdown) {
            newUserValues = e.currentTarget.dataset.value;
            this.setCheckedFlag(newUserValues);

            if (!this.userValues) {
                this.userValues = [];
            }
            if (!this.userValues.includes(newUserValues)) {
                this.userValues.push(newUserValues);
            } else {
                const idx = this.userValues.indexOf(newUserValues);
                this.userValues.splice(idx, 1);
            }
            newUserValues = this.userValues;
            this.multiSelectLabel = `${this.userValues ? this.userValues.length : '0'} Selected`;
        } else if(this.userValues === 'true' || this.userValues === 'false') {
            // Convert string booleans back to boolean
            this.userValues = JSON.parse(this.userValues);
        } else if (this.isDateTime) {
            newUserValues = newUserValues ? new Date(newUserValues).toISOString() : newUserValues;
        }
        const sameValue = this.userValues != null && (this.userValues === newUserValues || (newUserValues && this.userValues.toString() === newUserValues.toString()));
        if (sameValue && !this.isInputMultiSelectCheckbox && !this.isInputMultiSelectDropdown) {
            return;
        }

        const payload = {
            attributeId: this.attribute.attributeId,
            path: this.attribute.path,
            userValues: newUserValues,
            attrCode: this.attribute.code
        };
        this.userValues = newUserValues;
        if (this.ruleContext) {
            this.attributePostValue();
        }
        pubsub.fire(this.rootChannel, 'changeAttributeValue', payload);
    }

    toggleMultiDropdown() {
        this.isComboboxOpen = !this.isComboboxOpen;
    }

    get comboboxDropdownClasses() {
        return `${this.theme}-combobox` +
            ` ${this.theme}-dropdown-trigger` +
            ` ${this.theme}-dropdown-trigger_click` +
            `${this.isComboboxOpen ? ` ${this.theme}-is-open` : ''}`;
    }

    get multiComboboxLabel() {
        return this.attribute.multiSelectLabel;
    }

    get uniqueOptionsName() {
        return this.attribute.id;
    }

    get containerClasses() {
        if (this.attributeStyle === 'recordEditor') {
            return this.isReadonly ? `${this.theme}-grid` : '';
        }

        let classes = `${this.theme}-grid ${this.theme}-grid_vertical-align-center ${this.theme}-wrap`;
        if (this.attributeStyle === 'coveragelist') {
            classes += ' vloc-ins-attribute-component';
        } else if (this.attributeStyle === 'adminCoverage') {
            classes += ` ${this.theme}-p-top_small`;
        }

        return classes;
    }

    get valueContainerClasses() {
        let classes = '';
        if (!this.attribute.hideLabel) {
            if (this.attributeStyle === 'coveragelist') {
                classes += `${this.theme}-small-size_1-of-1 ${this.theme}-large-size_5-of-12`;
            } else if (this.attributeStyle === 'recordEditor') {
                classes += this.isReadonly ? `${this.theme}-small-size_1-of-2` : `${this.theme}-small-size_1-of-1`;
            } else {
                classes += `${this.theme}-size_2-of-3`;
            }
        }
        if (this.isReadonly) {
            classes += ` ${this.theme}-text-align_right`;
        }
        return classes;
    }

    get labelContainerClasses() {
        if (this.attributeStyle === 'recordEditor') {
            return this.isReadonly ? `${this.theme}-small-size_1-of-2 slds-text-align_left` : '';
        }

        let classes = `${this.theme}-p-right_small`;
        if (!this.attribute.hideLabel) {
            if (this.attributeStyle === 'coveragelist') {
                classes += ` ${this.theme}-small-size_1-of-1 ${this.theme}-large-size_7-of-12`;
            } else {
                classes += ` ${this.theme}-size_1-of-3`;
            }
        }
        return classes;
    }

    get labelClasses() {
        let classes = '';
        if (this.attributeStyle === 'coveragelist') {
            classes += 'vloc-ins-label';
        }
        else if (this.attributeStyle === 'adminCoverage') {
            classes += 'vloc-ins-admin-text vloc-ins-admin-label';
        }
        return classes;
    }

    //______107 RULES______//

    /*
    * On load, init attribute rules
    * Find interests, init event channels, and share interests (if any)
    * An interest is an attribute who's value I need to evaluate a rule
    */
    initRules() {
        if (this.ruleContext) {
            this.uniqueCode = this.ruleContext.productCode + '.' + this.attribute.code;
            this.productChannel = this.ruleContext.productChannel;
            this.uniqueProductChannel = this.ruleContext.uniqueProductChannel;
            this.inDebugMode = this.ruleContext.debugMode;
            this.pubsubPayload = {
                uniqueProductChannel : {attributePostValue: this.attributePostValue.bind(this)},
                rootChannel :  {setDebugMode: this.setDebugMode.bind(this)}
            };
            pubsub.register(this.rootChannel, this.pubsubPayload.rootChannel);
            this.hasRules();
            if (this.attribute.hasRules) {
                let result = JSON.parse(JSON.stringify(clientRules107.getInterests(this.attribute)));
                this.interests = result.interests;
                this.attribute = result.attribute;
                this.cachedRules = this.attribute.rules;
                this.rulesDebug = Object.values(this.interests);
                if (this.interests) {
                    this.shareInterests();
                    this.pubsubPayload.uniqueProductChannel.getValue = this.getValue.bind(this);
                }
            }
            pubsub.register(this.uniqueProductChannel, this.pubsubPayload.uniqueProductChannel);
        }
    }

    //function to set hasRules flag correctly
    hasRules() {
        this.attribute.hasRules = Array.isArray(this.attribute.rules) || this.attribute.hasRules;
        if (!this.attribute.hasRules && this.attribute.values) {
            this.attribute.hasRules = this.attribute.values.some(value => {
                return (value.rules && value.rules.length > 0);
            });
        }
    }

    //toggle debug mode (event sent by insQuote)
    setDebugMode(e) {
        this.inDebugMode = e;
    }

    /*
    * Share attributes interest with parent product
    * Fn runs on load only
    */
    shareInterests() {
        let message = {
            uniqueCode: this.uniqueCode,
            interests: this.interests,
            productCode: this.ruleContext.productCode
        };
        pubsub.fire(this.uniqueProductChannel, 'getChildInterests', JSON.stringify(message));
    }

    //Post new token value to all products
    attributePostValue() {
        console.log('ins_post:', this.uniqueCode, this.userValues);
        let message = {
            uniqueCode: this.uniqueCode,
            newValue: this.userValues,
            valueDecoder: this.attribute.valueDecoder
        };
        pubsub.fire(this.productChannel, 'postValue', JSON.stringify(message));
    }

    // Listener to get new value and re-evaluate rules with dependecies on this new token value
    getValue(e) {
        let response = JSON.parse(e);
        if (this.interests && this.interests[response.uniqueCode]) {
            console.log('ins_response:', response);
            this.messages = [];
            let result = clientRules107.evaluateRules(this.attribute.rules, this.interests, response);
            this.interests = result.interests;
            this.attribute.rules = result.rules;
            this.rulesDebug = Object.values(this.interests); //updated interests (rule evals)
            this.cachedChanges = result.changes;
            this.implementRuleChanges(result.changes);
        }
    }

    /*
    * Impelement changes from rules
    * changes can be: hide {Boolean}, showMessages {Array of messages}, dropdown {Array of indexes to hide in values}
    */
    implementRuleChanges(changes) {
        if (changes.hasOwnProperty('hide')) {
            if (!this.isHidden || !this.attribute.hidden) {
                this.isHidden = changes.hide;
                this.isHiddenByRule = this.isHidden; //have own flag bc it gets rest every render
            }
        }
        if (changes.showMessages) {
            this.messages = this.formatMessages(changes.showMessages);
        }
        if (changes.hideDropdownValues) {
            let showVals = [];
            for (let i = 0; i < this.attribute.values.length; i++) {
                if (changes.hideDropdownValues.indexOf(i) < 0) {
                    showVals.push(this.attribute.values[i]);
                }
            }
            this.attribute.values = showVals;
        }
    }
}