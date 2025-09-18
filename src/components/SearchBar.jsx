import React, { useEffect, useState, useRef } from "react";
import useDebounce from "../hooks/useDebounce";
import { useDispatch } from "react-redux";
import { addMarker } from "../store/slices/markersSlice";

/**
 * SearchBar — makes query to Nominatim (OpenStreetMap) to get suggestions.
 * On select, dispatches addMarker({ lat, lng, label })
 *
 * Note: Nominatim public API is rate-limited. For production, use a paid geocoding service or your own instance.
 */

const SEARCH_URL = "https://nominatim.openstreetmap.org/search";

const SearchBar = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    // Nominatim query: format=jsonv2, limit=5, addressdetails=1
    const params = new URLSearchParams({
      q: debouncedQuery,
      format: "jsonv2",
      addressdetails: "1",
      limit: "6",
    });

    // simple fetch
    fetch(`${SEARCH_URL}?${params.toString()}`, {
      headers: {
        "Accept-Language": "en", // change if needed
        "User-Agent": "live-location-map-example/1.0 (your-email@example.com)",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setResults(Array.isArray(data) ? data : []);
        setOpen(true);
        setActiveIndex(-1);
      })
      .catch((err) => {
        console.error("Geocode error:", err);
        setResults([]);
      });
  }, [debouncedQuery]);

  // click outside to close dropdown
  useEffect(() => {
    const onDoc = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  function handleSelect(item) {
    // item has lat, lon, display_name
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const label = item.display_name;
    dispatch(addMarker({ lat, lng, label }));
    setQuery(label);
    setOpen(false);
    setResults([]);
  }

  function onKeyDown(e) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelect(results[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => debouncedQuery && setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search places (e.g., mall, city, address)..."
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />

      {open && results.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            right: 0,
            zIndex: 1000,
            background: "white",
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            listStyle: "none",
            margin: 6,
            padding: 0,
            borderRadius: 6,
            maxHeight: 240,
            overflowY: "auto",
          }}
        >
          {results.map((r, i) => (
            <li
              key={r.place_id || `${r.lat}-${r.lon}-${i}`}
              onClick={() => handleSelect(r)}
              onMouseEnter={() => setActiveIndex(i)}
              style={{
                padding: "10px 12px",
                cursor: "pointer",
                background: i === activeIndex ? "#f0f6ff" : "white",
                borderBottom: "1px solid #eee",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {r.display_name.split(",").slice(0, 2).join(",")}
              </div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                {r.display_name}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
