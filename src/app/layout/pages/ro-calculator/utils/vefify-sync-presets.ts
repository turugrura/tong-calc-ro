const verifySyncPreset = (localPresets, createdPresets) => {
  const map = new Map<string, typeof this.model>(localPresets.map((a) => [a.value, a.model]));

  const successCreates = [] as { id: string; label: string }[];
  const failedCreates = [] as { label: string; errMessages: string[] }[];
  for (const p of createdPresets) {
    const local = map.get(p.label);
    const x = { label: p.label, errMessages: [] } as { label: string; errMessages: string[] };

    if (!local) {
      x.errMessages.push('invalid label');
    } else {
      for (const [key, val] of Object.entries(local)) {
        const cloudVal = p.model[key];
        if (val == null) {
          if (cloudVal != null) {
            x.errMessages.push(`${key}, local = ${val}, but cloud = ${cloudVal}`);
          }
          continue;
        }

        if (Array.isArray(val)) {
          if (!Array.isArray(cloudVal)) {
            x.errMessages.push(`${key}, local = ${val}, but cloud = ${cloudVal}`);
            continue;
          }

          if (val.length !== cloudVal.length) {
            x.errMessages.push(`${key} length, local = ${val.length}, but cloud = ${cloudVal.length}`);
            continue;
          }

          for (let i = 0; i < val.length; i++) {
            if (val[i] !== cloudVal[i]) {
              x.errMessages.push(`${key} index- ${i}, local = ${val[i]}, but cloud = ${cloudVal[i]}`);
            }
          }
        } else {
          if (val !== cloudVal) {
            x.errMessages.push(`${key} , local = ${val}, but cloud = ${cloudVal}`);
          }
        }
      }
    }

    if (x?.errMessages?.length > 0) {
      failedCreates.push(x);
    } else {
      successCreates.push({ id: p.id, label: p.label });
    }
  }

  console.log('successCreates', [...successCreates]);
  console.log('failedCreates', [...failedCreates]);
};
