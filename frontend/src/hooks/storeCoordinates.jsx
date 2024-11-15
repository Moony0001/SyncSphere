import { useEffect, useState } from "react";

export default function storeCoordinates(key, initialValue) {
    const [value, setValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading key "${key}" from localStorage:`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error saving key "${key}" to localStorage:`, error);
        }
    }, [key, value]);

    return { value, setValue };

}