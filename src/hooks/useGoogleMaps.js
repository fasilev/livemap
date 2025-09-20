import { useEffect } from "react";

const useGoogleMaps = (apiKey) => {
  useEffect(() => {
    if (window.google && window.google.maps) return; 

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); 
    };
  }, [apiKey]);
};

export default useGoogleMaps;
