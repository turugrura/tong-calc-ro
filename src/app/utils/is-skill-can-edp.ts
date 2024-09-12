const CannotEDP = {
  'Meteor Assault': false,
} as const;

export const isSkillCanEDP = (skillName: string) => {
  return CannotEDP[skillName] !== false;
};
