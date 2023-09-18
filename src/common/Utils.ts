
/**
 * @author [basil]
 * 
 */

import { IAppleProps } from "../interfaces/IAppleProps";
import { IBasketProps } from "../interfaces/IBasketProps";
import { APP_CONSTANTS } from "./AppConstants";


export const APPLE_PROPS: IAppleProps = {
    _appleColor: APP_CONSTANTS.COLOR.BLUE_COLOR,
    _appleRadius: APP_CONSTANTS.DIMENSION.RADIUS * APP_CONSTANTS.DIMENSION.SCALE,
    _appleSegment: APP_CONSTANTS.DIMENSION.SEGEMENT
}


export const BASKET_PROPS: IBasketProps = {
    _basketColor: APP_CONSTANTS.COLOR.RED_COLOR,
    _basketHoverColor: APP_CONSTANTS.COLOR.RED_HOVER_COLOR
}


/* 
The `export const _console` is a constant object that contains a `log` function.
fn check for env status and prints the log 
 */
export const _console = {
    log: (prod = false, msg: string, object?: any) => {
        if (!prod)
            console.log(msg, object);
    }
}



