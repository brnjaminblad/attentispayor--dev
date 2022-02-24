import { LightningElement } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class TableAdminFees extends OmniscriptBaseMixin(LightningElement) {

    columns = [
        { label: '', fieldName: 'empty', wrapText: true },
        { label: 'Basis', fieldName: 'basis',
        cellAttributes:{
            class:{ fieldName:'cellBackground' },
        }},
        { label: 'Year 1', fieldName: 'year1' },
        { label: 'Year 2', fieldName: 'year2' },
        { label: 'Year 3', fieldName: 'year3' },
        { label: 'Year 4', fieldName: 'year4' },
        { label: 'Year 5', fieldName: 'year5' },
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