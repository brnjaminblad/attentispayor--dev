import { LightningElement, api } from 'lwc';

export default class DejanSortFilters extends LightningElement {

    @api checkboxmedicalmrescription
    @api checkboxspecneeds
    @api pcprequiredyes
    @api pcprequiredno

    changeHandler(e) {
        const sortEvent = new CustomEvent('sortplan', {
            detail: {
                value: e.target.value,
                name: e.target.name
            }
        })
        this.dispatchEvent(sortEvent);
    }

    resetHandler(e) {
        const resetEvent = new CustomEvent('resetplan', {
            detail: {
                value: e.target.value,
            }
        })
        this.dispatchEvent(resetEvent)
    }
}