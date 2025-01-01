// Thumb Raiser - JPP 2021, 2022, 2023
// 3D modeling
// 3D models importing
// Perspective and orthographic projections
// Viewing
// Linear and affine transformations
// Lighting and materials
// Shadow projection
// Fog
// Texture mapping
// User interaction

import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import Orientation from "./orientation.js";
import { generalData, mazeData, playerData, lightsData, fogData, cameraData } from "./default_data.js";
import { merge } from "./merge.js";
import Maze from "./maze.js";
import Player from "./player.js";
import Lights from "./lights.js";
import Fog from "./fog.js";
import Camera from "./camera.js";
import Animations from "./animations.js";
import UserInterface from "./user_interface.js";

/*
 * generalParameters = {
 *  setDevicePixelRatio: Boolean
 * }
 *
 * mazeParameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3
 * }
 *
 * playerParameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3,
 *  walkingSpeed: Float,
 *  initialDirection: Float,
 *  turningSpeed: Float,
 *  runningFactor: Float,
 *  keyCodes: { fixedView: String, firstPersonView: String, thirdPersonView: String, topView: String, viewMode: String, userInterface: String, miniMap: String, help: String, statistics: String, run: String, left: String, right: String, backward: String, forward: String, jump: String, yes: String, no: String, wave: String, punch: String, thumbsUp: String }
 * }
 *
 * lightsParameters = {
 *  ambientLight: { color: Integer, intensity: Float },
 *  pointLight1: { color: Integer, intensity: Float, range: Float, position: Vector3 },
 *  pointLight2: { color: Integer, intensity: Float, range: Float, position: Vector3 },
 *  spotLight: { color: Integer, intensity: Float, range: Float, angle: Float, penumbra: Float, position: Vector3, direction: Float }
 * }
 *
 * fogParameters = {
 *  enabled: Boolean,
 *  color: Integer,
 *  near: Float,
 *  far: Float
 * }
 *
 * fixedViewCameraParameters = {
 *  view: String,
 *  multipleViewsViewport: Vector4,
 *  target: Vector3,
 *  initialOrientation: Orientation,
 *  orientationMin: Orientation,
 *  orientationMax: Orientation,
 *  initialDistance: Float,
 *  distanceMin: Float,
 *  distanceMax: Float,
 *  initialZoom: Float,
 *  zoomMin: Float,
 *  zoomMax: Float,
 *  initialFov: Float,
 *  near: Float,
 *  far: Float
 * }
 *
 * firstPersonViewCameraParameters = {
 *  view: String,
 *  multipleViewsViewport: Vector4,
 *  target: Vector3,
 *  initialOrientation: Orientation,
 *  orientationMin: Orientation,
 *  orientationMax: Orientation,
 *  initialDistance: Float,
 *  distanceMin: Float,
 *  distanceMax: Float,
 *  initialZoom: Float,
 *  zoomMin: Float,
 *  zoomMax: Float,
 *  initialFov: Float,
 *  near: Float,
 *  far: Float
 * }
 *
 * thirdPersonViewCameraParameters = {
 *  view: String,
 *  multipleViewsViewport: Vector4,
 *  target: Vector3,
 *  initialOrientation: Orientation,
 *  orientationMin: Orientation,
 *  orientationMax: Orientation,
 *  initialDistance: Float,
 *  distanceMin: Float,
 *  distanceMax: Float,
 *  initialZoom: Float,
 *  zoomMin: Float,
 *  zoomMax: Float,
 *  initialFov: Float,
 *  near: Float,
 *  far: Float
 * }
 *
 * topViewCameraParameters = {
 *  view: String,
 *  multipleViewsViewport: Vector4,
 *  target: Vector3,
 *  initialOrientation: Orientation,
 *  orientationMin: Orientation,
 *  orientationMax: Orientation,
 *  initialDistance: Float,
 *  distanceMin: Float,
 *  distanceMax: Float,
 *  initialZoom: Float,
 *  zoomMin: Float,
 *  zoomMax: Float,
 *  initialFov: Float,
 *  near: Float,
 *  far: Float
 * }
 *
 * miniMapCameraParameters = {
 *  view: String,
 *  multipleViewsViewport: Vector4,
 *  initialOrientation: Orientation,
 *  orientationMin: Orientation,
 *  orientationMax: Orientation,
 *  initialDistance: Float,
 *  distanceMin: Float,
 *  distanceMax: Float,
 *  initialZoom: Float,
 *  zoomMin: Float,
 *  zoomMax: Float,
 *  initialFov: Float,
 *  near: Float,
 *  far: Float
 * }
 */

