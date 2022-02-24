import { LightningElement } from 'lwc';
import pubsub from "vlocity_ins/pubsub";

export default class ThirdStep extends OmniscriptBaseMixin(BaseState(LightningElement)) {

    connectedCallback() {
        pubsub.register('omniscript_step', {
            data: this.handleOmniStep.bind(this)
        });
    }

    handleOmniStep(data) {
        console.log('The dataaaaaaa: ', data);
        /*if(data.name == 'stepname'){
            console.log(data);
        }*/
    }

}