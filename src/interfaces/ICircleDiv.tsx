
/**
 * @author [basil]
 * 
 */

type OnDragFunctionType = (event: any) => any

export interface ICircleDiv {

    id: string;
    isDraggable: boolean;
    onDrag: OnDragFunctionType;


}