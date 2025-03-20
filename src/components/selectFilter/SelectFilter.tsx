import { Card } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';

type SetFilterProps = {
  cards: Array<Card>,
  id: keyof Card,
  setFilterTags: Dispatch<SetStateAction<Record<string, string>>>
}
const SelectFilter = ({ cards, id, setFilterTags }: SetFilterProps) => {
  const filterHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value, id } = event.target;
    const category = id;

    if (value) {
      setFilterTags((previous) => ({ ...previous, [category]: value }));
    } else {
      setFilterTags((previous) => {
        delete previous[category];
        return { ...previous };
      });
    }
  };

  const getValue = (data: Card, id: keyof Card): string => {
    if (id === 'set') {
      return data.set?.id;
    }
    return data[id] as string;
  };
  return <select id={id} onChange={filterHandler}>
    <option value="">Select a {id} ...</option>
    {[...new Set(cards.flatMap((data) => {
      return getValue(data, id);
    }))]
      .sort()
      .map((type, i) => (
        <option key={`${type}+${i}`} value={type}>
          {type}
        </option>
      ))}
  </select>;
};

export default SelectFilter;