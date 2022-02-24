import { LightningElement, wire } from 'lwc';
import getClaims from '@salesforce/apex/GEN_ChartController.getClaims';

 
export default class gen_claimschart extends LightningElement {
    chartConfiguration;
 
    @wire(getClaims)
    getClaims({ error, data }) {
        if (error) {
            this.error = error;
            this.chartConfiguration = undefined;
        } else if (data) {
            let chartAmtData = [];
            let chartRevData = [];
            let chartOOPData = [];
            let chartLabel = [];
            data.forEach(opp => {
                chartAmtData.push(opp.amount);
                chartRevData.push(opp.expectRevenue);
                chartOOPData.push(opp.outOfPocket)
                chartLabel.push(opp.stage);
            });
 
            this.chartConfiguration = {
                type: 'bar',
                data: {
                    datasets: [{
                            label: 'Annual Claims',
                            backgroundColor: "green",
                            data: chartAmtData,
                        },
                        {
                            label: 'Annual Deductible',
                            backgroundColor: "orange",
                            data: chartRevData,
                        },
                        {
                            label: 'Annual Out of Pocket Maximum',
                            backgroundColor: "red",
                            data: chartOOPData,
                        },
                    ],
                    labels: chartLabel,
                },
                options: {},
            };
            console.log('data => ', data);
            this.error = undefined;
        }
    }
}