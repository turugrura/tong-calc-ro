import { ElementType } from '../constants/element-type.const';
import { RaceType } from '../constants/race-type.const';
import { DropdownModel } from '../models/dropdown.model';

export const createExtraOptionList = () => {
  const atkTypes = ['Physical', 'Magical'];
  const atkProps = {
    Race: ['All', ...Object.values(RaceType)],
    Element: ['All', ...Object.values(ElementType)],
    Size: ['All', 'Small', 'Medium', 'Large'],
    Class: ['All', 'Normal', 'Boss'],
  };

  const items: DropdownModel[] = [];
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
  items.push({
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

  const options: [string, string, number, number][] = [
    ['Atk', 'atk', 1, 65],
    ['Atk %', 'atkPercent', 1, 30],
    ['Matk', 'matk', 1, 65],
    ['Matk %', 'matkPercent', 1, 30],
    ['Long Range', 'range', 1, 30],
    ['Melee', 'melee', 1, 30],
    ['CRI Rate', 'cri', 1, 30],
    ['CRI Dmg', 'criDmg', 1, 30],
    ['ASPD %', 'aspdPercent', 1, 30],
    ['Delay', 'acd', 1, 30],
    ['VCT', 'vct', 1, 30],
    ['All Stat', 'allStatus', 1, 30],
  ];

  const VAL_CAP = 10;
  for (const [label, prop, rawMin, rawMax] of options) {
    const values = [] as { label: string; min: number; max: number }[];
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
          label: `${label} +${num}`,
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
              label: `${label} +${num}`,
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
    items.push(item);
  }

  return items;
};