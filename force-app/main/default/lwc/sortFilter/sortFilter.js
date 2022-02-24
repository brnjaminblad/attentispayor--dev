import { LightningElement, api, track } from 'lwc';

export default class SortFilters extends LightningElement {

    @api checkboxmedicalmrescription
    @api checkboxspecneeds
    @api pcprequiredyes
    @api pcprequiredno
    @api checkshowbooly
    @api checkshowbooln


    changeHandler(e) {
        //this.showBool = true;
        const sortEvent = new CustomEvent('sortplan', {
            detail: {
                value: e.target.value,
                name: e.target.name,
                checked: e.target.checked
            }
        })
        this.dispatchEvent(sortEvent);
    }

    resetHandler(e) {
        this.template.querySelector(".select1").selectedIndex = "0";
        this.template.querySelector(".select2").selectedIndex = "0";
        console.log(this.template.querySelectorAll)
        const resetEvent = new CustomEvent('resetplan', {
            detail: {
                value: e.target.value,
                checked: e.target.checked
            }
        })
        this.dispatchEvent(resetEvent)
    }
}