
/**
 * @author [basil]
 * 
 */

import React, { useEffect, useRef, useState } from 'react';
import { ICircleDiv } from '../../interfaces/ICircleDiv';
import { Tooltip } from 'primereact/tooltip';
import { APP_CONSTANTS } from '../../common/AppConstants';

const CircleDiv: React.FC<ICircleDiv> = (props) => {

    return (
        <>
            <div id={props.id} data-pr-tooltip={props.isDraggable ? APP_CONSTANTS.MESSAGE.DRAG_DROP : APP_CONSTANTS.MESSAGE.NO_BASKET_ERROR}
                data-pr-position="right"
                data-pr-at="right+5 top"
                data-pr-my="left center-2" className='btn circle_div btn-primary' draggable={props.isDraggable} onDragStart={props.onDrag} >

            </div>
            <div>APPLE</div>
            <Tooltip target=".circle_div" />
        </>
    )
}

export default CircleDiv;