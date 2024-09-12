export interface DropdownModel {
  label: string;
  value: string | number;
  element?: string;
  [key: string]: any;
}

export interface ItemDropdownModel {
  label: string;
  value: string | number;
  element?: string;
  usableClass?: string[];
  unusableClass?: string[];
}
