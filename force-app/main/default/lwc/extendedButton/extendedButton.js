import { LightningElement } from "lwc";
import {OmniscriptBaseMixin} from "vlocity_ins/omniscriptBaseMixin"
import Button from "vlocity_ins/button";
import tmpl from './extendedButton.html';
//import OmniscriptStep from "vlocity_ins/omnscriptStep";

export default class extendedButton extends OmniscriptBaseMixin(Button) {  

render() {
    return tmpl;
}
//     onclickbutton() {    
//     this.label = "Button clicked";  

// }
}