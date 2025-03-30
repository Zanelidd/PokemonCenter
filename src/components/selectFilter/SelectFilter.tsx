import {Card} from 'pokemon-tcg-sdk-typescript/dist/sdk';
import {ChangeEvent, Dispatch, SetStateAction, useMemo} from 'react';
import {Type} from "pokemon-tcg-sdk-typescript/dist/enums/type";

type SetFilterProps = {
    cards: Array<Card>,
    id: keyof Card,
    setFilterTags: Dispatch<SetStateAction<Record<string, string>>>
    filterTags: Record<string, string>
}
const SelectFilter = ({cards, id, setFilterTags, filterTags}: SetFilterProps) => {
    const filterHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        const {value, id} = event.target;
        const category = id;

        if (value === "") {
            setFilterTags((previous) => {
                delete previous[category];
                return { ...previous };
            });
        } else {
            setFilterTags((previous) => ({ ...previous, [category]: value }));
        }
    };

    const filteredCards = useMemo(() => {
               const activeFilters = Object.keys(filterTags).filter(key => key !== id);

        return cards.filter(card => {
            return activeFilters.every(filterKey => {
                if (filterKey === 'set') {
                    return card.set?.name === filterTags[filterKey];
                }
                if (filterKey === 'types') {
                    return card.types?.includes(filterTags[filterKey] as Type);
                }
                return card[filterKey as keyof Card] === filterTags[filterKey];
            });
        });
    }, [cards, filterTags, id]);

    const options = useMemo(() => {
        if (id === 'set') {
            return [...new Set(filteredCards.map(card => card.set?.name).filter(Boolean))].sort();
        }

        if (id === 'types') {
            const allTypes = filteredCards.flatMap(card => card.types || []);
            return [...new Set(allTypes)].sort() ;
        }

        return [...new Set(filteredCards.map(card => card[id]).filter(Boolean))].sort() as string[];
    }, [filteredCards, id]);

    const currentValue = filterTags[id] || '';

    return <select id={id} value={currentValue} onChange={filterHandler}>
        <option value="">Select a {id} ...</option>
        {options.map((type, i) => (
                <option key={`${type}+${i}`} value={type}>
                    {type}
                </option>
            ))}
    </select>;
};

export default SelectFilter;