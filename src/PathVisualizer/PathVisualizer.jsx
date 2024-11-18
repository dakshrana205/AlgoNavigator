import React from "react";
import { astar, astar_if_guarantees, bfs, bfs_if_guarantees, dfs, dfs_if_guarantees, dijkstra, dijkstra_if_guarantees } from "../helper/algoAbouts";
import { COLS, DEFAULT_SPEED, FASTEST_SPEED, FAST_SPEED, INIT_END_POS, INIT_START_POS, ROWS, SLOWEST_SPEED, SLOW_SPEED } from "../helper/constants";
import { getGridToggledWall, getGridWithMaze, getInitGrid, gridDynamicNodes, resetGridWithWalls } from "../helper/getGrid";
import { animateVisitedNodes } from "./animations/algoAnimations";
import { getAnimationMazeList, getAnimationsAlgoList } from "./animations/getAnimationAlgoList";
import { animateMaze } from "./animations/mazeAnimation";
import NavBar from "./Navbar";
import Node from "./Node/Node";
import './PathVisualizer.css';

export default class PathVisualizer extends React.Component {
    state = {
        grid: [],
        mainIsPressed: '',
        mouseIsPressed: false,
        start_pos: INIT_START_POS,
        end_pos: INIT_END_POS,
        isRunning: false,
        algorithm: '',
        speed: DEFAULT_SPEED,
    };

    componentDidMount() {
        const grid = getInitGrid(this.state.start_pos, this.state.end_pos);
        this.setState({grid: grid});
    }

    

    handleMouseDown(row, col) {
        const { grid, mainIsPressed, isRunning } = this.state;
        if (isRunning)
            return;
        const node = grid[row][col];
        if (node.isStart && !node.isFinish){
            this.setState({mainIsPressed: 'start'});
        }
        if (node.isFinish && !node.isStart){
            this.setState({mainIsPressed: 'finish'});
        }
        if (mainIsPressed === ''){
            const newGrid = getGridToggledWall(grid, row, col)
            this.setState({grid: newGrid, mouseIsPressed: true});
        }
    }
    handleMouseEnter(row, col) {
        const { grid, mouseIsPressed, mainIsPressed } = this.state;
        if (mainIsPressed === 'start'){
            //this.setState({start_pos: {row, col}});
            const newGrid = gridDynamicNodes(grid, row, col, 'start');
            this.setState({grid: newGrid});
        }
        if (mainIsPressed === 'finish'){
            const newGrid = gridDynamicNodes(grid, row, col, 'finish');
            this.setState({grid: newGrid});
        }
        if (mouseIsPressed && mainIsPressed === ''){
            const newGrid = getGridToggledWall(this.state.grid, row, col);
            this.setState({grid: newGrid, mouseIsPressed: true});
        }
    }
    handleMouseUp(row, col) {
        const { mainIsPressed, grid } = this.state;
        if (mainIsPressed === 'start'){
            const newGrid = gridDynamicNodes(grid, row, col, 'start');
            this.setState({mainIsPressed: '', grid: newGrid, start_pos: {row, col}});
        }
        if (mainIsPressed === 'finish'){
            const newGrid = gridDynamicNodes(grid, row, col, 'finish');
            this.setState({mainIsPressed: '', grid: newGrid, end_pos: {row, col}});
        }
        this.setState({mouseIsPressed: false});
    }
    handleMouseLeave(row, col){
        const { grid, mainIsPressed } = this.state;
        if (mainIsPressed === "")
            return;
        let newGrid = grid.slice();
        const node = newGrid[row][col];
        const newNode = {
            ...node,
            isStart: mainIsPressed === 'start' ? false: node.isStart,
            isFinish: mainIsPressed === 'finish' ? false: node.isFinish,
            isWall: (mainIsPressed === 'start' || mainIsPressed === 'finish') ? false : node.isWall,
        }
        newGrid[row][col] = newNode;
        this.setState({ grid: newGrid });
    }
    dropMenuBtn = (menu_type) => {
        const menu_block = document.querySelector(`.${menu_type}`);
        menu_block.classList.toggle('show');
    }
    renderGrid() {
        return (
                this.state.grid.map((row, rowIdx) => {
                return (
                        row.map((node, nodeIdx) => {
                            const { row, col, isStart, isFinish, isWall } = node;
                            return (
                                <Node 
                                    key = {nodeIdx}
                                    row = {row}
                                    col = {col}
                                    isFinish = {isFinish}
                                    isStart = {isStart}
                                    isWall = {isWall}
                                    onMouseDown = {(row, col) => this.handleMouseDown(row, col)}
                                    onMouseEnter = {(row, col) => this.handleMouseEnter(row, col)}
                                    onMouseUp = {(row, col) => this.handleMouseUp(row, col)}
                                    onMouseLeave = {(row, col) => this.handleMouseLeave(row, col)}
                                ></Node>
                            )
                        })
                    )
                }
            )
        );
    }

    render() {
        return (
            <div className="container">
                <NavBar
                    dropMenuBtn = {this.dropMenuBtn}
                    changeCurrentAlgo = {this.changeCurrentAlgo}
                    changeCurrentSpeed = {this.changeCurrentSpeed}
                    clearBoard = {this.clearBoard}
                    clearPath = {this.clearPath}
                    visualizeAlgo = {this.visualizeAlgo}
                    visualizeMaze = {this.visualizeMaze}
                />
                <div className="grid">
                    {this.renderGrid()}
                </div>

                <div className="about-container">
                   <div className="about-header"></div>
                   <div className="about-content"></div>
                   <div className="guarantees"></div>
                </div>
            </div>
        )
    }

