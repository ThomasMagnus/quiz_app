export const getPage = async (url, tokenName) => {
    return await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem(tokenName)}`
        }
    })
        .then(response => response.json())
}

export const detectLocalStorage = (tokenName) => {
    return !!localStorage.getItem(tokenName);
};