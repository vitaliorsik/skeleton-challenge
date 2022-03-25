export const isEmptyObject = (object: Object): boolean => {
    return Object.keys(object).length === 0;
}

export const isNumber = (value: any): boolean => {
    return !isNaN(value);
}

export const isValidEmail = (email: string): boolean => {
    return !!email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}
