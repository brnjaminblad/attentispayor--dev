import { LightningElement } from "lwc";

const actions = [{ label: "Attach", name: "attach" }];

const columns = [
  { label: "Name", fieldName: "name" },
  { label: "Source Name", fieldName: "sourceName" },
  { label: "Source State", fieldName: "sourceState" },
  {
    type: "action",
    typeAttributes: { rowActions: actions }
  }
];

const allData = [
  {
    id: 1,
    name: "Medical Physician & Surgeon",
    sourceName: "Missouri Division of Professional Registration",
    sourceState: "MO"
  },
  {
    id: 2,
    name: "Cardiac Nurse Practitioner",
    sourceName: "Missouri Division of Professional Registration",
    sourceState: "MO"
  },
  {
    id: 3,
    name: "Acute Care Nurse Practitioner",
    sourceName: "Department of Public Health",
    sourceState: "FL"
  },
  {
    id: 4,
    name: "Orthopedic Nurse Practitioner",
    sourceName: "Department of Public Health",
    sourceState: "FL"
  },
  {
    id: 5,
    name: "Adult Gerontology Acute Care Nurse Practitioner (AG-ACNP)",
    sourceName: "Missouri Division of Professional Registration",
    sourceState: "MO"
  },
  {
    id: 6,
    name: "Electrologist",
    sourceName: "Missouri Division of Professional Registration",
    sourceState: "MO"
  },
  {
    id: 7,
    name: "Nursing Home Administrators",
    sourceName: "Department of Public Health",
    sourceState: "FL"
  },
  {
    id: 8,
    name: "Temporary Plastic Surgeon",
    sourceName: "Department of Public Health",
    sourceState: "FL"
  },
  {
    id: 9,
    name: "Advanced Practice Registered Nurse",
    sourceName: "Department of Public Health",
    sourceState: "FL"
  },
  {
    id: 10,
    name: "Optician",
    sourceName: "Department of Public Health",
    sourceState: "FL"
  },
  {
    id: 11,
    name: "Prosthetist",
    sourceName: "Missouri Division of Professional Registration",
    sourceState: "MO"
  },
  {
    id: 12,
    name: "Psychologist",
    sourceName: "Missouri Division of Professional Registration",
    sourceState: "MO"
  },
  {
    id: 13,
    name: "Certified R.T. Technician",
    sourceName: "Missouri Division of Professional Registration",
    sourceState: "MO"
  },
  {
    id: 14,
    name: "Speech-Language Pathologist",
    sourceName: "Missouri Division of Professional Registration",
    sourceState: "MO"
  },
  {
    id: 15,
    name: "Respiratory Care Practitioner by Exam",
    sourceName: "Missouri Division of Professional Registration",
    sourceState: "MO"
  }
];

export default class PnmLicenseTypeList extends LightningElement {
  columns = columns;
  offset = 0;
  pageSize = 10;
  data = [];
  lastPageLoaded;
  isFirstLoading = true;

  connectedCallback() {
    this.initialize();
  }

  async initialize() {
    const { records } = await this.getNewPageData();
    this.data = records;
    this.isFirstLoading = false;
  }

  async handleLoadMore() {
    this.offset += this.pageSize;
    const { records } = await this.getNewPageData();
    this.data = this.data.concat(records);
    if (this.data.length === allData.length) {
      this.lastPageLoaded = true;
    }
  }

  getNewPageData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          records: allData.slice(this.offset, this.offset + this.pageSize)
        });
      }, 2000);
    });
  }
}