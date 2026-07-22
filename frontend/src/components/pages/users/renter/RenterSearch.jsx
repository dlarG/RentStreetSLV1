/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  LayoutGrid,
  List,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Home,
  SlidersHorizontal,
  RotateCcw,
  Wifi,
  Zap,
  Droplet,
  ShowerHead,
  Wind,
  Fan,
  Table,
  Camera,
  Shield,
  Lightbulb,
  CookingPot,
  WashingMachine,
  Sofa,
  Car,
  PawPrint,
  Moon,
  Bus,
  ShoppingBag,
  Hospital,
  HeartIcon,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import api from "../../../../lib/api";
import "../../../../lib/leafletIconFix";
import {
  PropertyCard,
  PropertyListRow,
  PropertyDetailModal,
} from "./PropertyComponents";

const SEARCH_DEBOUNCE_MS = 500;

const SORT_OPTIONS = [
  { value: "rating", label: "Highest rated" },
  { value: "price_low", label: "Price: low to high" },
  { value: "price_high", label: "Price: high to low" },
  { value: "newest", label: "Newest listed" },
];

const EMPTY_FILTERS = { minPrice: "", maxPrice: "", amenityIds: [] };
const iconFor = (key) => AMENITY_ICON_MAP[key] || Home;
const AMENITY_ICON_MAP = {
  wifi: Wifi,
  tv: Home,
  zap: Zap,
  droplet: Droplet,
  droplets: Droplet,
  "shower-head": ShowerHead,
  bath: Home,
  wind: Wind,
  fan: Fan,
  table: Table,
  cabinet: Home,
  camera: Camera,
  shield: Shield,
  lock: Lock,
  flame: Home,
  lightbulb: Lightbulb,
  "cooking-pot": CookingPot,
  utensils: Home,
  "washing-machine": WashingMachine,
  sofa: Sofa,
  car: Car,
  "paw-print": PawPrint,
  moon: Moon,
  footprints: Home,
  bus: Bus,
  "shopping-bag": ShoppingBag,
  hospital: Hospital,
  heart: HeartIcon,
  "graduation-cap": GraduationCap,
  briefcase: Briefcase,
};
function RenterSearch() {
  const [view, setView] = useState("grid");

  // Raw text the user is typing — updates instantly for a responsive input.
  const [searchInput, setSearchInput] = useState("");
  // The value actually sent to the backend — only updates after the user
  // pauses typing, so we're not firing a request per keystroke.
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [sort, setSort] = useState("rating");
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS);
  const [amenityOptions, setAmenityOptions] = useState([]);

  const pageSize = 12;
  const debounceRef = useRef(null);

  useEffect(() => {
    document.title = "RentStreet | Find Rooms";
    api
      .get("/renter/amenities")
      .then((res) => setAmenityOptions(res.data))
      .catch(() => {});
  }, []);

  // Debounce: wait until the user stops typing before it becomes a real search.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  const fetchProperties = useCallback(() => {
    setLoading(true);
    setErrorMsg("");

    // Built manually with URLSearchParams so repeated array keys serialize
    // as amenity_ids=1&amenity_ids=2 — the shape FastAPI's Query(list[int])
    // expects. Axios's default object serialization sends amenity_ids[]=1
    // instead, which FastAPI silently can't parse into anything, so the
    // filter would otherwise do nothing no matter how "strict" the SQL is.
    const params = new URLSearchParams();
    params.set("search", debouncedSearch);
    params.set("sort", sort);
    params.set("page", String(page));
    params.set("page_size", String(pageSize));
    if (appliedFilters.minPrice)
      params.set("min_price", appliedFilters.minPrice);
    if (appliedFilters.maxPrice)
      params.set("max_price", appliedFilters.maxPrice);
    appliedFilters.amenityIds.forEach((id) => params.append("amenity_ids", id));

    api
      .get("/renter/properties/search", { params })
      .then((res) => {
        setProperties(res.data.items);
        setTotal(res.data.total);
      })
      .catch(() => setErrorMsg("Couldn't load properties."))
      .finally(() => setLoading(false));
  }, [debouncedSearch, sort, page, appliedFilters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const openFilters = () => {
    setDraftFilters(appliedFilters); // start editing from whatever's currently applied
    setShowFilters(true);
  };

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    setPage(1);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setDraftFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setSearchInput("");
    setDebouncedSearch("");
    setSort("rating");
    setPage(1);
  };

  const removeAppliedAmenity = (id) => {
    const next = {
      ...appliedFilters,
      amenityIds: appliedFilters.amenityIds.filter((a) => a !== id),
    };
    setAppliedFilters(next);
    setDraftFilters(next);
    setPage(1);
  };
  const removeAppliedPrice = (field) => {
    const next = { ...appliedFilters, [field]: "" };
    setAppliedFilters(next);
    setDraftFilters(next);
    setPage(1);
  };

  const toggleDraftAmenity = (id) => {
    setDraftFilters((f) => ({
      ...f,
      amenityIds: f.amenityIds.includes(id)
        ? f.amenityIds.filter((a) => a !== id)
        : [...f.amenityIds, id],
    }));
  };

  const hasActiveFilters =
    appliedFilters.minPrice ||
    appliedFilters.maxPrice ||
    appliedFilters.amenityIds.length > 0;
  const hasDraftChanges =
    JSON.stringify(draftFilters) !== JSON.stringify(EMPTY_FILTERS);

  const groupedAmenities = amenityOptions.reduce((acc, a) => {
    const cat = a.category || "other";
    (acc[cat] ||= []).push(a);
    return acc;
  }, {});
  const categoryLabels = {
    connectivity: "Connectivity",
    utility: "Utilities",
    safety: "Safety & Security",
    lifestyle: "Lifestyle",
    other: "Other",
  };

  const toggleFavorite = async (property, e) => {
    e.stopPropagation();
    const willFavorite = !property.is_favorited;
    setProperties((prev) =>
      prev.map((p) =>
        p.id === property.id ? { ...p, is_favorited: willFavorite } : p
      )
    );
    try {
      if (willFavorite) await api.post(`/renter/favorites/${property.id}`);
      else await api.delete(`/renter/favorites/${property.id}`);
    } catch {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === property.id ? { ...p, is_favorited: !willFavorite } : p
        )
      );
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl">
              Find a room
            </h1>
            <p className="text-sm text-ink/60 mt-1">
              Browse verified boarding houses in Sogod.
            </p>
          </div>
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
              placeholder="Search by name or barangay..."
              className="w-full rounded-xl border border-ink/10 pl-10 pr-4 py-3 bg-white focus:outline-none focus:border-papaya transition-all text-sm"
            />
            {searchInput !== debouncedSearch && (
              <Loader2
                size={14}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/30 animate-spin"
              />
            )}
          </div>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-ink/10 px-3 py-3 bg-white focus:outline-none focus:border-papaya transition-all text-sm"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <button
            onClick={openFilters}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all flex-shrink-0 ${
              hasActiveFilters
                ? "bg-papaya text-white"
                : "border border-ink/10 text-ink/60 hover:bg-mist"
            }`}
          >
            <SlidersHorizontal size={16} /> Filters
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-white text-papaya text-xs font-bold flex items-center justify-center">
                {appliedFilters.amenityIds.length +
                  (appliedFilters.minPrice || appliedFilters.maxPrice ? 1 : 0)}
              </span>
            )}
          </button>

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
      </div>

      {showFilters && (
        <div className="bg-white rounded-2xl border border-ink/5 p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg">Filters</h3>
            {hasDraftChanges && (
              <button
                onClick={() => setDraftFilters(EMPTY_FILTERS)}
                className="flex items-center gap-1.5 text-xs font-semibold text-papaya hover:text-marigold transition-colors"
              >
                <RotateCcw size={13} /> Reset
              </button>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-ink/70 mb-3">
              Monthly rent range (₱)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-ink/40 mb-1 block">
                  Minimum
                </label>
                <input
                  type="number"
                  value={draftFilters.minPrice}
                  onChange={(e) =>
                    setDraftFilters((f) => ({ ...f, minPrice: e.target.value }))
                  }
                  placeholder="1,500"
                  className="w-full rounded-xl border-2 border-ink/10 px-3 py-2.5 bg-white focus:outline-none focus:border-papaya text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-ink/40 mb-1 block">
                  Maximum
                </label>
                <input
                  type="number"
                  value={draftFilters.maxPrice}
                  onChange={(e) =>
                    setDraftFilters((f) => ({ ...f, maxPrice: e.target.value }))
                  }
                  placeholder="5,000"
                  className="w-full rounded-xl border-2 border-ink/10 px-3 py-2.5 bg-white focus:outline-none focus:border-papaya text-sm"
                />
              </div>
            </div>
          </div>

          {Object.keys(groupedAmenities).length > 0 ? (
            Object.entries(groupedAmenities).map(([category, amenities]) => (
              <div key={category}>
                <p className="text-sm font-semibold text-ink/70 mb-3">
                  {categoryLabels[category] || category}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {amenities.map((amenity) => {
                    const Icon = iconFor(amenity.icon_key);
                    const isSelected = draftFilters.amenityIds.includes(
                      amenity.id
                    );
                    return (
                      <button
                        key={amenity.id}
                        onClick={() => toggleDraftAmenity(amenity.id)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                          isSelected
                            ? "border-papaya bg-papaya/5 text-papaya"
                            : "border-ink/10 text-ink/60 hover:border-ink/20"
                        }`}
                      >
                        <Icon size={15} />
                        <span className="truncate">{amenity.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <Loader2
                className="animate-spin text-ink/20 mx-auto mb-2"
                size={20}
              />
              <p className="text-xs text-ink/40">Loading amenities...</p>
            </div>
          )}

          <div className="flex gap-3 pt-2 border-t border-ink/5">
            <button
              onClick={() => setShowFilters(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-ink/10 text-ink/60 font-semibold hover:bg-mist transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={applyFilters}
              className="flex-1 px-4 py-2.5 rounded-xl bg-papaya text-white font-semibold hover:bg-marigold transition-colors text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {errorMsg}
        </div>
      )}
      {hasActiveFilters && !showFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {appliedFilters.minPrice && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-papaya text-white px-3 py-1.5 rounded-full">
              Min ₱{Number(appliedFilters.minPrice).toLocaleString()}
              <button onClick={() => removeAppliedPrice("minPrice")}>
                <X size={12} />
              </button>
            </span>
          )}
          {appliedFilters.maxPrice && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-papaya text-white px-3 py-1.5 rounded-full">
              Max ₱{Number(appliedFilters.maxPrice).toLocaleString()}
              <button onClick={() => removeAppliedPrice("maxPrice")}>
                <X size={12} />
              </button>
            </span>
          )}
          {appliedFilters.amenityIds.map((id) => {
            const amenity = amenityOptions.find((a) => a.id === id);
            return amenity ? (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 text-xs font-medium bg-papaya text-white px-3 py-1.5 rounded-full"
              >
                {amenity.name}
                <button
                  className="p-2"
                  onClick={() => removeAppliedAmenity(id)}
                >
                  <X size={12} />
                </button>
              </span>
            ) : null;
          })}
          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-ink/40 hover:text-papaya transition-colors ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-papaya" size={28} />
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-ink/5 py-16 text-center">
          <Home size={28} className="text-ink/20 mx-auto mb-3" />
          <p className="text-ink/40 font-medium">No properties found</p>
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
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-ink/60 px-2">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="w-8 h-8 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-mist disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {selectedId && (
        <PropertyDetailModal
          propertyId={selectedId}
          onClose={() => setSelectedId(null)}
          onFavoriteChange={fetchProperties}
          onApplied={(propertyId) =>
            setProperties((prev) => prev.filter((p) => p.id !== propertyId))
          }
        />
      )}
    </div>
  );
}

export default RenterSearch;
