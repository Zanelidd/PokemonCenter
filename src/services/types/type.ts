export type Card = {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  hp?: string;
  types?: string[];
  evolesFrom?: string;
  evolvesTo?: string[];
  rules?: string[];
  ancientTrait?: IAncientTrait;
  abilities?: Ability[];
  attacks?: Attack[];
  weaknesses?: Weakness[];
  resistances?: Resistance[];
  retreatCost?: string[];
  convertedRetreatCost?: number;
  set: ISet;
  number: string;
  artist?: string;
  rarity: string;
  flavorText?: string;
  nationalPokedexNumbers?: number[];
  legalities: ILegality;
  images: ICardImage;
  tcgplayer?: ITCGPlayer;
  cardmarket?: ICardmarket;
};

export type Ability = {
  name: string;
  text: string;
  type: string;
};

export type Attack = {
  cost: string[];
  name: string;
  text: string;
  damage: string;
  convertedEnergyCost: string;
};

export type Resistance = {
  type: string;
  value: string;
};

export type Weakness = {
  type: string;
  value: string;
};

export type ISet = {
  id: string;
  images: ISetImage;
  legalities: ILegality;
  name: string;
  printedTotal: number;
  ptcgoCode: string;
  releaseDate: string;
  series: string;
  total: number;
  updatedAt: string;
};