export default class ThumbRaiser {
    constructor(generalParameters, mazeParameters, playerParameters, lightsParameters, fogParameters, fixedViewCameraParameters, firstPersonViewCameraParameters, thirdPersonViewCameraParameters, topViewCameraParameters, miniMapCameraParameters) {
        this.generalParameters = merge({}, generalData, generalParameters);
        this.mazeParameters = merge({}, mazeData, mazeParameters);
        this.playerParameters = merge({}, playerData, playerParameters);
        this.lightsParameters = merge({}, lightsData, lightsParameters);
        this.fogParameters = merge({}, fogData, fogParameters);
        this.fixedViewCameraParameters = merge({}, cameraData, fixedViewCameraParameters);
        this.firstPersonViewCameraParameters = merge({}, cameraData, firstPersonViewCameraParameters);
        this.thirdPersonViewCameraParameters = merge({}, cameraData, thirdPersonViewCameraParameters);
        this.topViewCameraParameters = merge({}, cameraData, topViewCameraParameters);
        this.miniMapCameraParameters = merge({}, cameraData, miniMapCameraParameters);

        // Create a 2D scene (the viewports frames)
        this.scene2D = new THREE.Scene();

        // Create a square
        let points = [new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 0.0, 0.0), new THREE.Vector3(1.0, 1.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0)];
        let geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        this.square = new THREE.LineLoop(geometry, material);
        this.scene2D.add(this.square);

        // Create the camera corresponding to the 2D scene
        this.camera2D = new THREE.OrthographicCamera(0.0, 1.0, 1.0, 0.0, 0.0, 1.0);

        // Create a 3D scene (the game itself)
        this.scene3D = new THREE.Scene();
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.highlightMaterial = new THREE.MeshStandardMaterial({
            color: 0xFF0000, // Any color
            opacity: 0,     // Fully transparent
            transparent: true
        });
        this.originalMaterials = new Map();

        // Create the maze
        this.maze = new Maze(this.mazeParameters);
        this.CurrentRoom = null;
        this.CorrectlyLoaded = false;
        this.selectedDate = null;
        this.roomDataCache = null;
        // Create the player
        this.player = new Player(this.playerParameters);

        // Create the lights
        this.lights = new Lights(this.lightsParameters);

        // Create the fog
        this.fog = new Fog(this.fogParameters);

        // Create the cameras corresponding to the four different views: fixed view, first-person view, third-person view and top view
        this.fixedViewCamera = new Camera(this.fixedViewCameraParameters, window.innerWidth, window.innerHeight);
        this.firstPersonViewCamera = new Camera(this.firstPersonViewCameraParameters, window.innerWidth, window.innerHeight);
        this.thirdPersonViewCamera = new Camera(this.thirdPersonViewCameraParameters, window.innerWidth, window.innerHeight);
        this.topViewCamera = new Camera(this.topViewCameraParameters, window.innerWidth, window.innerHeight);

        // Create the mini-map camera
        this.miniMapCamera = new Camera(this.miniMapCameraParameters, window.innerWidth, window.innerHeight);

        // Create the statistics and make its node invisible
        this.statistics = new Stats();
        this.statistics.dom.style.visibility = "hidden";
        document.body.appendChild(this.statistics.dom);

        // Create a renderer and turn on shadows in the renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true});
        if (this.generalParameters.setDevicePixelRatio) {
            this.renderer.setPixelRatio(window.devicePixelRatio);
        }
        this.renderer.autoClear = false;
        /* To-do #30 - Turn on shadows in the renderer and filter shadow maps using the Percentage-Closer Filtering (PCF) algorithm
        this.renderer.shadowMap.enabled = ...;
        this.renderer.shadowMap.type = ...; */
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Set the mouse move action (none)
        this.dragMiniMap = false;
        this.changeCameraDistance = false;
        this.changeCameraOrientation = false;

        // Set the game state
        this.gameRunning = false;

