import { LightningElement } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class TableDiscountsAndDispensingFees extends OmniscriptBaseMixin(LightningElement) {

    columns = [
        { label: 'Rx', fieldName: 'rx' },
        { label: 'AWP', fieldName: 'awp' },
        { label: 'IC', fieldName: 'ic' },
        { label: 'DF', fieldName: 'df' },
        { label: 'IC Discount', fieldName: 'icDiscount' },
        { label: 'DF/Rx', fieldName: 'dfRx' },
    ];

    data = [
        {
            id: 'a',
            empty: 'All-inclusive',
            basis: 'PEPM',
        },
        {
            id: 'b',
            empty: 'List other services we typically change for',
            basis: 'PA/CD Fee',
        },
    ];

}