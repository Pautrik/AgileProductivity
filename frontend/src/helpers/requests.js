const httpRequestJson = async (url, options={}) => {
    const res = await fetch(url, { cache: "no-store", ...options});

    if(!res.ok) {
        throw new Error("Failed to fetch content")
    }
    
    return await res.json();
}

export { httpRequestJson };