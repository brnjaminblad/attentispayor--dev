import { LightningElement } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import { BaseState } from "vlocity_ins/baseState";
import pubsub from "vlocity_ins/pubsub";

export default class SecondComponent extends OmniscriptBaseMixin(BaseState(LightningElement)) {

    connectedCallback() {
        pubsub.register('omniscript_step', {
            data: this.handleOmniStep.bind(this)
        });
    }

    handleOmniStep(data) {
        console.log('The dataaaaaaa: ', data);
    }

}