    changeCurrentSpeed = (SpeedType) => {
        switch (SpeedType) {
            case 'Fastest':
                this.setState({speed: FASTEST_SPEED})
                break;
            case 'Fast':
                this.setState({speed: FAST_SPEED});
                break;
            case 'Normal':
                this.setState({speed: DEFAULT_SPEED});
                break;
            case 'Slow':
                this.setState({speed: SLOW_SPEED});
                break;
            case 'Slowest':
                this.setState({speed: SLOWEST_SPEED});
                break;
            default:
                break;
        }
    }

    changeCurrentAlgo = (algorithm) => {
        this.setState({algorithm: algorithm});
        const visualizeBtn = document.querySelector('.play');
        visualizeBtn.innerHTML = `Visualize ${algorithm}`;

        const aboutHeader = document.querySelector('.about-header');
        aboutHeader.innerHTML = algorithm === 'DFS' ? 'Depth First Search' : 
        algorithm === 'BFS' ? 'Breadth First Search' : 
        algorithm === 'A *' ? 'A * Search' : 
        algorithm; 

        const aboutContent = document.querySelector('.about-content');
        aboutContent.innerHTML = algorithm === 'DFS' ? dfs : 
        algorithm === 'BFS' ? bfs : 
        algorithm === 'A *' ? astar : 
        dijkstra; 

        const guaranteesContent = document.querySelector('.guarantees');
        guaranteesContent.innerHTML = algorithm === 'DFS' ? dfs_if_guarantees : 
        algorithm === 'BFS' ? bfs_if_guarantees : 
        algorithm === 'A *' ? astar_if_guarantees : 
        dijkstra_if_guarantees;
    }

    

    changeHTMLtextVisualizeBtn() {
        const visualizeBtn = document.querySelector('.play');
        visualizeBtn.innerHTML = `Pick an Algorithm`;
    }
    


    visualizeMaze = async(MazeType) => {
       
        //const { grid, speed, isRunning, start_pos, end_pos } = this.state;
        if (this.state.isRunning) return;
        //this.clearPath();

        //primsMaze(this.state.start_pos, this.state.end_pos);
        this.clearBoard();
        
        // Set the required fields
        this.setState({isRunning: true});
        this.changeColorVisualizeBtn(true);

        // Get a random Maze
        const mazeAnimation = getAnimationMazeList(this.state.grid, this.state.start_pos, this.state.end_pos, MazeType);

       
        // Animate the maze
        animateMaze(mazeAnimation, this.state.speed);

        // wait for animation to be done
        await this.ToggleStateIsRunning(false, mazeAnimation.length * this.state.speed);

        // Set the fields again
        this.changeColorVisualizeBtn(false);
        this.setState({grid: getGridWithMaze(this.state.grid, mazeAnimation)});
    }


    

    visualizeAlgo = async() => {
        const { grid, algorithm, start_pos, end_pos, speed, isRunning } = this.state;
        
        if (isRunning) return;
        
        if (algorithm === ''){
            this.changeHTMLtextVisualizeBtn();
            return;
        }
        // Reset the grid. For multiple clicks on visualize
        this.clearPath();
        const [visitedNodesInOrder, shortestPath] = getAnimationsAlgoList(grid, start_pos, end_pos, algorithm);
    
        // Set the State isRunning to true
        this.setState({isRunning: true});
        this.changeColorVisualizeBtn(true);

        // Animate the Algorithm
        animateVisitedNodes(visitedNodesInOrder, shortestPath, speed);

        // Set the state isRunning to false
        await this.ToggleStateIsRunning(false, visitedNodesInOrder.length * 2.3 * speed);
        this.changeColorVisualizeBtn(false);
    }

    changeColorVisualizeBtn(bool){
        const btn = document.getElementsByClassName('play');
        btn[0].style.backgroundColor = bool ? 'red' : '';
    }

    ToggleStateIsRunning = async(bool, speed) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.setState({isRunning: bool});
                resolve();
            }, speed);
        });
    }
    

    resetVisitedShortestPathNodes() {
        for (let i = 0; i < ROWS; i++){
            for (let j = 0; j < COLS; j++){
                const node = document.getElementById(`node-${i}-${j}`);
                if (node.className === `node node-shortest-path` || node.className === `node node-visited` || node.className === 'node node-current'){
                    node.className = `node`;
                }
            }
        }
    }

    clearPath = () => {
        const { start_pos, end_pos, isRunning, grid } = this.state
        if (isRunning) return;
        this.resetVisitedShortestPathNodes();
        this.setState({grid: resetGridWithWalls(grid, start_pos, end_pos)});
    }


    clearBoard = () => {
        const { isRunning, start_pos, end_pos } = this.state
        if (isRunning) return;
        this.resetVisitedShortestPathNodes();
        this.setState({grid: getInitGrid(start_pos, end_pos)});
    }
}


window.onclick = function(event) {
    if (event.target.matches('.menu-btn')) return;

    const menu_block_algo = document.querySelector('.menu-content');
    const menu_block_maze = document.querySelector('.maze-menu-content');
    const menu_block_speed = document.querySelector('.speed-menu-content');
    if (menu_block_algo.classList.contains('show'))
        menu_block_algo.classList.remove('show');
    
    if (menu_block_maze.classList.contains('show'))
        menu_block_maze.classList.remove('show');

    if (menu_block_speed.classList.contains('show'))
        menu_block_speed.classList.remove('show');
}
