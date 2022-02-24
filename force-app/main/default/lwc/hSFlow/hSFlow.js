import { LightningElement, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class HSFlow extends OmniscriptBaseMixin(LightningElement) {

    @api timestamp;
    @api apitoken;
    @api signature;
    @api usertype;
    @api externaluserid;
    @api returnto;
    
    @api appid;


    originalUrl;
    newUrl;
    shopUrl;
    application;

    connectedCallback() {

        //console.log('The timestamp: '     , this.timestamp);
        //console.log('The apitoken: '      , this.apitoken);
        //console.log('The signature: '     , this.signature);
        //console.log('The userType: '      , this.usertype);
        //console.log('The externaluserid: ', this.externaluserid);
        //console.log('The returnto: '      , this.returnto);
        //console.log('The appId: '         , this.appid);

        //this.getHSApplication('https://healthsherpa-nl-sfdc-de-m47wfh.herokuapp.com/sso/tests/create_managed_app?carrier_id=sfdc');
        //this.originalUrl = 'https://healthsherpa-nl-sfdc-de-m47wfh.herokuapp.com/sso/tests/shop_managed_app?carrier_id=sfdc&confirmation_id=290861596813&return_url=https://www.salesforce.com&people%5bprimary%5d%5bage%5d=41&people%5bprimary%5d%5bgender%5d=female&people%5bprimary%5d%5btobacco%5d=false&household_size=1&household_income=25000';
        this.originalUrl = 'https://healthsherpa-nl-sfdc-de-kft1tm.herokuapp.com/sso/tests/shop_managed_app?carrier_id=sfdc&confirmation_id=290861596813&return_url=https://www.salesforce.com&people%5bprimary%5d%5bage%5d=41&people%5bprimary%5d%5bgender%5d=female&people%5bprimary%5d%5btobacco%5d=false&household_size=1&household_income=25000';
        //this.newUrl      = 'https://staging.healthsherpa.com/sso/tests/shop_managed_app?carrier_id=sfdc&confirmation_id=' + this.appid + '&return_url=https://www.salesforce.com&people%5bprimary%5d%5bage%5d=41&people%5bprimary%5d%5bgender%5d=female&people%5bprimary%5d%5btobacco%5d=false&household_size=1&household_income=25000';
        //this.newUrl = 'https://staging.healthsherpa.com';
        this.newUrl      = 'https://healthsherpa-nl-sfdc-de-kft1tm.herokuapp.com/sso/tests/shop_managed_app?carrier_id=sfdc&confirmation_id=' + this.appid + '&return_url=https://www.salesforce.com&people%5bprimary%5d%5bage%5d=41&people%5bprimary%5d%5bgender%5d=female&people%5bprimary%5d%5btobacco%5d=false&household_size=1&household_income=25000';

        console.log('The new url: ', this.newUrl);
        //this.shopUrl = 'https://staging.healthsherpa.com/ede/applications/'+ this.appid + '/shop' +
        this.shopUrl = 'https://healthsherpa-nl-sfdc-de-kft1tm.herokuapp.com/ede/applications/'+ this.appid + '/shop' +
                    '?timestamp='        + this.timestamp      +
                    '&api_token='        + this.apitoken       +
                    '&signature='        + this.signature      +
                    '&user_type='        + this.usertype       +
                    '&external_user_id=' + this.externaluserid +
                    '&return_to='        + this.returnto;
        console.log('The shop url: ', this.shopUrl);
        //this.application = 'https://staging.healthsherpa.com/ede/applications/'+ this.appid + '/apply' +
        this.application = 'https://healthsherpa-nl-sfdc-de-kft1tm.herokuapp.com/ede/applications/'+ this.appid + '/apply' +
                    '?timestamp='        + this.timestamp      +
                    '&api_token='        + this.apitoken       +
                    '&signature='        + this.signature      +
                    '&user_type='        + this.usertype       +
                    '&external_user_id=' + this.externaluserid +
                    '&return_to='        + this.returnto;
        console.log('The apply url: ', this.application);

    }

    /*async getHSApplication (url) {
        console.log('Init getHSApplication');
        const response = await fetch('https://healthsherpa-nl-sfdc-de-m47wfh.herokuapp.com/sso/tests/create_managed_app?carrier_id=sfdc', {method:'GET', 
                                           mode: 'no-cors',
                                           crossOrigin: true,
                                           headers: {'Authorization': 'Basic ' + btoa('staging-user:9u76mDeRdKhkuZ8mGCeP'), 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type,Accept, Authortization', 'Acces-Control-Allow-Methods': 'GET, POST, PATCH, DELETE'}});
        var data = await response.json();
        console.log('The data: ', data);
    }*/

}