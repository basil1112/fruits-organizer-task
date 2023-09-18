/**
 * @author [basil]
 * 
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { APPLE_PROPS, BASKET_PROPS, _console } from '../../common/Utils';
import { IUserDropPoint } from '../../interfaces/IRectProps';
import { between, processDimension } from './MainHelper';
import * as TWEEN from '@tweenjs/tween.js';
import { RectangleMesh } from '../objects/RectangleMesh';
import { APP_CONSTANTS } from '../../common/AppConstants';
import { CircleMesh } from '../objects/CircleMesh';
import Sidebar from '../sidePanel/Sidebar';
import DimensionPopUp from '../common/DimensionPopUp';
import { Toast } from 'primereact/toast';




const MainHome: React.FC = () => {

    //state
    const [isProd, setIsProd] = useState<boolean>(APP_CONSTANTS.ENV.PROD);
    const [sceneObjects, setSceneObjects] = useState<THREE.Object3D[]>([]);
    const [camera, setCamera] = useState<THREE.Camera | null>(null);
    const [hoveredBox, setHoveredBox] = useState<THREE.Object3D | null>(null);
    const [userWidth, setUserRectWidth] = useState('');
    const [userHeight, setUserRectHeight] = useState('');
    const [userDropPoints, setUserDropPoints] = useState<IUserDropPoint>({ userDropRectX: 0, userDropRectY: 0 });
    const [isRectDialogVisible, setRectDialogVisible] = useState(false);
    //refs
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const toast = useRef<Toast>(null);



    /** USE EFFECT
     *  
     */
    useEffect(() => {
        // Initialize the Three.js scene when the component mounts
        sceneRef.current = new THREE.Scene();
        // Create a Three.js WebGLRenderer
        const renderer = new THREE.WebGLRenderer();
        var w = window.innerWidth - 400;
        var h = window.innerHeight - 50;
        renderer.setSize(w, h);
        renderer.setClearColor(APP_CONSTANTS.COLOR.RENDER_COLOR);

        var viewSize = h;
        var aspectRatio = w / h;

        var _viewport = {
            viewSize: viewSize,
            aspectRatio: aspectRatio,
            left: (-aspectRatio * viewSize) / 2,
            right: (aspectRatio * viewSize) / 2,
            top: viewSize / 2,
            bottom: -viewSize / 2,
            near: -100,
            far: 100
        }

        rendererRef.current = renderer;

        // Append the renderer's DOM element to the component's div
        if (divRef.current) {
            divRef.current.appendChild(renderer.domElement);
        }


        let camera = new THREE.OrthographicCamera(
            _viewport.left,
            _viewport.right,
            _viewport.top,
            _viewport.bottom,
            _viewport.near,
            _viewport.far
        );


        //camera.position.z = 5;
        setCamera(camera);
        let cameraHelper: undefined | THREE.CameraHelper = undefined;
        if (!isProd) {
            cameraHelper = new THREE.CameraHelper(camera);
            sceneRef.current.add(cameraHelper);
        }


        // Render loop
        const animate = () => {
            TWEEN.update();
            requestAnimationFrame(animate);
            if (cameraHelper)
                cameraHelper.update();
            // Render the scene with the camera
            if (rendererRef.current && sceneRef.current && camera) {
                rendererRef.current.render(sceneRef.current, camera);
                camera.updateProjectionMatrix();
            }

        };
        animate();

    }, []);



    /**
     * event trigger when user drops a shape to canvas
     * @param event 
     */
    const droppingShapes = (event: any) => {

        const x = event.clientX; //dropping x coordinate
        const y = event.clientY; //dropping y coordinate

        _console.log(isProd, `drop x ${x} y ${y}`);

        if (event.dataTransfer?.getData('text') == "circle") {

            let oldHover = hoveredBox as THREE.Mesh;
            const material = new THREE.MeshBasicMaterial({ color: BASKET_PROPS._basketColor });
            oldHover.material = material

            let tableBorderValue = divRef.current?.getBoundingClientRect();
            let placingX = event.clientX - tableBorderValue!.x;
            let placingY = event.clientY - tableBorderValue!.y;
            let canvasPoints = getCanvasPointsFromMousePoint(x, y);

            //normalised coordinates : values between -1 & 1
            let normX = ((placingX / (window.innerWidth - 400)) * 2) - 1;
            let normY = (-1 * (placingY / (window.innerHeight - 50)) * 2) + 1;

            let rayCaster = new THREE.Raycaster();
            rayCaster.setFromCamera(new THREE.Vector2(normX, normY), camera!)

            let intersectingData = rayCaster.intersectObjects(sceneObjects);
            if (intersectingData.length > 0) {
                let selectedRect = intersectingData[0]
                _console.log(isProd, "selected rect", selectedRect);
                let z = selectedRect.object;
                addCircle(z);
            }

        } else {
            setUserDropPoints({
                userDropRectX: x,
                userDropRectY: y
            })
            setRectDialogVisible(true);
        }
    }

    /**
     * 
     * @param boxWidth width of newly creating rectangle
     * @param boxHeight hieght of newly creating rectangle
     * @param canvasPointX canvas dropping point with respective of canvas origin
     * @param canvasPointY canvas dropping points with respective of canvas origin
     * @returns boolean true if overlaps / false
     */
    const isOverlappingAnyBox = (boxWidth: number, boxHeight: number, canvasPointX: number, canvasPointY: number): boolean => {
        // New rectangle
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, 0.1);
        const material = new THREE.MeshBasicMaterial({ color: BASKET_PROPS._basketColor });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = canvasPointX;
        mesh.position.y = canvasPointY;
        mesh.position.z = 0;

        const addingBasket = new THREE.Box3();
        addingBasket.setFromObject(mesh);
        //loops through all boxes 
        for (const [index, element] of Object.entries(sceneObjects)) {
            // Existing rectangle 
            const boundingBox = new THREE.Box3();
            boundingBox.setFromObject(element);
            //checking intersects
            if (boundingBox.intersectsBox(addingBasket)) {
                return true; //overlaps
            }
        }
        return false;
    }


    /**
     * Methods return whether Box can add more apples 
     * @param selectedRect Box rectangle to check
     * @returns custom object {status: boolean,data: {'maxRowCapacity': value,maxColumCapacity': value}}
     */
    const canAddApple = (selectedRect: THREE.Object3D) => {

        let _applesInBox = selectedRect.children.length;
        let maxRowCapacity = selectedRect.userData._width / (APPLE_PROPS._appleRadius * 2);
        let maxColumCapacity = selectedRect.userData._height / (APPLE_PROPS._appleRadius * 2);

        if (_applesInBox > 0) {

            return {
                status: (_applesInBox < (maxRowCapacity * maxColumCapacity)),
                data: {
                    'maxRowCapacity': maxRowCapacity,
                    'maxColumCapacity': maxColumCapacity
                }
            }
        }
        else {

            return {
                status: true,
                data: {
                    'maxRowCapacity': maxRowCapacity,
                    'maxColumCapacity': maxColumCapacity
                }
            }
        }
    }

    /**
     * Methods draws circle in the selected box|rectangle 
     * filling from top left corner
     * @param selectedRect | input rectanlge to add apples 
     */
    const addCircle = (selectedRect: THREE.Object3D) => {

        if (sceneObjects.length > 0) {

            let applesInBox = selectedRect.children.length;
            let spaceAvailableData = canAddApple(selectedRect);

            if (spaceAvailableData.status) {
                //add to basket
                let maxRowCapacity = spaceAvailableData.data!['maxRowCapacity'];
                let maxColumCapacity = spaceAvailableData.data!['maxColumCapacity'];

                let columIndex = Math.floor((applesInBox / maxRowCapacity));
                let offsetY = columIndex * (APPLE_PROPS._appleRadius * 2);
                let rowIndex = (applesInBox % maxRowCapacity)
                _console.log(isProd, "rowIndex", rowIndex);
                let offsetX = rowIndex * (APPLE_PROPS._appleRadius * 2);

                const circle = new CircleMesh(APPLE_PROPS._appleRadius, APPLE_PROPS._appleColor);
                circle.userData = {
                    _radius: APPLE_PROPS._appleRadius
                }

                //top corner of the reactangle
                let rectTopX = -1 * (selectedRect.userData._width / 2);
                let rectTopY = (selectedRect.userData._height / 2);

                let circlePlacingX = rectTopX + APPLE_PROPS._appleRadius + offsetX;
                let circlePlacingY = rectTopY - APPLE_PROPS._appleRadius - offsetY;
                circle.position.set(circlePlacingX, circlePlacingY, 0.2);

                //adding circle as children to dropped box
                selectedRect.add(circle);

            }
            else {
                //basket is full
                //alert("basket Full")
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'BASKET FULL', life: 3000 });
            }
        }

    }


    /**
     * find the origin points of canvas
     * @returns custom object {'canvasOriginX': value,'canvasOriginY': value}
     */
    const getCanvasOrigin = () => {

        var w = window.innerWidth - 400;
        var h = window.innerHeight - 50;

        let canvasOriginX = -1 * w / 2;
        let canvasOriginY = h / 2;

        return {
            'canvasOriginX': canvasOriginX,
            'canvasOriginY': canvasOriginY
        }

    }


    /**
     * methods find the canvas points of mouse points 
     * with respect to canvas origin points
     * @param x mouse point x
     * @param y mouse point y
     * @returns custom object {"canvasPointX": value,"canvasPointY": value}
     */
    const getCanvasPointsFromMousePoint = (x: any, y: any) => {
        let tableBorderValue = divRef.current?.getBoundingClientRect();
        let placingX = x - tableBorderValue!.x;
        let placingY = y - tableBorderValue!.y;

        _console.log(isProd, "placingX", placingX);
        _console.log(isProd, "placingY", placingY);

        let canvasOrigin = getCanvasOrigin();
        let canvasOriginX = canvasOrigin.canvasOriginX;
        let canvasOriginY = canvasOrigin.canvasOriginY;

        _console.log(isProd, "OriginX", canvasOriginX);
        _console.log(isProd, "OriginY", canvasOriginY);

        return {
            "canvasPointX": canvasOriginX + placingX,
            "canvasPointY": canvasOriginY - placingY
        }

    }

    /**
     * methods draw rectangle using THREE GEOMETRY 
     * @param userDroppingX Mouse pointer X where user want to draw box
     * @param userDroppingY Mouse pointer Y Where user wants to draw box
     */
    const createRectangle = (userDroppingX: any, userDroppingY: any) => {

        if (sceneRef.current) {

            let rectWidth = Number(userWidth) * APP_CONSTANTS.DIMENSION.SCALE;
            let rectHeight = Number(userHeight) * APP_CONSTANTS.DIMENSION.SCALE;

            let canvasPoints = getCanvasPointsFromMousePoint(userDroppingX, userDroppingY);
            let canvasOrigin = getCanvasOrigin();
            let color = BASKET_PROPS._basketColor;

            //overlap check 
            if (isOverlappingAnyBox(rectWidth, rectHeight, canvasPoints.canvasPointX, canvasPoints.canvasPointY)) {

                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Overlapping not allowed', life: 3000 });
                return;
            }

            let newPositionToMove = new THREE.Vector2(canvasPoints.canvasPointX, canvasPoints.canvasPointY);

            if ((canvasPoints.canvasPointX - (rectWidth / 2)) < canvasOrigin.canvasOriginX) {
                newPositionToMove.setX(canvasOrigin.canvasOriginX + (rectWidth / 2));
            }
            if ((canvasPoints.canvasPointY + (rectHeight / 2)) > canvasOrigin.canvasOriginY) {
                newPositionToMove.setY(canvasOrigin.canvasOriginY - (rectHeight / 2));
            }
            if ((canvasPoints.canvasPointX + (rectWidth / 2)) > (canvasOrigin.canvasOriginX + (window.innerWidth - 400))) {
                newPositionToMove.setX(canvasOrigin.canvasOriginX + (window.innerWidth - 400) - (rectWidth / 2));
            }
            if (canvasPoints.canvasPointY - (rectHeight / 2) < (canvasOrigin.canvasOriginY - (window.innerHeight - 50))) {

                newPositionToMove.setY((canvasOrigin.canvasOriginY - (window.innerHeight - 50)) + (rectHeight / 2));
            }


            let mesh = new RectangleMesh(rectWidth, rectHeight, color);
            mesh.userData = {
                _width: rectWidth,
                _height: rectHeight
            }

            mesh.position.x = canvasPoints.canvasPointX
            mesh.position.y = canvasPoints.canvasPointY
            _console.log(isProd, "Rect Position X", mesh.position.x);
            _console.log(isProd, "React Position Y", mesh.position.y);

            sceneRef.current.add(mesh);

            const tween = new TWEEN.Tween(mesh.position)
                .to(newPositionToMove, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {

                    let rectPosition = new THREE.Vector3();
                    rectPosition.x = mesh.position.x;
                    rectPosition.y = mesh.position.y;
                    rectPosition.z = 0;
                    // Update the position of your object during the animation
                    mesh.position.copy(rectPosition);
                })
                .onComplete(() => {
                    _console.log(isProd, "Complete");
                    setSceneObjects(prevState => [...prevState, mesh]);
                })
                .start();

        }
    };




    /**
     * event listener fn 
     * @param ev mouse event
     */
    const drag = (ev: any) => {

        ev.dataTransfer.setData("text", ev.target.id);
    }

    /**
     * 
     * @param event 
     */
    const allowDrop = (event: any) => {
        highlighterEvent(event);
        event.preventDefault();
    }



    /**
     * sort based on apples [childrens] count in box
     * method uses comparator to sort 
     */
    const sortBasket = () => {

        let sortedScenObjects = sceneObjects.sort((obj1: THREE.Object3D, obj2: THREE.Object3D) => {

            return obj2.children.length - obj1.children.length
        })
        reDrawAfterSort(sortedScenObjects);

    }

    /**
     *  method find new target position of each box 
     * animate to target position using TWEEN
     * @param scenObjects sorted Scene Object Input
     */
    const reDrawAfterSort = (scenObjects: THREE.Object3D[]) => {

        let targetLocationArray = getSortingTargetLocations(scenObjects);

        Object.entries(scenObjects).forEach(([index, element]) => {
            let targetLocation = targetLocationArray[Number(index)]
            const targetPosition = { x: targetLocation.x, y: targetLocation.y, z: targetLocation.z }; // Define the target position
            const startPosition = { ...element.position };

            const tween = new TWEEN.Tween(startPosition)
                .to(targetPosition, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    let rectPosition = new THREE.Vector3();
                    rectPosition.x = startPosition.x;
                    rectPosition.y = startPosition.y;
                    rectPosition.z = 0;
                    // Update the position of your object during the animation
                    element.position.copy(rectPosition);
                })
                .onComplete(() => {
                    _console.log(isProd, "Complete");
                    setSceneObjects(scenObjects);
                })
                .start();

        });
    }

    /**
     * methods find new positions for each sorted boxes
     * @param sortedSceneObjects sorted Boxes list
     * @returns Vector3 Array with new points of all boxes
     */
    const getSortingTargetLocations = (sortedSceneObjects: THREE.Object3D[]): THREE.Vector3[] => {

        let targetLocations: THREE.Vector3[] = [];

        let canvasWidth = divRef.current!.clientWidth;

        let canvasOrigin = getCanvasOrigin();
        let canvasOriginX = canvasOrigin.canvasOriginX;
        let canvasOriginY = canvasOrigin.canvasOriginY;

        let positionX = 0;
        let positionY = 0;
        let maxHeightPerRow = 0;

        Object.entries(sortedSceneObjects).forEach(([index, element]) => {

            let slightMargin = 10;
            let newLocation = new THREE.Vector3();

            if ((positionX + element.userData._width) <= canvasWidth) {

                newLocation.x = canvasOriginX + positionX + (element.userData._width / 2) + slightMargin;
                positionX = positionX + (element.userData._width) + slightMargin;
                maxHeightPerRow = (maxHeightPerRow < element.userData._height) ? element.userData._height : maxHeightPerRow;
                newLocation.y = canvasOriginY - positionY - (element.userData._height / 2) - slightMargin;
            }
            else {
                positionX = 0;
                positionY = positionY + maxHeightPerRow + slightMargin;
                maxHeightPerRow = 0; //reseting for new row
                newLocation.x = canvasOriginX + positionX + (element.userData._width / 2) + slightMargin;
                newLocation.y = canvasOriginY - positionY - (element.userData._height / 2) - slightMargin;
                positionX = positionX + (element.userData._width) + slightMargin

            }

            targetLocations.push(newLocation);
        })

        return targetLocations;

    }

    /**
     * validation method 
     * validates user entered width and height
     */
    const validateDimension = () => {

        processDimension(Number(userWidth), Number(userHeight)).then((response) => {

            setRectDialogVisible(false);
            createRectangle(userDropPoints.userDropRectX, userDropPoints.userDropRectY);
            setUserRectWidth("");
            setUserRectHeight("");

        }).catch((error) => {

            setUserRectWidth('0');
            setUserRectHeight('0')
            let errorMsg = error.msg ? error.msg : error
            toast.current?.show({ severity: 'error', summary: 'Error', detail: `${errorMsg}`, life: 3000 });

        })
    }

    /**
     * 
     * @param event mouse hover effect on dropping circle
     */

    const highlighterEvent = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

        let tableBorderValue = divRef.current?.getBoundingClientRect();
        let placingX = event.clientX - tableBorderValue!.x;
        let placingY = event.clientY - tableBorderValue!.y;

        //normalised coordinates : values between -1 & 1
        let normX = ((placingX / (window.innerWidth - 400)) * 2) - 1;
        let normY = (-1 * (placingY / (window.innerHeight - 50)) * 2) + 1;

        _console.log(isProd, "mouse event", event);

        _console.log(isProd, "camera", camera);

        if (camera) {
            let rayCaster = new THREE.Raycaster();
            rayCaster.setFromCamera(new THREE.Vector2(normX, normY), camera!)

            /*  let rectangles = sceneObjects.filter((obj) => obj instanceof THREE.BoxGeometry); */
            let intersectingData = rayCaster.intersectObjects(sceneObjects);
            if (intersectingData.length > 0) {
                let rectangles = intersectingData.filter((obj) => (obj.object as THREE.Mesh).geometry instanceof THREE.BoxGeometry);
                if (rectangles.length > 0) {
                    let selRec = rectangles[0]
                    let zzzz = selRec.object as THREE.Mesh
                    const material = new THREE.MeshBasicMaterial({ color: BASKET_PROPS._basketHoverColor });
                    zzzz.material = material;
                    setHoveredBox(selRec.object);
                    _console.log(isProd, "hover.....");
                }
            }
            else {
                if (hoveredBox) {
                    let oldHover = hoveredBox as THREE.Mesh;
                    const material = new THREE.MeshBasicMaterial({ color: BASKET_PROPS._basketColor });
                    oldHover.material = material
                }
            }
        }
        else {
            _console.log(isProd, "no camera");
        }
    }



    return (
        <div className="d-flex" id="wrapper">

            <Toast ref={toast} />

            {/* Sidebar*/}

            <Sidebar
                sceneObject={sceneObjects}
                drag={drag}
                sortBasket={sortBasket} />

            {/* Page content wrapper*/}
            <div id="page-content-wrapper">
                <div className="container-fluid">

                    <div ref={divRef} style={{ marginTop: "10px" }} onDrop={(event) => droppingShapes(event)} onDragOver={(event) => allowDrop(event)}></div>
                    <DimensionPopUp
                        isRectDialogVisible={isRectDialogVisible}
                        userWidth={userWidth}
                        userHeight={userHeight}
                        validateDimension={validateDimension}
                        setUserRectWidth={setUserRectWidth}
                        setUserRectHeight={setUserRectHeight}
                        setRectDialogVisible={setRectDialogVisible} />

                </div >
            </div >
        </div >
    );
};

export default MainHome;
