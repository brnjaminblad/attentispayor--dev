import { LightningElement, track } from 'lwc';

export default class SortFilterTest extends LightningElement {

    @track selectedOption;
    changeHandler(event) {
    const field = event.target.name;
    if (field === 'optionSelect') {
        this.selectedOption = event.target.value;
            // alert("you have selected : " + this.selectedOption);
            console.log("you have selected : " + this.selectedOption);

            const prices = [40, 100, 1, 5, 25, 10];
            // prices.sort(function(a, b){return a-b});
            console.log("sorted array : " + prices);

            if (this.selectedOption === "low-to-high") {
                prices.sort(function(a, b){return a-b});
            console.log("sorted array : " + prices);
            } else {
                prices.sort(function(a, b){return b-a});
            console.log("sorted array : " + prices);
            }

        } 
    }
}