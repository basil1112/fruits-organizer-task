/**
 * @author [basil]
 * 
 */

import { Dialog } from "primereact/dialog";

interface DimensionPopUpProps {
    isRectDialogVisible: any,
    setRectDialogVisible: any,
    userWidth: any, setUserRectWidth: any, setUserRectHeight: any, validateDimension: any, userHeight: any
}

const DimensionPopUp: React.FC<DimensionPopUpProps> = ({ isRectDialogVisible, userWidth, userHeight, setUserRectWidth, setUserRectHeight, validateDimension, setRectDialogVisible }) => {

    return (
        <Dialog header="Box Dimensions" visible={isRectDialogVisible} style={{ width: '30vw' }} onHide={() => setRectDialogVisible(false)}>
            <div className='container'>
                <div className='row line_spacing'>
                    <table className="dimension">
                        <tbody>
                            <tr>
                                <td>
                                    <label>Width</label>
                                    <input type='number' className='form-control' value={userWidth} autoFocus={true} placeholder='Enter Box Width' onChange={(e) => { setUserRectWidth(e.target.value) }} />
                                </td>
                            </tr>
                            <tr>

                            </tr>
                            <tr>
                                <td>
                                    <label>Height</label>
                                    <input type='number' className='form-control' value={userHeight} placeholder='Enter Box Height' onChange={(e) => { setUserRectHeight(e.target.value) }} />
                                </td>
                            </tr>
                            <tr>
                                <td> <span className="text-warning"> * All values between 10 - 70</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='row line_spacing'>
                    <input type='button' className='btn btn-success' value="Add" onClick={() => { validateDimension() }} />
                </div>
            </div>
        </Dialog >
    );
}


export default DimensionPopUp;