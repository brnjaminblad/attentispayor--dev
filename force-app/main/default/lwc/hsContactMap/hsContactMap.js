import { LightningElement } from 'lwc';

export default class hsContactMap extends LightningElement {
contactMap = [
        {
            location: {
                City: 'Avon',
                Country: 'USA',
                PostalCode: '06001',
                State: 'CT',
                Street: '60 West Main Street',
            },
            value: 'Josh Contact',
            title: 'Josh Address',
        },
    ];
    zoomLevel = 17;
}