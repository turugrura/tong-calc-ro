console.clear();

// const lvl = 175
// const factor = 90
// const linear = 650

// let hp = 35

// for(let i = 2; i<=lvl; i++) {
//   hp += (Math.floor(factor*i/100) + Math.floor(linear/100))
// }

// console.log({hp, hpx25: hp*1.25})

const bonuses = [
  { Level: 1, Str: 1 },
  { Level: 2, Agi: 1 },
  { Level: 4, Vit: 1 },
  { Level: 6, Int: 1 },
  { Level: 7, Dex: 1 },
  { Level: 9, Luk: 1 },
  { Level: 11, Str: 1 },
  { Level: 12, Agi: 1 },
  { Level: 14, Vit: 1 },
  { Level: 16, Int: 1 },
  { Level: 17, Dex: 1 },
  { Level: 19, Luk: 1 },
  { Level: 21, Str: 1 },
  { Level: 22, Agi: 1 },
  { Level: 24, Vit: 1 },
  { Level: 26, Int: 1 },
  { Level: 27, Dex: 1 },
  { Level: 29, Luk: 1 },
  { Level: 31, Str: 1 },
  { Level: 32, Agi: 1 },
  { Level: 34, Vit: 1 },
  { Level: 36, Int: 1 },
  { Level: 37, Dex: 1 },
  { Level: 39, Luk: 1 },
  { Level: 41, Str: 1 },
  { Level: 42, Agi: 1 },
  { Level: 44, Vit: 1 },
  { Level: 46, Int: 1 },
  { Level: 47, Dex: 1 },
  { Level: 49, Luk: 1 },
];
// str, agi, vit, int, dex, luk
const response = {} as any;
for (let i = 1; i <= 70; i++) {
  let [str, agi, vit, int, dex, luk] = i === 1 ? [0, 0, 0, 0, 0, 0] : response[i - 1];

  const { Level, Str, Agi, Vit, Int, Dex, Luk } = bonuses.find((a) => a.Level === i) || {};
  if (i === Level) {
    if (Str && Str > 0) str++;
    if (Agi && Agi > 0) agi++;
    if (Vit && Vit > 0) vit++;
    if (Int && Int > 0) int++;
    if (Dex && Dex > 0) dex++;
    if (Luk && Luk > 0) luk++;
  }

  response[i] = [str, agi, vit, int, dex, luk];
}

console.log(response);
