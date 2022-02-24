import { api, LightningElement } from "lwc";
import { OmniscriptBaseMixin } from "vlocity_ins/omniscriptBaseMixin";

export default class VpnmDowloadApplicationPDF extends OmniscriptBaseMixin(
  LightningElement
) {
  @api applicationId;

  handleDownload = () => {
    window.open(
      "https://attentispayor--dev--c.visualforce.com/apex/CredentialingPDF?id=" +
        this.applicationId,
      "_blank"
    );
  };
}