// Ajout du sélecteur de région : l'API HoYoLab (contrairement à Mihomo)
// a besoin de savoir sur quel serveur se trouve le compte, en plus de
// l'UID — voir config/hoyolab.js côté backend.

function SearchBox({
  userId,
  setUserId,
  region,
  setRegion,
  regions,
  language,
  setLanguage,
  languages,
  loading,
  onSearch,
}) {
  return (
    <section className="section py-4">
      <div className="container">
        <div className="box search-box">
          <div className="columns is-vcentered">
            <div className="column is-6">
              <div className="field has-addons">
                <div className="control is-expanded">
                  <input
                    className="input is-dark font-orbitron"
                    type="text"
                    placeholder="Entrez un UID (ex: 701536690)"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
                <div className="control">
                  <button
                    className={`button is-warning font-orbitron ${loading ? "is-loading" : ""}`}
                    onClick={onSearch}
                  >
                    RECHERCHER
                  </button>
                </div>
              </div>
            </div>

            <div className="column is-3">
              <div className="select is-fullwidth is-dark">
                <select value={region} onChange={(e) => setRegion(e.target.value)}>
                  {regions.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="column is-3">
              <div className="select is-fullwidth is-dark">
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SearchBox;
