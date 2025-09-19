

// import React, { useEffect, useState, useRef } from "react";
// import useDebounce from "../hooks/useDebounce";
// import { useDispatch } from "react-redux";
// import { addMarker } from "../store/slices/markersSlice";
// import { Search, Home } from "lucide-react"; // icons

// /**
//  * SearchBar — fetches location suggestions from Nominatim (OpenStreetMap)
//  * Styled similar to Google Maps mobile search bar
//  */

// const SEARCH_URL = "https://nominatim.openstreetmap.org/search";

// const SearchBar = () => {
//   const dispatch = useDispatch();
//   const [query, setQuery] = useState("");
//   const debouncedQuery = useDebounce(query, 350);
//   const [results, setResults] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(-1);
//   const containerRef = useRef(null);

//   // Fetch suggestions from OSM API
//   useEffect(() => {
//     if (!debouncedQuery || debouncedQuery.length < 2) {
//       setResults([]);
//       return;
//     }

//     const params = new URLSearchParams({
//       q: debouncedQuery,
//       format: "jsonv2",
//       addressdetails: "1",
//       limit: "6",
//     });

//     fetch(`${SEARCH_URL}?${params.toString()}`, {
//       headers: {
//         "Accept-Language": "en",
//         "User-Agent": "live-location-map-example/1.0 (your-email@example.com)",
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setResults(Array.isArray(data) ? data : []);
//         setOpen(true);
//         setActiveIndex(-1);
//       })
//       .catch((err) => {
//         console.error("Geocode error:", err);
//         setResults([]);
//       });
//   }, [debouncedQuery]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const onDoc = (e) => {
//       if (containerRef.current && !containerRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("click", onDoc);
//     return () => document.removeEventListener("click", onDoc);
//   }, []);

//   // Handle selection
//   function handleSelect(item) {
//     const lat = parseFloat(item.lat);
//     const lng = parseFloat(item.lon);
//     const label = item.display_name;
//     dispatch(addMarker({ lat, lng, label }));
//     setQuery(label);
//     setOpen(false);
//     setResults([]);

//     if (onselect) onselect([lat,lng])
//   }

//   // Keyboard navigation
//   function onKeyDown(e) {
//     if (!open) return;
//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setActiveIndex((i) => Math.min(i + 1, results.length - 1));
//     } else if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setActiveIndex((i) => Math.max(i - 1, 0));
//     } else if (e.key === "Enter") {
//       e.preventDefault();
//       if (activeIndex >= 0 && activeIndex < results.length) {
//         handleSelect(results[activeIndex]);
//       }
//     } else if (e.key === "Escape") {
//       setOpen(false);
//     }
//   }

//   return (
//     <div className="mobile-search-wrapper" ref={containerRef}>
//       {/* Google Maps Styled Search Bar */}
//       <div className="mobile-search-bar">
//         <Search className="search-icon" size={20} />
//         <input
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onFocus={() => debouncedQuery && setOpen(true)}
//           onKeyDown={onKeyDown}
//           placeholder="Search places, malls, cities..."
//         />
//         <Home
//           className="home-icon"
//           size={22}
//           onClick={() => {
//             navigator.geolocation.getCurrentPosition((pos) => {
//               const { latitude, longitude } = pos.coords;
//               dispatch(addMarker({ lat: latitude, lng: longitude, label: "Current Location" }));
//             });
//           }}
//         />
//       </div>

//       {/* Suggestions Dropdown */}
//       {open && results.length > 0 && (
//         <ul className="mobile-suggestions">
//           {results.map((r, i) => (
//             <li
//               key={r.place_id || `${r.lat}-${r.lon}-${i}`}
//               onClick={() => handleSelect(r)}
//               onMouseEnter={() => setActiveIndex(i)}
//               className={i === activeIndex ? "active" : ""}
//             >
//               <div className="suggestion-title">
//                 {r.display_name.split(",").slice(0, 2).join(",")}
//               </div>
//               <div className="suggestion-sub">{r.display_name}</div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default SearchBar;

import React, { useEffect, useState, useRef } from "react";
import useDebounce from "../hooks/useDebounce";
import { useDispatch } from "react-redux";
import { addMarker } from "../store/slices/markersSlice";
import { Search, Home } from "lucide-react";

const SEARCH_URL = "https://nominatim.openstreetmap.org/search";

const SearchBar = ({ onSelect }) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loadingHome, setLoadingHome] = useState(false);
  const containerRef = useRef(null);

  /** Fetch suggestions from OSM API */
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const params = new URLSearchParams({
      q: debouncedQuery,
      format: "jsonv2",
      addressdetails: "1",
      limit: "8",
    });

    fetch(`${SEARCH_URL}?${params.toString()}`, {
      headers: {
        "Accept-Language": "en",
        "User-Agent": "live-location-map-example/1.0 (your-email@example.com)",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return setResults([]);

        // 🔹 Filter only important locations (city, town, street, etc.)
        const filtered = data.filter((place) => {
          const type = place.type?.toLowerCase();
          return (
            type === "city" ||
            type === "town" ||
            type === "village" ||
            type === "suburb" ||
            type === "state" ||
            type === "county" ||
            type === "road"
          );
        });

        setResults(filtered);
        setOpen(true);
        setActiveIndex(-1);
      })
      .catch((err) => {
        console.error("Geocode error:", err);
        setResults([]);
      });
  }, [debouncedQuery]);

  /** Close dropdown when clicked outside */
  useEffect(() => {
    const onDoc = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  /** Select a location from search results */
  const handleSelect = (item) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const label = item.display_name;

    dispatch(addMarker({ lat, lng, label }));
    if (onSelect) onSelect([lat, lng]);

    setQuery(label);
    setOpen(false);
    setResults([]);
  };

  /** Home button → get current live location */
  const goToHome = () => {
    setLoadingHome(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        // Custom home marker
        dispatch(
          addMarker({
            lat: latitude,
            lng: longitude,
            label: "🏠 My Home Location",
            type: "home",
          })
        );

        // Map zoom to home
        if (onSelect) onSelect([latitude, longitude]);

        setLoadingHome(false);
      },
      (err) => {
        console.error("Error fetching location:", err);
        setLoadingHome(false);
        alert("Unable to fetch your location. Please enable GPS.");
      },
      { enableHighAccuracy: true }
    );
  };

  /** Keyboard navigation */
  const onKeyDown = (e) => {
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
  };

  return (
    <div className="mobile-search-wrapper" ref={containerRef}>
      {/* Search Bar */}
      <div className="mobile-search-bar">
        <Search className="search-icon" size={20} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => debouncedQuery && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search city, area, street..."
        />
        <button
          className="home-btn"
          onClick={goToHome}
          disabled={loadingHome}
          title="Go to my location"
        >
          {loadingHome ? (
            <span className="loading-spinner"></span>
          ) : (
            <Home size={22} />
          )}
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {open && results.length > 0 && (
        <ul className="mobile-suggestions">
          {results.map((r, i) => (
            <li
              key={r.place_id || `${r.lat}-${r.lon}-${i}`}
              onClick={() => handleSelect(r)}
              onMouseEnter={() => setActiveIndex(i)}
              className={i === activeIndex ? "active" : ""}
            >
              <div className="suggestion-title">
                {r.display_name.split(",").slice(0, 2).join(",")}
              </div>
              <div className="suggestion-sub">{r.display_name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
