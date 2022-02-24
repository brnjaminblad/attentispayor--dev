import { api, LightningElement, track } from "lwc";

export default class PnmItemList extends LightningElement {
  @api heading;
  @api subheading;
  @api headingIcon;
  @api columns;
  @api hideCheckboxColumn;
  @api isEnabledInfiniteScroll;
  @api lastPageLoaded;
  @track _rows;
  @api fixedHeight;
  isLoadingPage = false;

  @api get rows() {
    return this._rows || [];
  }

  set rows(rows) {
    const oldRows = this.rows;
    this._rows = rows;
    if (oldRows && rows.length > oldRows.length && this.isLoadingPage) {
      this.isLoadingPage = false;
    }
  }

  @api get pageSize() {
    if (!this._pageSize) {
      this._pageSize = this.rows.length;
    }
    return this._pageSize || 0;
  }

  set pageSize(value) {
    this._pageSize = value;
  }

  triggerLoadMoreEvent(event) {
    if (this.lastPageLoaded || this.isLoadingPage) {
      event.preventDefault();
    } else {
      this.isLoadingPage = true;
      this.dispatchEvent(new CustomEvent("loadmore"));
    }
  }

  get containerComputedClasses() {
    const classes = [];
    if (this.isEnabledInfiniteScroll) classes.push("inifinite-scroll-enabled");
    return classes.join(" ");
  }

  renderedCallback() {
    const css = document.body.style;
    const height = this.fixedHeight || `${this.pageSize * 40}px`;
    css.setProperty("--pnmListItemsHeight", height);
  }
}