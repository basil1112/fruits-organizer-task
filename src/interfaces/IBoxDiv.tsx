/**
 * @author [basil]
 * 
 */

type OnDragFunctionType = (event: any) => any

export interface IBoxDiv {

    id: string;
    isDraggable: boolean;
    onDrag: OnDragFunctionType;


}