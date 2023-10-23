import { PassiveSkillModel } from "../../jobs/_character-base.abstract";

export const SpearMastery: PassiveSkillModel = {
    label: 'Spear M. 10',
    name: 'Spear Mastery',
    inputType: 'selectButton',
    isMasteryAtk: true,
    dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true, bonus: { x_spear_atk: 40 } },
        { label: 'No', value: 0, isUse: false },
    ],
}