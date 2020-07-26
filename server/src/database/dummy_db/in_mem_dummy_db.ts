const store = [];

export const addData = (data) => {
    store.push(data);
}

export const getData = () => {
    return store;
}
