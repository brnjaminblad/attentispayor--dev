import { LightningElement } from 'lwc';
import { BaseLayout } from "vlocity_ins/baseLayout";
import { OmniscriptBaseMixin } from "vlocity_ins/omniscriptBaseMixin";
import temp from './dejanCreatingNewCustomLWCLayoutTemplate.html'


export default class DejanCreatingNewCustomLWCLayoutTemplate extends OmniscriptBaseMixin(LightningElement) {

    render() {
        return temp
    }
}