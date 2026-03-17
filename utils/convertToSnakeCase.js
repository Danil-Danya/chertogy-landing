import _ from "lodash";

const convertToSnakeCase = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map((item) => convertToSnakeCase(item));
    } 
    else if (obj !== null && typeof obj === "object") {
        return Object.keys(obj).reduce((acc, key) => {
            const snakeCaseKey = _.snakeCase(key);
            acc[snakeCaseKey] = convertToSnakeCase(obj[key]);

            return acc;
        }, {});
    }
    return obj;
};

export default convertToSnakeCase;