        // Get and configure the panel's <div> elements
        this.viewsPanel = document.getElementById("views-panel");
        this.view = document.getElementById("view");
        this.projection = document.getElementById("projection");
        this.horizontal = document.getElementById("horizontal");
        this.horizontal.step = 1;
        this.vertical = document.getElementById("vertical");
        this.vertical.step = 1;
        this.distance = document.getElementById("distance");
        this.distance.step = 0.1;
        this.zoom = document.getElementById("zoom");
        this.zoom.step = 0.1;
        this.reset = document.getElementById("reset");
        this.resetAll = document.getElementById("reset-all");
        this.helpPanel = document.getElementById("help-panel");
        this.helpPanel.style.visibility = "hidden";
        this.subwindowsPanel = document.getElementById("subwindows-panel");
        this.multipleViewsCheckBox = document.getElementById("multiple-views");
        this.multipleViewsCheckBox.checked = false;
        this.userInterfaceCheckBox = document.getElementById("user-interface");
        this.userInterfaceCheckBox.checked = true;
        this.miniMapCheckBox = document.getElementById("mini-map");
        this.miniMapCheckBox.checked = true;
        this.helpCheckBox = document.getElementById("help");
        this.helpCheckBox.checked = false;
        this.statisticsCheckBox = document.getElementById("statistics");
        this.statisticsCheckBox.checked = false;

        // Build the help panel
        this.buildHelpPanel();

        // Set the active view camera (fixed view)
        this.setActiveViewCamera(this.fixedViewCamera);

        // Arrange viewports by view mode
        this.arrangeViewports(this.multipleViewsCheckBox.checked);

        // Register the event handler to be called on window resize
        window.addEventListener("resize", event => this.windowResize(event));

        // Register the event handler to be called on key down

        // Register the event handler to be called on mouse down
        this.renderer.domElement.addEventListener("mousedown", event => this.mouseDown(event));

        // Register the event handler to be called on mouse move
        this.renderer.domElement.addEventListener("mousemove", event => this.mouseMove(event));

        // Register the event handler to be called on mouse up
        this.renderer.domElement.addEventListener("mouseup", event => this.mouseUp(event));

        // Register the event handler to be called on mouse wheel
        this.renderer.domElement.addEventListener("wheel", event => this.mouseWheel(event));

        // Register the event handler to be called on context menu
        this.renderer.domElement.addEventListener("contextmenu", event => this.contextMenu(event));

        // Register the event handler to be called on select, input number, or input checkbox change
        this.view.addEventListener("change", event => this.elementChange(event));
        this.projection.addEventListener("change", event => this.elementChange(event));
        this.horizontal.addEventListener("change", event => this.elementChange(event));
        this.vertical.addEventListener("change", event => this.elementChange(event));
        this.distance.addEventListener("change", event => this.elementChange(event));
        this.zoom.addEventListener("change", event => this.elementChange(event));
        this.multipleViewsCheckBox.addEventListener("change", event => this.elementChange(event));
        this.userInterfaceCheckBox.addEventListener("change", event => this.elementChange(event));
        this.helpCheckBox.addEventListener("change", event => this.elementChange(event));
        this.statisticsCheckBox.addEventListener("change", event => this.elementChange(event));

        // Register the event handler to be called on input button click
        this.reset.addEventListener("click", event => this.buttonClick(event));
        this.resetAll.addEventListener("click", event => this.buttonClick(event));

        this.activeElement = document.activeElement;

