import { ElementType } from '../constants';
import { MonsterModel } from '../models/monster.model';
import { firstUppercase, floor } from '../utils';

interface PreparedMonsterModel {
  name: string;
  level: number;
  /**
   * lowercase
   */
  race: 'formless' | 'undead' | 'brute' | 'plant' | 'insect' | 'fish' | 'demon' | 'demihuman' | 'angel' | 'dragon';
  /**
   * "Formless"
   */
  raceUpper: 'Formless' | 'Undead' | 'Brute' | 'Plant' | 'Insect' | 'Fish' | 'Demon' | 'DemiHuman' | 'Angel' | 'Dragon';
  size: 's' | 'm' | 'l';
  sizeUpper: 'S' | 'M' | 'L';
  /**
   * Large
   */
  sizeFullUpper: 'Small' | 'Medium' | 'Large';
  /**
   * lowercase ex neutral
   */
  element: string;
  elementUpper: ElementType;
  /**
   * "Ghost 3"
   */
  elementName: string;
  elementLevelN: number;
  /**
   * "Ghost 3"
   */
  elementLevelUpper: string;
  type: 'normal' | 'boss';
  isMvp: boolean;
  typeUpper: 'Normal' | 'Boss';
  softDef: number;
  softMDef: number;
  hitRequireFor100: number;
  criShield: number;
  def: number;
  mdef: number;
  hp: number;
  str: number;
  agi: number;
  dex: number;
  vit: number;
  int: number;
  luk: number;
  res: number;
  mres: number;
}

export class Monster {
  private _monster: MonsterModel = {} as any;
  private _monsterData: PreparedMonsterModel = {
    name: '',
    level: 1,
    race: 'formless',
    raceUpper: 'Formless',
    size: 'm',
    sizeUpper: 'M',
    sizeFullUpper: 'Medium',
    element: '',
    elementUpper: ElementType.Neutral,
    elementName: 'Neutral 1',
    elementLevelN: 1,
    elementLevelUpper: 'neutral 1',
    type: 'normal',
    isMvp: false,
    typeUpper: 'Normal',
    softDef: 1,
    softMDef: 1,
    hitRequireFor100: 1,
    criShield: 1,
    def: 0,
    mdef: 0,
    hp: 0,
    str: 0,
    agi: 0,
    dex: 0,
    vit: 0,
    int: 0,
    luk: 0,
    res: 0,
    mres: 0,
  };

  get data(): PreparedMonsterModel {
    return this._monsterData;
  }

  get level() {
    return this._monsterData.level;
  }
  get race() {
    return this._monsterData.race;
  }
  /**
   * For bonus programatic
   */
  get element() {
    return this._monsterData.element;
  }
  /**
   * For sudo element mapping
   */
  get elementName() {
    return this._monsterData.elementName;
  }
  get elementType(): ElementType {
    return this._monsterData.elementUpper;
  }
  get size() {
    return this._monsterData.size;
  }
  get type() {
    return this._monsterData.type;
  }

  get isBoss() {
    return this._monsterData.type === 'boss';
  }
  get isMVP() {
    return this._monsterData.isMvp;
  }

  get spawn() {
    return this._monster.spawn || '';
  }

  setData(monster: MonsterModel) {
    // "elementName": "Ghost 3",
    // "elementShortName": "Ghost",
    // "scaleName": "Large",
    // "raceName": "Formless"
    const {
      name,
      stats: { int, vit, agi, luk, str, dex, level, elementName, health, defense, magicDefense, res, mres, raceName, class: monsterTypeId, scaleName, mvp },
    } = monster;

    const [pureElement, eleLvl] = elementName.split(' ');
    const _class = monsterTypeId === 0 ? 'normal' : 'boss';

    this._monster = monster;
    this._monsterData = {
      name,
      level,
      element: pureElement.toLowerCase(),
      elementUpper: firstUppercase(pureElement) as ElementType,
      elementName,
      elementLevelN: Number(eleLvl),
      elementLevelUpper: elementName,
      race: raceName.toLowerCase() as any,
      raceUpper: raceName as any,
      size: scaleName.at(0).toLowerCase() as any,
      sizeUpper: scaleName.at(0) as any,
      sizeFullUpper: scaleName as any,
      type: _class,
      isMvp: mvp === 1,
      typeUpper: firstUppercase(_class) as any,
      hp: health,
      def: defense,
      softDef: floor((level + vit) / 2),
      mdef: magicDefense,
      softMDef: floor((level + int) / 4),
      criShield: floor(luk / 5),
      hitRequireFor100: 200 + level + agi,
      str,
      agi,
      dex,
      vit,
      int,
      luk,
      res,
      mres,
    };

    return this;
  }

  isRace(...races: (typeof this.race)[]) {
    return races.some((race) => race === this.race);
  }

  isElement(...elements: PreparedMonsterModel['elementUpper'][]) {
    return elements.some((element) => element === this.elementType);
  }

  isSize(...sizes: PreparedMonsterModel['size'][]) {
    return sizes.some((size) => size === this.size);
  }
}
