import { PassiveSkillModel } from "../../jobs/_character-base.abstract";

export const DemonBane: PassiveSkillModel = {
    inputType: 'dropdown',
    label: 'Demon Bane',
    name: 'Demon Bane',
    isMasteryAtk: true,
    dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { x_atk_race_demon: 3, x_atk_element_undead: 3 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { x_atk_race_demon: 6, x_atk_element_undead: 6 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { x_atk_race_demon: 9, x_atk_element_undead: 9 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { x_atk_race_demon: 12, x_atk_element_undead: 12 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { x_atk_race_demon: 15, x_atk_element_undead: 15 } },
        { label: 'Lv 6', value: 6, isUse: true, bonus: { x_atk_race_demon: 18, x_atk_element_undead: 18 } },
        { label: 'Lv 7', value: 7, isUse: true, bonus: { x_atk_race_demon: 21, x_atk_element_undead: 21 } },
        { label: 'Lv 8', value: 8, isUse: true, bonus: { x_atk_race_demon: 24, x_atk_element_undead: 24 } },
        { label: 'Lv 9', value: 9, isUse: true, bonus: { x_atk_race_demon: 27, x_atk_element_undead: 27 } },
        { label: 'Lv 10', value: 10, isUse: true, bonus: { x_atk_race_demon: 30, x_atk_element_undead: 30 } },
    ],
}