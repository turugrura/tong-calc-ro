import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';
import { Swordman } from './swordman';
import { SpearMastery } from '../constants/share-passive-skills';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class LordKnight extends CharacterBase {
    protected readonly CLASS_NAME = ClassName.LordKnight;
    protected readonly JobBonusTable = jobBonusTable;

    protected readonly initialStatusPoint = 40;
    protected readonly classNames = ['Hi-Class', 'Lord Knight', 'Lord Knight Cls', 'Lord Knight Class'];
    protected readonly _atkSkillList: AtkSkillModel[] = [];
    protected readonly _activeSkillList: ActiveSkillModel[] = [

        {
            label: 'Two hand Quick 10',
            name: 'Two hand Quicken',
            inputType: 'selectButton',
            dropdown: [
                { label: 'Yes', value: 10, skillLv: 10, isUse: true, bonus: { '2hand_skillAspd': 7, '2handSword_skillAspd': 7 } },
                { label: 'No', value: 0, isUse: false },
            ],
        },
    ];
    protected readonly _passiveSkillList: PassiveSkillModel[] = [
        SpearMastery,
    ];

    constructor() {
        super()

        this.inheritBaseClass(new Swordman())
    }
}
