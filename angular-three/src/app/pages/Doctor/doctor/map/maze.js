import * as THREE from "three";
import Ground from "./ground.js";
import Wall from "./wall.js";
import Decor from "./door.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/*
 * parameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3
 * }
 */

export default class Maze {
    constructor(parameters) {
        const modelLoader = new GLTFLoader();
        this.onLoad = async function (description) {
            this.map = description.map;
            this.size = description.size;

            this.initialPosition = this.cellToCartesian(description.initialPosition);
            this.initialDirection = description.initialDirection;

            this.exitLocation = this.cellToCartesian(description.exitLocation);

            this.object = new THREE.Group();
            this.RoomArr = [];
            this.RoomArrCoord = [];
            this.Lobby = null;

            let roomData = await this.fetchRoomNum(description); 
            let roomNum = roomData?roomData.length:description.room_number;

            
            let rooms_temp = this.createMatrix(description.map, roomNum, description.rooms_per_row);
            let rooms_temp2 = [];
            let rooms = [];
            for (let i = 0; i<rooms_temp.length; i++) {
                const mergedMatrix = this.mergeMatrices(rooms_temp[i]);
                rooms_temp2.push(mergedMatrix);
            }
            for (let i = 0; i<rooms_temp2.length; i++) {
                for (let j = 0; j<rooms_temp2[0].length; j++) {
                    rooms.push(rooms_temp2[i][j]);
                }
            }
            let h = rooms[0].length-1 - description.lobby[0].length;
            for(let i = 0; i<description.lobby.length; i++){
                let temp = [];
                for (let j = 0; j< description.lobby[0].length; j++) temp.push(description.lobby[i][j]);
                for (let j = 0; j<=h; j++) temp.push(0);
                rooms.push(temp);
            }
            for (let i = 0; i<rooms.length; i++) {
                if (i==0) {
                    for(let j = 0; j<rooms[0].length; j++) {
                        if (rooms[i][j] == 1) rooms[i][j] = 3;
                        if (rooms[i][j] == 0) rooms[i][j] = 2;
                    }
                }
                if(rooms[i][0] == 0) rooms[i][0] = 1;
                if(rooms[i][0] == 2) rooms[i][0] = 3;
                if(rooms[i][rooms[0].length-1] == 0) rooms[i][rooms[0].length-1] = 1;
                if(rooms[i][rooms[0].length-1] == 2) rooms[i][rooms[0].length-1] = 1;
                if (i==rooms.length-1) {
                    for(let j = 0; j<rooms[0].length; j++) {
                        if (rooms[i][j] == 1) rooms[i][j] = 2;
                        if (rooms[i][j] == 0) rooms[i][j] = 2;
                    }
                    rooms[i][rooms[0].length-1] = 0;
                }
            }
            /*for (let i = 0; i<rooms.length; i++) {
                if (i==0 || i==(rooms.length-1)){
                    for(let j = 0; j<rooms[0].length; j++) {
                        if (rooms[i][j] == 3) rooms[i][j] = 11;
                        if (rooms[i][j] == 2) rooms[i][j] = 10;
                        if (rooms[i][j] == 1) rooms[i][j] = 9;
                    }
                }
                if(rooms[i][0] == 1) rooms[i][0] = 9;
                if(rooms[i][rooms[0].length-1] == 1) rooms[i][rooms[0].length-1] = 9;
                if(rooms[i][0] == 3) rooms[i][0] = 11;
            }*/
            console.log(rooms);
            let actual_width = rooms[0].length -1;
            let actual_height = rooms.length -1;
            console.log(actual_width);

            this.ground = new Ground({ textureUrl: description.groundTextureUrl, width: actual_width, height: actual_height });
            this.object.add(this.ground.object);

            this.wall = new Wall({ textureUrl: description.wallTextureUrl });
            this.walldow = new Wall({ textureUrl: description.windowWallTextureUrl });
            let wallObject;
            let doorObject;
            for (let i = 0; i <= actual_width; i++) { 
                for (let j = 0; j <= actual_height; j++) {
                    if (rooms[j][i] == 2 || rooms[j][i] == 3) {
                        wallObject = this.wall.object.clone();
                        wallObject.position.set(i - actual_width/2.0 + 0.5, 0, j - actual_height/2.0);
                        this.object.add(wallObject);
                    }
                    if (rooms[j][i] == 1 || rooms[j][i] == 3) {
                        wallObject = this.wall.object.clone();
                        wallObject.rotateY(Math.PI/2);
                        wallObject.position.set(i - actual_width/2.0, 0, j - actual_height/2 + 0.5);
                        this.object.add(wallObject);
                    }
                    if (rooms[j][i] == 10 || rooms[j][i] == 11) {
                        wallObject = this.walldow.object.clone();
                        wallObject.position.set(i - actual_width/2.0 + 0.5, 0, j - actual_height/2.0);
                        this.object.add(wallObject);
                    }
                    if (rooms[j][i] == 9 || rooms[j][i] == 11) {
                        wallObject = this.walldow.object.clone();
                        wallObject.rotateY(Math.PI/2);
                        wallObject.position.set(i - actual_width/2.0, 0, j - actual_height/2 + 0.5);
                        this.object.add(wallObject);
                    }
                    if(rooms[j][i] == 4) {
                        const door = new Decor({ url: 'assets/models/gltf/double_doors.glb', scale: new THREE.Vector3(0.0033, 0.00725, 0.003) }, (doorObject) => {
                            doorObject.position.set(i - actual_width / 2.0, 0, j - actual_height / 2 + 0.5);
                            doorObject.rotateY(Math.PI/2);
                            this.object.add(doorObject); // Add to the scene

                           
                        });
                    }
                    if(rooms[j][i] == 5) {
                        const door = new Decor({ url: 'assets/models/gltf/double_doors.glb', scale: new THREE.Vector3(0.0033, 0.00725, 0.003) }, (doorObject) => {
                            doorObject.position.set(i - actual_width / 2.0 + 0.5, 0, j - actual_height / 2);
                            this.object.add(doorObject); // Add to the scene

                           
                        });
                    }
                    if(rooms[j][i] == 6) {
                        if (roomData[0].status == "AVAILABLE") {
                            const door = new Decor({ url: 'assets/models/gltf/hospital_table.glb', scale: new THREE.Vector3(0.75, 0.75, 0.75) }, (doorObject) => {
                                doorObject.position.set(i - actual_width / 2.0, 0, j - actual_height / 2 + 0.5);
                                doorObject.rotateY(Math.PI/2);
                                this.object.add(doorObject); // Add to the scene

                                const geometryc = new THREE.BoxGeometry(3.8, 3.8, 4.8);
                                const materialc = new THREE.MeshBasicMaterial({
                                    color: 0xFF00FF, // Any color
                                    opacity: 0,     // Fully transparent
                                    transparent: true
                                });
                                
                                const cube = new THREE.Mesh(geometryc, materialc);
                                cube.position.set(i - actual_width / 2.0, 1.8, j - actual_height / 2 + 0.5);
                                this.object.add(cube); // Add to the scene
                                this.RoomArr.push(cube);
                                this.RoomArrCoord.push(cube.position);

                               /* const doorLight = new THREE.PointLight(0xFFFFFF, 1, 10); 
                                doorLight.position.set(
                                    doorObject.position.x,
                                    doorObject.position.y + 5, 
                                    doorObject.position.z
                                );
                                doorLight.castShadow = true; 
                                this.object.add(doorLight); */
                            });
                        }
                        else {
                            const door = new Decor({ url: 'assets/models/gltf/hospital_table_occupied.glb', scale: new THREE.Vector3(0.75, 0.75, 0.75) }, (doorObject) => {
                                doorObject.position.set(i - actual_width / 2.0, 0, j - actual_height / 2 + 0.5);
                                doorObject.rotateY(Math.PI/2);
                                this.object.add(doorObject); // Add to the scene

                                const geometryc = new THREE.BoxGeometry(3.8, 3.8, 4.8);
                                const materialc = new THREE.MeshBasicMaterial({
                                    color: 0xFF00FF, // Any color
                                    opacity: 0,     // Fully transparent
                                    transparent: true
                                });
                                
                                const cube = new THREE.Mesh(geometryc, materialc);
                                cube.position.set(i - actual_width / 2.0, 1.8, j - actual_height / 2 + 0.5);
                                this.object.add(cube); // Add to the scene
                                this.RoomArr.push(cube);
                                this.RoomArrCoord.push(cube.position);

                               /*const doorLight = new THREE.PointLight(0xFFFFFF, 1, 10); 
                                doorLight.position.set(
                                    doorObject.position.x,
                                    doorObject.position.y + 5, 
                                    doorObject.position.z
                                );
                                doorLight.castShadow = true; 
                                this.object.add(doorLight); */
                            });
                        }
                        roomData.shift();
                    }
                    if(rooms[j][i] == 7) {
                        const door = new Decor({ url: 'assets/models/gltf/lobby.glb', scale: new THREE.Vector3(0.5, 1, 0.5) }, (doorObject) => {
                            doorObject.position.set(i - actual_width / 2.0, 0, j - actual_height / 2 + 0.5);
                            doorObject.rotateY(Math.PI);
                            this.object.add(doorObject); // Add to the scene
                        });
                    }
                    if(rooms[j][i] == 8) {
                        wallObject = this.wall.object.clone();
                        wallObject.position.set(i - actual_width/2.0 + 0.5, 0, j - actual_height/2.0);
                        this.object.add(wallObject);
                        const door = new Decor({ url: 'assets/models/gltf/lobby.glb', scale: new THREE.Vector3(0.5, 1, 0.5) }, (doorObject) => {
                            doorObject.position.set(i - actual_width / 2.0, 0, j - actual_height / 2 + 0.5);
                            doorObject.rotateY(Math.PI);
                            this.object.add(doorObject); // Add to the scene
                            this.Lobby = doorObject;
                        });
                    }
                    if(rooms[j][i] == 15) {
                            const geometryc = new THREE.BoxGeometry(7.8, 2.8, 4.8);
                            const materialc = new THREE.MeshBasicMaterial({
                                color: 0xFF00FF, // Any color
                                opacity: 0,     // Fully transparent
                                transparent: true
                            });
                            
                            const cube = new THREE.Mesh(geometryc, materialc);
                            cube.position.set(i - actual_width / 2.0, 1.8, j - actual_height / 2 + 0.5);
                            this.object.add(cube); // Add to the scene
                            this.RoomArr.push(cube);
                            this.RoomArrCoord.push(cube.position);
                            this.Lobby = cube;
                    }
                }
            }
            this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);
            this.loaded = true;
        }

