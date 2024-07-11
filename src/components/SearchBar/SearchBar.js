import styles from "./SearchBar.module.css";

function SearchBar({ value, onChange, getSearchResults, setSearchResults }) {
  const clearSearchResults = () => {
    setSearchResults([]);
  };

  return (
    <div className={styles.SearchBar}>
      <input
        type="text"
        placeholder="Enter A Song, Album, or Artist"
        value={value}
        onChange={onChange}
      />
      <button className={styles.SearchButton} onClick={getSearchResults}>
        SEARCH
      </button>
      <br />
      <button className={styles.ClearSearchButton} onClick={clearSearchResults}>
        Clear Search Results
      </button>
    </div>
  );
}

export default SearchBar;
