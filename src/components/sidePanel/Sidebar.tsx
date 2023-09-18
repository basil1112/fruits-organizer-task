
/**
 * @author [basil]
 * Sidebar Component: Contains Apples and Baskets with sorting option.
 */


import BoxDiv from "../objects/BoxDiv"
import CircleDiv from "../objects/CircleDiv"
import { InputSwitch } from "primereact/inputswitch";
import { APP_CONSTANTS } from "../../common/AppConstants";


interface SidebarProps {
    sceneObject: THREE.Object3D[]
    drag: any,
    sortBasket: any
}

/**
 * The Sidebar component is a functional component in a TypeScript React application that renders a
 * sidebar with shapes and actions.
 * @param  - - `sceneObject`: An array of objects representing the scene.
 * @returns The Sidebar component is returning a JSX element, which is a div with a specific structure
 * and content.
 */
const Sidebar: React.FC<SidebarProps> = ({ sceneObject, drag, sortBasket }) => {


    return (
        <div className="border-end bg-white" id="sidebar-wrapper" style={{ width: '400px' }}>
            <div className="sidebar-heading border-bottom bg-light">{APP_CONSTANTS.MESSAGE.APP_TITLE}</div>
            <div className="list-group list-group-flush">

                <a className="list-group-item list-group-item-action list-group-item-light p-3" href="#!">Shapes</a>

                <div className='draggable'>

                    <div className='row mb-3'>
                        <div className='col-lg-6 col-sm-12 text-center'>
                            <BoxDiv id='basket' isDraggable={true} onDrag={(event) => { drag(event) }}></BoxDiv>
                        </div>
                        <div className='col-lg-6 col-sm-12 text-center justify-center'>
                            <CircleDiv id='circle' isDraggable={sceneObject.length > 0 ? true : false} onDrag={(event) => { drag(event) }}></CircleDiv>
                        </div>
                    </div>

                </div>

                <a className="list-group-item list-group-item-action list-group-item-light p-3" href="#!">Actions</a>

                <div className='row p-3'>
                    <button className='btn btn-md btn-warning' onClick={sortBasket}>Sort Basket</button>
                </div>

            </div>
        </div>)
}

export default Sidebar