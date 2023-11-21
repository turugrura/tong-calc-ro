import { ElementType } from '../constants/element-type.const';
import { RaceType } from '../constants/race-type.const';
import { DropdownModel } from '../models/dropdown.model';
import { createBaseStatOptionList } from './create-base-stat-option-list';

export const createExtraOptionList = () => {
  const atkTypes = ['Physical', 'Magical'];
  const atkProps = {
    Race: ['All', ...Object.values(RaceType)],
    Element: ['All', ...Object.values(ElementType)],
    Size: ['All', 'Small', 'Medium', 'Large'],
    Class: ['All', 'Normal', 'Boss'],
  };

  const items: (DropdownModel & { children: any[] })[] = [];
  for (const atkType of atkTypes) {
    const atk = atkType.at(0).toLowerCase();
    const item = {
      value: atk,
      label: atkType,
      children: [],
    };
    for (const [dmgType, dmgSubTypes] of Object.entries(atkProps)) {
      const propLow = dmgType.toLowerCase();
      item.children.push({
        value: `${atk}_${dmgType}`,
        label: dmgType,
        children: dmgSubTypes.map((finalProp) => {
          const finalPropLow = finalProp.toLowerCase();
          let fixedSize = finalPropLow;
          if (dmgType === 'Size') {
            fixedSize = finalPropLow === 'all' ? finalPropLow : finalPropLow.at(0);
          }

          return {
            value: `${atk}_${dmgType}_${finalProp}`,
            label: finalProp,
            children: Array.from({ length: 25 }, (_, k) => {
              const num = k + 1;
              return {
                value: `${atk}_${propLow}_${fixedSize}:${num}`,
                label: `${atk.toUpperCase()}. ${dmgType} ${finalProp} +${num}%`,
              };
            }),
          };
        }),
      });
    }

    items.push(item);
  }

  // No idea about programmatic
  items[1].children.push({
    label: 'My Magical Element',
    value: 'My Element',
    children: atkProps.Element.map((element) => {
      const elementLow = element.toLowerCase();
      return {
        value: `m_my_element_${elementLow}`,
        label: element,
        children: Array.from({ length: 25 }, (_, k) => {
          const num = k + 1;
          return {
            value: `m_my_element_${elementLow}:${num}`,
            label: `My ${element} +${num}%`,
          };
        }),
      };
    }),
  });

  const options: [string, string, number, number, string?][] = [
    ['Atk', 'atk', 1, 65],
    ['Atk percent', 'atkPercent', 1, 30, ' %'],
    ['Matk', 'matk', 1, 65],
    ['Matk percent', 'matkPercent', 1, 30, ' %'],
    ['Long Range', 'range', 1, 30, ' %'],
    ['Melee', 'melee', 1, 30, ' %'],
    ['CRI Rate', 'cri', 1, 30, ' %'],
    ['CRI Dmg', 'criDmg', 1, 30, ' %'],
    ['ASPD', 'aspd', 1, 5],
    ['ASPD percent', 'aspdPercent', 1, 30, ' %'],
    ['Delay', 'acd', 1, 30, ' %'],
    ['VCT', 'vct', 1, 30, ' %'],
  ];

  const subTypeMap = {
    Atk: 'Physical',
    'Atk percent': 'Physical',
    'Long Range': 'Physical',
    Melee: 'Physical',
    Matk: 'Magical',
    'Matk percent': 'Magical',
  };

  const VAL_CAP = 10;
  for (const [label, prop, rawMin, rawMax, suffix] of options) {
    const labelNoPercent = label.replace(' percent', '');
    const values = [] as { label: string; min: number; max: number }[];
    const sign = label === 'Delay' || label === 'VCT' ? '-' : '+';
    for (let i = rawMin; i < rawMax; i += VAL_CAP) {
      const max = Math.min(i + VAL_CAP - 1, rawMax);
      values.push({ label: `${i} - ${max}`, min: i, max: max });
    }

    let children = [];
    if (values.length === 1) {
      const { min, max } = values[0];
      children = Array.from({ length: max - min + 1 }, (_, k) => {
        const num = k + min;
        return {
          label: `${labelNoPercent} ${sign}${num}${suffix || ''}`,
          value: `${prop}:${num}`,
        };
      });
    } else {
      children = values.map((value) => {
        const { label: label2, min, max } = value;

        return {
          label: `${label} ${label2}`,
          value: label2,
          children: Array.from({ length: max - min + 1 }, (_, k) => {
            const num = k + min;
            return {
              label: `${labelNoPercent} ${sign}${num}${suffix || ''}`,
              value: `${prop}:${num}`,
            };
          }),
        };
      });
    }

    const item = {
      value: label,
      label,
      children,
    };

    const subT = subTypeMap[label];
    if (subT === 'Physical') {
      items[0].children.push(item);
    } else if (subT === 'Magical') {
      items[1].children.push(item);
    } else {
      items.push(item);
    }
  }

  items.push(createBaseStatOptionList(1, 30));

  return items;
};
