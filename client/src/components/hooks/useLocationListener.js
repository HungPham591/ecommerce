import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useLocationListener(func = null) {
    const location = useLocation();

    useEffect (() => {
        func && func(location);
    }, [location, func])

    return location;
}