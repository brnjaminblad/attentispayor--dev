import { LightningElement } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class DatePickerPast extends OmniscriptBaseMixin(LightningElement) {


 mindate;
 selector;
 disabled;
    dispSelectedDate;
       connectedCallback() {
            let today = new Date() ;
            let dd = today.getDate();
            let mm = today.getMonth() + 1;
            let y = today.getFullYear();
            this.mindate = y + '-' + mm + '-' + dd;
            console.log("mindate",this.mindate);    
            this.selector = 'cursor';
            this.dispSelectedDate = '';
            this.template.querySelectorAll('.selector').forEach(each => {
                each.value = '';
                });
          // if( this.getDay()==6|| this.getDay()==0){
           //     console.log('weekend', this.getDay());
           //    disabled=true;
           // }
        }
}