        /*this.activeViewCamera.perspective.position.set(this.maze.Lobby.x, this.activeViewCamera.perspective.position.y, this.maze.Lobby.z);
        this.activeViewCamera.target.x = this.maze.Lobby.x;
        this.activeViewCamera.target.z = this.maze.Lobby.z;*/
    }
    async fetchRoomData(index) {
        let x = this.roomDataCache ?? await this.maze.fetchRoomData();
        if(this.roomDataCache == null) this.roomDataCache = x;
        console.log("Fetch Room Data, in hospital ")
        console.log(x[index]);
        return x[index];
    }
    async fetchRoomStatus(id) {
        console.log(id);
        let date = this.selectedDate ?? new Date().toISOString();
        console.log(date);
        console.log(this.selectedDate);
        try {
            const response = await fetch('https://localhost:5001/api/SurgeryRooms/Availability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ id, date })
            });
            if (!response.ok) {
                console.log(response);
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('There was an error fetching the room number:', error);
        }
    }
    buildHelpPanel() {
        const table = document.getElementById("help-table");
        let i = 0;
        table.rows[i].cells[0].innerHTML = this.maze.credits + "<br>";
    }

    displayPanel() {
        this.view.options.selectedIndex = ["fixed", "first-person", "third-person", "top"].indexOf(this.activeViewCamera.view);
        this.projection.options.selectedIndex = ["perspective", "orthographic"].indexOf(this.activeViewCamera.projection);
        this.horizontal.value = this.activeViewCamera.orientation.h.toFixed(0);
        this.vertical.value = this.activeViewCamera.orientation.v.toFixed(0);
        this.distance.value = this.activeViewCamera.distance.toFixed(1);
        this.zoom.value = this.activeViewCamera.zoom.toFixed(1);
    }

    // Set active view camera
    setActiveViewCamera(camera) {
        this.activeViewCamera = camera;
        this.horizontal.min = this.activeViewCamera.orientationMin.h.toFixed(0);
        this.horizontal.max = this.activeViewCamera.orientationMax.h.toFixed(0);
        this.vertical.min = this.activeViewCamera.orientationMin.v.toFixed(0);
        this.vertical.max = this.activeViewCamera.orientationMax.v.toFixed(0);
        this.distance.min = this.activeViewCamera.distanceMin.toFixed(1);
        this.distance.max = this.activeViewCamera.distanceMax.toFixed(1);
        this.zoom.min = this.activeViewCamera.zoomMin.toFixed(1);
        this.zoom.max = this.activeViewCamera.zoomMax.toFixed(1);
        this.displayPanel();
    }

    arrangeViewports(multipleViews) {
        this.fixedViewCamera.setViewport(multipleViews);
        this.firstPersonViewCamera.setViewport(multipleViews);
        this.thirdPersonViewCamera.setViewport(multipleViews);
        this.topViewCamera.setViewport(multipleViews);
    }

    pointerIsOverViewport(pointer, viewport) {
        return (
            pointer.x >= viewport.x &&
            pointer.x < viewport.x + viewport.width &&
            pointer.y >= viewport.y &&
            pointer.y < viewport.y + viewport.height);
    }

    getPointedViewport(pointer) {
        let viewport;
        // Check if the pointer is over the mini-map camera viewport
        if (this.miniMapCheckBox.checked) {
            viewport = this.miniMapCamera.getViewport();
            if (this.pointerIsOverViewport(pointer, viewport)) {
                return this.miniMapCamera.view;
            }
        }
        // Check if the pointer is over the remaining camera viewports
        let cameras;
        if (this.multipleViewsCheckBox.checked) {
            cameras = [this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera];
        }
        else {
            cameras = [this.activeViewCamera];
        }
        for (const camera of cameras) {
            viewport = camera.getViewport();
            if (this.pointerIsOverViewport(pointer, viewport)) {
                return camera.view;
            }
        }
        // No camera viewport is being pointed
        return "none";
    }

    setViewMode(multipleViews) { // Single-view mode: false; multiple-views mode: true
        this.multipleViewsCheckBox.checked = false;
        this.arrangeViewports(this.multipleViewsCheckBox.checked);
    }

    setUserInterfaceVisibility(visible) {
        this.userInterfaceCheckBox.checked = false;
        this.viewsPanel.style.visibility = false ? "visible" : "hidden";
        this.subwindowsPanel.style.visibility = false ? "visible" : "hidden";
        this.userInterface.setVisibility(false);
    }

    setMiniMapVisibility(visible) { // Hidden: false; visible: true
        this.miniMapCheckBox.checked = false;
    }

    setHelpVisibility(visible) { // Hidden: false; visible: true
        this.helpCheckBox.checked = false;
        this.helpPanel.style.visibility = false ? "visible" : "hidden";
    }

    setStatisticsVisibility(visible) { // Hidden: false; visible: true
        this.statisticsCheckBox.checked = false;
        this.statistics.dom.style.visibility = false ? "visible" : "hidden";
    }

    windowResize() {
        this.fixedViewCamera.updateWindowSize(window.innerWidth, window.innerHeight);
        this.firstPersonViewCamera.updateWindowSize(window.innerWidth, window.innerHeight);
        this.thirdPersonViewCamera.updateWindowSize(window.innerWidth, window.innerHeight);
        this.topViewCamera.updateWindowSize(window.innerWidth, window.innerHeight);
        this.miniMapCamera.updateWindowSize(window.innerWidth, window.innerHeight);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    mouseDown(event) {
        if (event.buttons == 2) { // Only handle secondary (right) mouse button
            // Store current mouse position
            this.mousePosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
            // Select the camera whose view is being pointed
            const cameraView = this.getPointedViewport(this.mousePosition);
            if (cameraView != "none") {
                if (cameraView == "mini-map") { // Mini-map camera selected
                    this.dragMiniMap = true; // Enable dragging
                }
                else { // One of the remaining cameras selected
                    const cameraIndex = ["fixed", "first-person", "third-person", "top"].indexOf(cameraView);
                    this.view.options.selectedIndex = cameraIndex;
                    this.setActiveViewCamera([this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera][cameraIndex]);
                    this.changeCameraOrientation = true; // Only allow changing camera orientation for right click
                }
            }
        } else {

            const modalBounds = this.renderer.domElement.getBoundingClientRect();

            this.pointer.x = ((event.clientX - modalBounds.left) / modalBounds.width) * 2 - 1;
            this.pointer.y = -((event.clientY - modalBounds.top) / modalBounds.height) * 2 + 1;
            this.raycaster.setFromCamera(this.pointer, this.activeViewCamera.perspective);

            console.log("Pointer " + this.pointer);
            console.log("Raycaster " + this.raycaster);
            
            const intersects = this.raycaster.intersectObjects(this.maze.RoomArr, true);
            console.log("Intersects " + this.intersects);

            if (intersects.length > 0) {

                const intersectedObject = intersects[0].object;
        
                if (!this.originalMaterials.has(intersectedObject)) {
                    this.originalMaterials.set(intersectedObject, intersectedObject.material);
                }
        
                intersectedObject.material = this.highlightMaterial;
                intersectedObject.material.opacity = 0.5;
        
                setTimeout(() => {
                    if (this.originalMaterials.has(intersectedObject)) {
                        intersectedObject.material = this.originalMaterials.get(intersectedObject);
                        this.originalMaterials.delete(intersectedObject);
                    }
                }, 500); // Highlight for 500ms
                const intersectedIndex = this.maze.RoomArr.indexOf(intersectedObject);
                this.CurrentRoom = intersectedIndex;
                const modelPosition = this.maze.RoomArr[intersectedIndex].position;
                this.activeViewCamera.setTarget(new THREE.Vector3(modelPosition.x,0, modelPosition.z));
            }
        }
    }
    

    mouseMove(event) {
        if (event.buttons == 2) { // Only handle secondary button (right click)
            if (this.changeCameraOrientation || this.dragMiniMap) {
                const newMousePosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
                const mouseIncrement = newMousePosition.clone().sub(this.mousePosition);
                this.mousePosition = newMousePosition;
                if (this.changeCameraOrientation) {
                    this.activeViewCamera.updateOrientation(mouseIncrement.multiply(new THREE.Vector2(-0.5, 0.5)));
                    this.displayPanel();
                }
            }
        }
    }
    

    mouseUp(event) {
        // Reset mouse move action
        this.dragMiniMap = false;
        this.changeCameraDistance = false;
        this.changeCameraOrientation = false;
    }

    mouseWheel(event) {
        // Prevent the mouse wheel from scrolling the document's content
        event.preventDefault();
        // Store current mouse position in window coordinates (mouse coordinate system: origin in the top-left corner; window coordinate system: origin in the bottom-left corner)
        this.mousePosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
        // Select the camera whose view is being pointed
        const cameraView = this.getPointedViewport(this.mousePosition);
        if (cameraView != "none" && cameraView != "mini-map") { // One of the remaining cameras selected
            const cameraIndex = ["fixed", "first-person", "third-person", "top"].indexOf(cameraView);
            this.view.options.selectedIndex = cameraIndex;
            const activeViewCamera = [this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera][cameraIndex];
            activeViewCamera.updateZoom(-0.001 * event.deltaY);
            this.setActiveViewCamera(activeViewCamera);
        }
    }

    contextMenu(event) {
        // Prevent the context menu from appearing when the secondary mouse button is clicked
        event.preventDefault();
    }

    elementChange(event) {
        switch (event.target.id) {
            case "view":
                this.setActiveViewCamera([this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera][this.view.options.selectedIndex]);
                break;
            case "projection":
                this.activeViewCamera.setActiveProjection(["perspective", "orthographic"][this.projection.options.selectedIndex]);
                this.displayPanel();
                break;
            case "horizontal":
            case "vertical":
            case "distance":
            case "zoom":
                if (event.target.checkValidity()) {
                    switch (event.target.id) {
                        case "horizontal":
                        case "vertical":
                            this.activeViewCamera.setOrientation(new Orientation(this.horizontal.value, this.vertical.value));
                            break;
                        case "distance":
                            this.activeViewCamera.setDistance(this.distance.value);
                            break;
                        case "zoom":
                            this.activeViewCamera.setZoom(this.zoom.value);
                            break;
                    }
                }
                break;
            case "multiple-views":
                this.setViewMode(event.target.checked);
                break;
            case "user-interface":
                this.setUserInterfaceVisibility(event.target.checked);
                break;
            case "help":
                this.setHelpVisibility(event.target.checked);
                break;
            case "statistics":
                this.setStatisticsVisibility(event.target.checked);
                break;
        }
    }

    buttonClick(event) {
        switch (event.target.id) {
            case "reset":
                this.activeViewCamera.initialize();
                break;
            case "reset-all":
                this.fixedViewCamera.initialize();
                this.firstPersonViewCamera.initialize();
                this.thirdPersonViewCamera.initialize();
                this.topViewCamera.initialize();
                break;
        }
        this.displayPanel();
    }

    finalSequence() {
        /* To-do #43 - Trigger the final sequence
            1 - Disable the fog
            2 - Reconfigure the third-person view camera:
                - horizontal orientation: -180.0
                - vertical orientation: this.thirdPersonViewCamera.initialOrientation.v
                - distance: this.thirdPersonViewCamera.initialDistance
                - zoom factor: 2.0
            3 - Set it as the active view camera
            4 - Set single-view mode:
                - false: single-view
                - true: multiple-views
            5 - Set the final action:
                - action: "Dance"
                - duration: 0.2 seconds*/
                this.fog.enabled = false;
                // Reconfigure the third-person view camera
                this.thirdPersonViewCamera.setOrientation(new Orientation(180.0, this.thirdPersonViewCamera.initialOrientation.v));
                this.thirdPersonViewCamera.setDistance(this.thirdPersonViewCamera.initialDistance);
                this.thirdPersonViewCamera.setZoom(2.0);
                // Set it as the active view camera
                this.setActiveViewCamera(this.thirdPersonViewCamera);
                // Set single-view mode
                this.setViewMode(false);
                // Set the final action
                this.animations.fadeToAction("Dance", 0.2);
    }

    collision(position) {
        return 0;
    }

    async update() {
        if (!this.gameRunning) {
            if (this.maze.loaded) { // If all resources have been loaded
                if(this.CurrentRoom == null) {
                    this.CurrentRoom = 0;
                    const modelPosition = this.maze.RoomArr[0].position;
                    this.activeViewCamera.setTarget(new THREE.Vector3(modelPosition.x,0, modelPosition.z));
                }
                this.scene3D.add(this.maze.object);
                this.scene3D.add(this.lights.object);

                // Create the clock
                this.clock = new THREE.Clock();

                // Create model animations (states, emotes and expressions)
                this.animations = new Animations(this.player.object, this.player.animations);

                // Set the player's position and direction
                this.player.position = this.maze.initialPosition.clone();
                this.player.direction = this.maze.initialDirection;

                /* To-do #40 - Create the user interface
                    - parameters: this.scene3D, this.renderer, this.lights, this.fog, this.player.object, this.animations
                this.userInterface = new UserInterface(...); */
                this.userInterface = new UserInterface(this.scene3D, this.renderer, this.lights, this.fog, this.player.object);

                // Start the game
                this.gameRunning = true;
            }
        }
        else {
            if (this.maze.loaded) {
                if(!this.CorrectlyLoaded && (this.maze.BedArr.length==(this.maze.RoomArr.length-1) && this.maze.BedArr.length > 0)) {
                    this.CorrectlyLoaded = true;
                    console.log("CorrectlyLoaded is now: ", this.CorrectlyLoaded);
                    setTimeout(() => {
                        this.CorrectlyLoaded = false;
                        console.log("CorrectlyLoaded is now: ", this.CorrectlyLoaded);
                    }, 60000);
                    for (let index = 0; index < this.maze.BedArr.length; index++) {
                        const element = this.maze.BedArr[index];
                        let room = await this.fetchRoomData(index);
                        let status = await this.fetchRoomStatus(room.id);
                        if (status) {
                            element.visible = false;
                            console.log("Luigi is Died!");
                        } else {
                            element.visible = true;
                            console.log("Luigi is Live!");
                        }
                        console.log("Checked Room: " + room.roomNumber);
                    }
                }
            }
            // Update the model animations
            const deltaT = this.clock.getDelta();
            this.animations.update(deltaT);

            // Update the player
            if (!this.animations.actionInProgress) {
                // Check if the player found the exit
                if (this.maze.foundExit(this.player.position)) {
                    this.finalSequence();
                }
                else {
                    /* To-do #12 - Compute the distance covered by the player
                        - start by assuming that the player is walking:
                            covered distance = walking speed * elapsed time
                        - walking speed: this.player.walkingSpeed
                        - elapsed time: deltaT
                    let coveredDistance = ...; */
                    let coveredDistance = this.player.walkingSpeed * deltaT;
                    /* To-do #13 - Compute the player's direction increment
                        - assume that the player is turning left or right while walking:
                            direction increment = turning speed * elapsed time
                        - turning speed: this.player.turningSpeed
                        - elapsed time: deltaT
                    let directionIncrement = ...; */
                    let directionIncrement = this.player.turningSpeed * deltaT
                    if (this.player.keyStates.run) {
                        /* To-do #14 - Adjust the distance covered by the player
                            - now assume that the player is running:
                            - multiply the covered distance by this.player.runningFactor

                        ...; */
                        coveredDistance *= this.player.runningFactor;
                        /* To-do #15 - Adjust the player's direction increment
                            - now assume that the player is running:
                            - multiply the direction increment by this.player.runningFactor
                        ...; */
                        directionIncrement *= this.player.runningFactor;
                    }
                    /* To-do #16 - Check if the player is turning left or right and update the player direction accordingly by adding or subtracting the direction increment
                        - left key state: this.player.keyStates.left
                        - right key state: this.player.keyStates.right
                        - current direction: this.player.direction
                        - direction increment: directionIncrement

                    if (...) { // The player is turning left
                        ...;
                    }
                    else if (...) { // The player is turning right
                        ...;
                    } */
                    if (this.player.keyStates.left) { // The player is turning left
                        this.player.direction += directionIncrement;
                    }
                    else if (this.player.keyStates.right) { // The player is turning right
                        this.player.direction -= directionIncrement;
                    }
                    const direction = THREE.MathUtils.degToRad(this.player.direction);
                    /* To-do #17 - Check if the player is moving backward or forward and update the player position accordingly
                        - backward key state: this.player.keyStates.backward
                        - forward key state: this.player.keyStates.forward
                        - current position: this.player.position
                        - covered distance: coveredDistance
                        - current direction: direction (expressed in radians)

                        - use the parametric form of the circle equation to compute the player's new position:
                            x = r * sin(t) + x0
                            y = y0;
                            z = r * cos(t) + z0

                            where:
                            - (x, y, z) are the player's new coordinates
                            - (x0, y0, z0) are the player's current coordinates
                            - r is the distance covered by the player
                            - t is the player direction (expressed in radians)

                    */
                   if (this.player.keyStates.backward) { // The player is moving backward
                        const newPosition = new THREE.Vector3(-coveredDistance*Math.sin(direction), 0.0, -coveredDistance*Math.cos(direction)).add(this.player.position);
                        /* To-do #18 - If the player collided with a wall, then trigger the death action; else, trigger either the walking or the running action
                            - death action: "Death"
                            - walking action: "Walking"
                            - running action: "Running"
                            - duration: 0.2 seconds
                        */
                       console.log(direction);
                        if (this.collision(newPosition)) {
                            this.animations.fadeToAction("Death", 0.2);
                        }
                        else {
                            this.animations.fadeToAction(this.player.keyStates.run ? "Running":"Walking", 0.2);
                            this.player.position = newPosition;
                        }
                    } 
                    else if (this.player.keyStates.forward) { // The player is moving forward
                        const newPosition = new THREE.Vector3(coveredDistance*Math.sin(direction), 0.0, coveredDistance*Math.cos(direction)).add(this.player.position);
                        /* To-do #19 - If the player collided with a wall, then trigger the death action; else, trigger either the walking or the running action
                            - death action: "Death"
                            - walking action: "Walking"
                            - running action: "Running"
                            - duration: 0.2 seconds*/
                        if (this.collision(newPosition)) {
                            this.animations.fadeToAction("Death", 0.2);
                        }
                        else {
                            this.animations.fadeToAction(this.player.keyStates.run ? "Running":"Walking", 0.2);
                            this.player.position = newPosition;
                        }
                    } 
                    else 
                    /* To-do #20 - Check the player emotes
                        - jump key state: this.player.keyStates.jump
                        - jump emote: "Jump"
                        - yes key state: this.player.keyStates.yes
                        - yes emote: "Yes"
                        - no key state: this.player.keyStates.no
                        - no emote: "No"
                        - wave key state: this.player.keyStates.wave
                        - wave emote: "Wave"
                        - punch key state: this.player.keyStates.punch
                        - punch emote: "Punch"
                        - thumbs up key state: this.player.keyStates.thumbsUp
                        - thumbs up emote: "ThumbsUp"
                        - duration: 0.2 seconds*/
                    if (this.player.keyStates.jump) {
                        this.animations.fadeToAction("Jump", 0.2);
                    }
                    else if (this.player.keyStates.yes) {
                        this.animations.fadeToAction("Yes", 0.2);
                    }
                    else if (this.player.keyStates.no) {
                        this.animations.fadeToAction("No", 0.2);
                    }
                    else if (this.player.keyStates.wave) {
                        this.animations.fadeToAction("Wave", 0.2);
                    }
                    else if (this.player.keyStates.punch) {
                        this.animations.fadeToAction("Punch", 0.2);
                    }
                    else if (this.player.keyStates.thumbsUp) {
                        this.animations.fadeToAction("ThumbsUp", 0.2);
                    } 
                    /* To-do #21 - If the player is not moving nor emoting, then trigger the idle action
                        - idle ation: "Idle"
                        - duration: 0.6 or 0.2 seconds, depending whether the player is recovering from a death action (long recovery) or from some other action (short recovery)
                    */else {
                        this.animations.fadeToAction("Idle", this.animations.activeName != "Death" ? 0.2 : 0.6);
                    } 
                    /* To-do #22 - Set the player's new position and orientation
                        - new position: this.player.position
                        - new orientation:  direction - this.player.initialDirection
                    this.player.object...;
                    this.player.object...; */
                    this.player.object.position.set(this.player.position.x, this.player.position.y, this.player.position.z);
                    this.player.object.rotation.y = direction - this.player.initialDirection;
                }
            }

            // Update first-person, third-person and top view cameras parameters (player direction and target)
            this.firstPersonViewCamera.playerDirection = this.player.direction;
            this.thirdPersonViewCamera.playerDirection = this.player.direction;
            this.topViewCamera.playerDirection = this.player.direction;
            const target = new THREE.Vector3(this.player.position.x, this.player.position.y + this.player.eyeHeight, this.player.position.z);
            this.firstPersonViewCamera.setTarget(target);
            this.thirdPersonViewCamera.setTarget(target);
            this.topViewCamera.setTarget(target);

            // Update statistics
            this.statistics.update();

            // Render primary viewport(s)
            this.renderer.clear();

            /* To-do #39 - If the fog is enabled, then assign it to the scene; else, assign null
                - fog enabled: this.fog.enabled
                - fog: this.fog.object
            if (...) {
                this.scene3D... = ...;
            }
            else {
                this.scene3D... = ...;
            } */
                if (this.fog.enabled) {
                    this.scene3D.fog = this.fog.object;
                }
                else {
                    this.scene3D.fog = null;
                }
            let cameras;
            if (this.multipleViewsCheckBox.checked) {
                cameras = [this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera];
            }
            else {
                cameras = [this.activeViewCamera];
            }
            for (const camera of cameras) {
                this.player.object.visible = (camera != this.firstPersonViewCamera);
                const viewport = camera.getViewport();
                this.renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);
                this.renderer.render(this.scene3D, camera.object);
                this.renderer.clearDepth();
            }

            // Render secondary viewport (mini-map)
            if (this.miniMapCheckBox.checked) {
                this.scene3D.fog = null;
                this.player.object.visible = true;
                const viewport = this.miniMapCamera.getViewport();
                this.renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);
                this.renderer.render(this.scene2D, this.camera2D);
            }
        }
    }
}