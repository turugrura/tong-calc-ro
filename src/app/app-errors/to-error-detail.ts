const MapErrorMsg = {
  'cannot update published preset': 'cannot update shared preset.',
};

export const ToErrorDetail = (err) => {
  const errMessage = MapErrorMsg[err?.error?.message];

  return errMessage || err?.error?.message || err?.statusText || err?.error;
};
