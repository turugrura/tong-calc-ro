import { DropdownModel } from '../models/dropdown.model';
import { ElementType } from './element-type.const';

export const ElementConverterList: DropdownModel[] = [
  {
    img: '12114',
    label: 'Fire',
    value: 'Fire',
    element: ElementType.Fire,
  },
  {
    img: '12115',
    label: 'Water',
    value: 'Water',
    element: ElementType.Water,
  },
  {
    img: '12116',
    label: 'Earth',
    value: 'Earth',
    element: ElementType.Earth,
  },
  {
    img: '12117',
    label: 'Wind',
    value: 'Wind',
    element: ElementType.Wind,
  },
  {
    img: 'I_Aspersio',
    label: 'Aspersio',
    value: 'Holy',
    element: ElementType.Holy,
  },
];
