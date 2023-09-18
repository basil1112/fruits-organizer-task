/**
 * @author [basil]
 * 
 */

import { APP_CONSTANTS } from "../../common/AppConstants";

const rectangleValueRange = {
    min: APP_CONSTANTS.VALUE.BOX_MIN,
    max: APP_CONSTANTS.VALUE.BOX_MAX
}

/**
 * 
 * @param width rectanle  width
 * @param height rectangle height
 * @returns promise with status and msg 
 */
export const processDimension = (width: number, height: number): Promise<object> => {

    return new Promise((resolve, reject) => {

        if (width % 5 == 0 && height % 5 == 0) {
            if (between(width, rectangleValueRange.min, rectangleValueRange.max) && between(height, rectangleValueRange.min, rectangleValueRange.max)) {
                resolve({
                    status: true,
                    msg: ""
                })
            }
            else {
                reject({
                    status: false,
                    msg: `${APP_CONSTANTS.MESSAGE.VALUE_RANGE_ERROR}`
                })
            }
        }
        else {
            reject({
                status: false,
                msg: `${APP_CONSTANTS.MESSAGE.DIVISIBLE_ERROR}`
            })
        }

    })

}

/**
 * 
 * 
 * @param x  input value to check between
 * @param min between min value
 * @param max  between max value 
 * @returns boolens
 */
export const between = (x: number, min: number, max: number): boolean => {
    return x >= min && x <= max;
}


