import { LightningElement } from 'lwc';
import {OmniscriptBaseMixin} from 'vlocity_ins/omniscriptBaseMixin';
import tmpl from './formTest.html';
export default class FormTest extends OmniscriptBaseMixin(LightningElement) {
    render() {
        return tmpl;
    }
}