        this.onProgress = function (url, xhr) {
            console.log("Resource '" + url + "' " + (100.0 * xhr.loaded / xhr.total).toFixed(0) + "% loaded.");
        }

        this.onError = function (url, error) {
            console.error("Error loading resource " + url + " (" + error + ").");
        }

        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        this.loaded = false;
        THREE.Cache.enabled = true;
        const loader = new THREE.FileLoader();
        loader.setResponseType("json");
        loader.load(
            this.url,
            description => this.onLoad(description),
            xhr => this.onProgress(this.url, xhr),
            error => this.onError(this.url, error)
        );
    }
    async fetchRoomNum(description) {
        try {
            const response = await fetch('https://localhost:5001/api/SurgeryRooms');
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('There was an error fetching the room number:', error);
        }
    }
    createMatrix(N, X, Y) {
		const zeroMatrix = this.replaceWithZero(N);
        // Create an array with X copies of N
        let numbers = Array(X).fill(N);

        // Calculate the number of rows required
        let rows = Math.ceil(X / Y);
        
        // Create the matrix
        let matrix = [];

        // Fill the matrix row by row
        for (let i = 0; i < rows; i++) {
            let row = numbers.slice(i * Y, (i + 1) * Y); // Take Y numbers per row
            // If there aren't enough numbers to fill the row, fill the remaining with -9
            while (row.length < Y) {
                row.push(zeroMatrix);
            }
            matrix.push(row);
        }

        return matrix;
    }

    replaceWithZero(matrix) {
    return matrix.map(row => row.map(() => 0));
    }

    mergeMatrices(matrices) {
        return matrices[0].map((_, rowIndex) =>
            matrices.reduce((mergedRow, matrix) => mergedRow.concat(matrix[rowIndex]), [])
        );
    }
    cellToCartesian(position) {
        return new THREE.Vector3((position[1] - this.size.width / 2.0 + 0.5) * this.scale.x, 0.0, (position[0] - this.size.height / 2.0 + 0.5) * this.scale.z)
    }

    // Convert cartesian (x, y, z) coordinates to cell [row, column] coordinates
    cartesianToCell(position) {
        return [Math.floor(position.z / this.scale.z + this.size.height / 2.0), Math.floor(position.x / this.scale.x + this.size.width / 2.0)];
    }

    /* To-do #23 - Measure the player’s distance to the walls
        - player position: position*/
        distanceToWestWall(position) {
            const indices = this.cartesianToCell(position);
            if (this.map[indices[0]][indices[1]] == 1 || this.map[indices[0]][indices[1]] == 3) {
                return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
            }
            return Infinity;
        }
    
        distanceToEastWall(position) {
            const indices = this.cartesianToCell(position);
            indices[1]++;
            if (this.map[indices[0]][indices[1]] == 1 || this.map[indices[0]][indices[1]] == 3) {
                return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
            }
            return Infinity;
        }
    
        distanceToNorthWall(position) {
            const indices = this.cartesianToCell(position);
            if (this.map[indices[0]][indices[1]] == 2 || this.map[indices[0]][indices[1]] == 3) {
                return position.z - this.cellToCartesian(indices).z + this.scale.z / 2.0;
            }
            return Infinity;
        }
    
        distanceToSouthWall(position) {
            const indices = this.cartesianToCell(position);
            indices[0]++;
            if (this.map[indices[0]][indices[1]] == 2 || this.map[indices[0]][indices[1]] == 3) {
                return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;
            }
            return Infinity;
        }

    foundExit(position) {
        /* To-do #42 - Check if the player found the exit
            - assume that the exit is found if the distance between the player position and the exit location is less than (0.5 * maze scale) in both the X- and Z-dimensions
            - player position: position
            - exit location: this.exitLocation
            - maze scale: this.scale
            - remove the previous instruction and replace it with the following one (after completing it)
        return ... < ... && ... */
        return Math.abs(position.x - this.exitLocation.x) < 0.5 * this.scale.x && Math.abs(position.z - this.exitLocation.z) < 0.5 * this.scale.z
    };
}