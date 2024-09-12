import { ElementType } from '../constants/element-type.const';
import { RaceType } from '../constants/race-type.const';
import { DropdownModel } from '../models/dropdown.model';
import { createBaseStatOptionList } from './create-base-stat-option-list';

interface X extends DropdownModel {
  children?: X[];
}

export const createBonusNameList = () => {
  const atkTypes = ['Physical', 'Magical'];
  const atkProps = {
    Race: ['All', ...Object.values(RaceType)],
    Element: ['All', ...Object.values(ElementType)],
    Size: ['All', 'Small', 'Medium', 'Large'],
    Class: ['All', 'Normal', 'Boss'],
  };

  const items: X[] = [];
  for (const atkType of atkTypes) {
    const bonusType = atkType.at(0).toLowerCase();
    const item: X = {
      value: bonusType,
      label: atkType,
      children: [],
    };
    for (const [dmgType, dmgSubTypes] of Object.entries(atkProps)) {
      const propLow = dmgType.toLowerCase();
      const val = `${propLow}_${dmgType}`;
      item.children.push({
        value: val,
        label: dmgType,
        children: dmgSubTypes.map((label2) => {
          const finalPropLow = label2.toLowerCase();
          let fixedSize = finalPropLow;
          if (dmgType === 'Size') {
            fixedSize = finalPropLow === 'all' ? finalPropLow : finalPropLow.at(0);
          }

          const bonusName = `${bonusType}_${propLow}_${fixedSize}`;

          return {
            value: bonusName,
            label: `${bonusType.toUpperCase()}. ${dmgType} ${label2}`,
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
      const prop = `m_my_element_${elementLow}`;

      return {
        value: prop,
        label: `M. My ${element}`,
      };
    }),
  });

  const options: [string, string][] = [
    ['Atk', 'atk'],
    ['Atk %', 'atkPercent'],
    ['Matk', 'matk'],
    ['Matk %', 'matkPercent'],
    ['Long Range', 'range'],
    ['Melee', 'melee'],
    ['CRI Rate', 'cri'],
    ['CRI Dmg', 'criDmg'],
    ['ASPD', 'aspd'],
    ['ASPD %', 'aspdPercent'],
    ['Delay', 'acd'],
    ['VCT', 'vct'],
    ['HP %', 'hpPercent'],
    ['SP %', 'spPercent'],
  ];

  const subTypeMap = {
    Atk: 'Physical',
    'Atk %': 'Physical',
    'Long Range': 'Physical',
    Melee: 'Physical',
    Matk: 'Magical',
    'Matk %': 'Magical',
  };

  for (const [label, bonusName] of options) {
    const item: X = {
      label,
      value: bonusName,
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

  items.push(createBaseStatOptionList(0, 0));

  return items;
};
