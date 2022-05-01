/**
 * data: array of arguments to func
 * func(...args, callback) - last argument must be function
 */
export const mapFunctionToData = (data, func, callback) => {
    console.log('555', data)

    const results = []

    let index = 0
    const iterate = () => {
        if (!data[index]) {
            return callback(results);
        }

        func(...data[index], (data = null) => {
            results.push(data)

            ++index
            iterate()
        })
    }

    iterate()
}