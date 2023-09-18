/**
 * @author [basil]
 * 
 */

import React, { useEffect, useRef, useState } from 'react';
import { IBoxDiv } from '../../interfaces/IBoxDiv';
import { Tooltip } from 'primereact/tooltip';
import { APP_CONSTANTS } from '../../common/AppConstants';


const BoxDiv: React.FC<IBoxDiv> = (props) => {

    return (
        <>
            <div id={props.id}
                data-pr-tooltip={APP_CONSTANTS.MESSAGE.DRAG_DROP}
                data-pr-position="right"
                data-pr-at="right+5 top"
                data-pr-my="left center-2"
                className='btn box_div btn-danger' draggable={props.isDraggable} onDragStart={props.onDrag}>
            </div>
            <div>BASKET</div>
            <Tooltip target=".box_div" />
        </>
    )
}

export default BoxDiv;