export const createClearDate = date => {
    const newDate = new Date(date);

    newDate.setMilliseconds(0);
    newDate.setSeconds(0);
    newDate.setMinutes(0);
    newDate.setHours(0);

    return newDate;
};

export const getDiffDays = (dateFirst, dateSecond) =>
    Math.ceil(dateSecond - dateFirst) / (1000 * 60 * 60 * 24);
