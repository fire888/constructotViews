/**
 * data: array of arguments to func
 * func(...args, callback) - last argument must be function
 */
export const mapFunctionToData = (data, func, callback) => {

    let index = 0
    const iterate = () => {
        if (!data[index]) {
            return callback();
        }

        func(...data[index], () => {
            ++index
            iterate()
        })
    }

    iterate()
}