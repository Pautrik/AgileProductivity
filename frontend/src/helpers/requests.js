const httpRequestJson = async (url, method = "GET") => {
    const res = await fetch(url, { method });

    if(!res.ok) {
        throw new Error("Failed to fetch content")
    }
    
    return await res.json();
}

export { httpRequestJson };