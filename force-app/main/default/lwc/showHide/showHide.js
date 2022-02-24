import { LightningElement, track } from 'lwc';
import {OmniscriptBaseMixin} from 'vlocity_ins/omniscriptBaseMixin';

export default class ShowHide extends OmniscriptBaseMixin(LightningElement) {

    @track clickedButtonLabel = 'Show';  
    @track boolVisible = false;  
  
    handleClick(event) {  
        const value = event.target.value;  
  
        if ( value === 'Show' ) {  
  
            this.clickedButtonLabel = 'Hide';  
            this.boolVisible = true;  
  
        } else if  ( value === 'Hide' ) {  
              
            this.clickedButtonLabel = 'Show';  
            this.boolVisible = false;  
  
        }  
    }  

}