/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useRef } from "react";
import { Search, LayoutGrid, List, Loader2, Heart } from "lucide-react";
import api from "../../../../lib/api";
import {
  PropertyCard,
  PropertyListRow,
  PropertyDetailModal,
} from "./PropertyComponents";

const SEARCH_DEBOUNCE_MS = 500;

function MyFavorites() {
  const [view, setView] = useState("grid");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const pageSize = 12;
  const debounceRef = useRef(null);

  useEffect(() => {
    document.title = "RentStreet | My Favorites";
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  const fetchFavorites = useCallback(() => {
    setLoading(true);
    setErrorMsg("");
    api
      .get("/renter/favorites", {
        params: { search: debouncedSearch, page, page_size: pageSize },
      })
      .then((res) => {
        setProperties(res.data.items);
        setTotal(res.data.total);
      })
      .catch(() => setErrorMsg("Couldn't load your favorites."))
      .finally(() => setLoading(false));
  }, [debouncedSearch, page]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Unfavoriting here should drop the card immediately rather than wait for
  // a refetch — this list only exists to show favorited properties, so an
  // un-favorite is effectively "remove from this page," not just a toggle.
  const toggleFavorite = async (property, e) => {
    e.stopPropagation();
    setProperties((prev) => prev.filter((p) => p.id !== property.id));
    setTotal((t) => Math.max(0, t - 1));
    try {
      await api.delete(`/renter/favorites/${property.id}`);
    } catch {
      fetchFavorites(); // couldn't unfavorite — resync with the server instead of guessing
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl">
          My Favorites
        </h1>
        <p className="text-sm text-ink/60 mt-1">
          Properties you've saved for later.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search your favorites..."
            className="w-full rounded-xl border border-ink/10 pl-10 pr-4 py-3 bg-white focus:outline-none focus:border-papaya transition-all text-sm"
          />
          {searchInput !== debouncedSearch && (
            <Loader2
              size={14}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/30 animate-spin"
            />
          )}
        </div>
        <div className="flex rounded-xl border border-ink/10 overflow-hidden flex-shrink-0">
          <button
            onClick={() => setView("grid")}
            className={`px-3.5 py-3 flex items-center justify-center transition-colors ${
              view === "grid"
                ? "bg-papaya text-white"
                : "bg-white text-ink/40 hover:bg-mist"
            }`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-3.5 py-3 flex items-center justify-center transition-colors ${
              view === "list"
                ? "bg-papaya text-white"
                : "bg-white text-ink/40 hover:bg-mist"
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-papaya" size={28} />
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-ink/5 py-16 text-center">
          <Heart size={28} className="text-ink/20 mx-auto mb-3" />
          <p className="text-ink/40 font-medium">
            {debouncedSearch
              ? "No favorites match your search"
              : "No favorites yet"}
          </p>
          <p className="text-sm text-ink/30 mt-1">
            Tap the heart on any property to save it here.
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              onClick={() => setSelectedId(p.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map((p) => (
            <PropertyListRow
              key={p.id}
              property={p}
              onClick={() => setSelectedId(p.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}

      {total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink/40">
            Showing {properties.length} of {total}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="w-8 h-8 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-mist disabled:opacity-30 transition-colors"
            >
              ‹
            </button>
            <span className="text-sm font-medium text-ink/60 px-2">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="w-8 h-8 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-mist disabled:opacity-30 transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      )}

      {selectedId && (
        <PropertyDetailModal
          propertyId={selectedId}
          onClose={() => setSelectedId(null)}
          onFavoriteChange={fetchFavorites}
          onApplied={() => fetchFavorites()}
        />
      )}
    </div>
  );
}

export default MyFavorites;
