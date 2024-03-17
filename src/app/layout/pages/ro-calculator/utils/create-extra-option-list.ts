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
            label: `M. My ${element} +${num}%`,
          };
        }),
      };
    }),
  });

  const peneList = [
    { mainItemIdx: 0, label: 'เจาะกาย Race', prefixProp: 'p_pene_race_', properties: atkProps.Race },
    { mainItemIdx: 0, label: 'เจาะกาย Class', prefixProp: 'p_pene_class_', properties: atkProps.Class },
    { mainItemIdx: 1, label: 'เจาะเวท Race', prefixProp: 'm_pene_race_', properties: atkProps.Race },
    { mainItemIdx: 1, label: 'เจาะเวท Class', prefixProp: 'm_pene_class_', properties: atkProps.Class },
  ] as {
    mainItemIdx: number;
    label: string;
    prefixProp: string;
    properties: string[];
  }[];
  for (const { mainItemIdx, label, prefixProp, properties } of peneList) {
    const VAL_CAP = 10;
    const scale = 1;
    const rawMin = 1;
    const rawMax = 100;
    const pre = mainItemIdx === 0 ? 'เจาะกาย' : 'เจาะเวท';

    const children = [];
    for (const prop of properties) {
      const lower = prop.toLowerCase();
      const values = [] as { label: string; min: number; max: number }[];
      for (let i = rawMin; i < rawMax; i += VAL_CAP) {
        const max = Math.min(i + VAL_CAP - 1, rawMax);
        values.push({ label: `${i * scale} - ${max * scale}`, min: i, max: max });
      }

      children.push({
        label: prop,
        value: prop,
        children: values.map((value) => {
          const { label: label2, min, max } = value;

          return {
            label: `${prop} ${label2} %`,
            value: label2,
            children: Array.from({ length: max - min + 1 }, (_, k) => {
              const num = k + min;
              return {
                label: `${pre} ${prop} ${num * scale} %`,
                value: `${prefixProp}${lower}:${num * scale}`,
              };
            }),
          };
        }),
      });
    }

    items.push({
      label,
      value: label,
      children: children,
    });
  }

  const options: [string, string, number, number, number, string?][] = [
    ['Atk', 'atk', 1, 65, 1],
    ['Atk %', 'atkPercent', 1, 30, 1, ' %'],
    ['Matk', 'matk', 1, 65, 1],
    ['Matk %', 'matkPercent', 1, 30, 1, ' %'],
    ['Long Range', 'range', 1, 30, 1, ' %'],
    ['Melee', 'melee', 1, 30, 1, ' %'],
    ['CRI Rate', 'cri', 1, 30, 1, ' %'],
    ['CRI Dmg', 'criDmg', 1, 30, 1, ' %'],
    ['ASPD', 'aspd', 1, 5, 1],
    ['ASPD %', 'aspdPercent', 1, 30, 1, ' %'],
    ['Delay', 'acd', 1, 30, 1, ' %'],
    ['VCT', 'vct', 1, 30, 1, ' %'],
    ['HP %', 'hpPercent', 1, 20, 1, ' %'],
    ['HP', 'hp', 1, 20, 50],
    ['SP %', 'spPercent', 1, 20, 1, ' %'],
    ['SP', 'sp', 1, 20, 20],
  ];

  const subTypeMap = {
    Atk: 'Physical',
    'Atk %': 'Physical',
    'Long Range': 'Physical',
    Melee: 'Physical',
    Matk: 'Magical',
    'Matk %': 'Magical',
  };

  const DEFAULT_CAP = 10;
  for (const [label, prop, rawMin, rawMax, scale, suffix] of options) {
    const labelNoPercent = label.startsWith('BaseHP')
      ? 'BaseHP'
      : label.startsWith('BaseSP')
      ? 'BaseSP'
      : label.replace(' %', '');
    const values = [] as { label: string; min: number; max: number }[];
    const sign = label === 'Delay' || label === 'VCT' ? '-' : '+';
    const cap = rawMax - rawMin > 20 ? DEFAULT_CAP : rawMax;
    for (let i = rawMin; i < rawMax; i += cap) {
      const max = Math.min(i + cap - 1, rawMax);
      values.push({ label: `${i * scale} - ${max * scale}`, min: i, max: max });
    }

    let children = [];
    if (values.length === 1) {
      const { min, max } = values[0];
      children = Array.from({ length: max - min + 1 }, (_, k) => {
        const num = k + min;
        return {
          label: `${labelNoPercent} ${sign}${num * scale}${suffix || ''}`,
          value: `${prop}:${num * scale}`,
        };
      });
    } else {
      children = values.map((value) => {
        const { label: label2, min, max } = value;

        return {
          label: `${labelNoPercent} ${label2}${suffix || ''}`,
          value: label2,
          children: Array.from({ length: max - min + 1 }, (_, k) => {
            const num = k + min;
            return {
              label: `${labelNoPercent} ${sign}${num * scale}${suffix || ''}`,
              value: `${prop}:${num * scale}`,
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
