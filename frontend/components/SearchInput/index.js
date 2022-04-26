import { useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import { FiSearch } from "react-icons/fi";
import styles from '../../styles/components/SearchInput.module.css';

export function SearchInput(){
    const {
        searchSpecificQuestions
    } = useContext(GlobalContext)

    const [value, setValue] = useState('');

    return (
        <div className={styles.searchArea}>
        { value.length < 1 && <FiSearch size={22} color="var(--text-color)" />}
        <input 
            type="text" 
            placeholder="Buscar" 
            style={{ color: '#000' }}
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={(e) => {
                if(e.key === 'Enter'){
                    searchSpecificQuestions(value);
                }
            }}
        />
        {value.length > 0 && <button onClick={() => { searchSpecificQuestions(value) }}>BUSCAR</button>}
        </div>
    )
}