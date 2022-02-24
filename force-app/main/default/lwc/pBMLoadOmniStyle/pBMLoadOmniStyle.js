import OmniscriptSetValues from 'vlocity_ins/omniscriptSetValues';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import { loadStyle } from 'lightning/platformResourceLoader';

export default class PBMLoadOmniStyle extends OmniscriptBaseMixin(OmniscriptSetValues) {

    connectedCallback() {
        super.connectedCallback();

        var baseURL = 'https://attentispayor--dev.lightning.force.com';
        console.log("WORKING!!!!")

        let completeURL = `${baseURL}/resource/elixirNewport/assets/styles/vlocity-newport-design-system-scoped.min.css` + '?t=' + new Date().getTime();
        loadStyle(this, completeURL);
        console.log("AFTER LOAD STYLE!!!!")
    }
}