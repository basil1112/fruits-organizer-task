
/**
 * @author [basil]
 *  APP_CONSTANTS :  constant object named `APP_CONSTANTS` which contains various
properties and their corresponding values.
 * 
 */


export const APP_CONSTANTS = {

    ENV: {
        PROD: true,
    },

    DIMENSION: {
        SIDEPANEL: 400,
        SCALE: 10,
        SEGEMENT: 32,
        RADIUS: 2.5
    },

    VALUE: {
        DIVISIBLE: 5,
        BOX_MIN: 10,
        BOX_MAX: 70,
    },

    COLOR: {
        RED_COLOR: 0xff0000,
        RED_HOVER_COLOR: 0xff4444,
        BLUE_COLOR: 0x3150ff,
        RENDER_COLOR: 0xe5e5e5
    },

    MESSAGE: {
        APP_TITLE: 'MindtraceAI Task',
        DIVISIBLE_ERROR: `Values must be divisible by 5`,
        VALUE_RANGE_ERROR: `Values must be between 10 and 70`,
        NO_BASKET_ERROR: `Atleast one basket is needed`,
        DRAG_DROP: 'Drag and Drop',
        BASKET_FULL: 'Basket full',
        BASKET_OVERLAPS: 'Basket overlaps not allowed'

    }
}


