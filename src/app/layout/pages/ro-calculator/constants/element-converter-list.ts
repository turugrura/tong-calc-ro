import { DropdownModel } from '../models/dropdown.model';
import { ElementType } from './element-type.const';

export const ElementConverterList: DropdownModel[] = [
  {
    img: '12114',
    label: 'Fire',
    value: ElementType.Fire,
    element: ElementType.Fire,
  },
  {
    img: '12115',
    label: 'Water',
    value: ElementType.Water,
    element: ElementType.Water,
  },
  {
    img: '12116',
    label: 'Earth',
    value: ElementType.Earth,
    element: ElementType.Earth,
  },
  {
    img: '12117',
    label: 'Wind',
    value: ElementType.Wind,
    element: ElementType.Wind,
  },
  {
    img: 'I_Aspersio',
    label: 'Aspersio',
    value: ElementType.Holy,
    element: ElementType.Holy,
  },
  {
    img: '12020',
    label: 'Cursed Water',
    value: ElementType.Dark,
    element: ElementType.Dark,
  },
];
