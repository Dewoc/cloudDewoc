type localStorageItem = {
    type: string,
    itemData: any
}

export function getLocalStorage<T>(itemKey: string): T {
    let itemStringified;
    
    if(typeof window !== "undefined") 
        itemStringified = localStorage.getItem(itemKey);

    return itemStringified ? (JSON.parse(itemStringified).itemData as T) : ("" as T);
}

export function setLocalStorage(itemKey: string, itemValue: any){
    const item : localStorageItem = {
        type: typeof itemValue,
        itemData: { ...itemValue }
    };

    const finalItem = JSON.stringify(item);

    return localStorage.setItem(itemKey, finalItem);
}