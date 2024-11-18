import React from "react";
import { BsCaretDownFill } from 'react-icons/bs';
import './NavBar.css';

export default class NavBar extends React.Component {
    render() {
        const { 
            dropMenuBtn, 
            changeCurrentAlgo, 
            changeCurrentSpeed, 
            clearBoard, 
            clearPath, 
            visualizeAlgo, 
            visualizeMaze 
        } = this.props;

        return (
            <div className="nav-bar">
                {/* Path Visualizer Button */}
                <button 
                    className="not-hidden-refresh" 
                    onClick={() => window.location.reload(false)} 
                    aria-label="Reload the page to reset the path visualizer"
                >
                    AlgoNavigator
                </button>

                {/* Algorithms Dropdown Menu */}
                <div className="dropdown-menu">
                    <button 
                        className="menu-btn" 
                        onClick={() => dropMenuBtn('menu-content')} 
                        aria-label="Select an algorithm"
                    >
                        Algorithms <BsCaretDownFill />
                    </button>
                    <div className="menu-content">
                        <button className="hidden" onClick={() => changeCurrentAlgo('Dijkstra')}>Dijkstra</button>
                        <button className="hidden" onClick={() => changeCurrentAlgo('DFS')}>DFS</button>
                        <button className="hidden" onClick={() => changeCurrentAlgo('BFS')}>BFS</button>
                        <button className="hidden" onClick={() => changeCurrentAlgo('A *')}>A *</button>
                    </div>
                </div>

                {/* Clear Paths and Clear Board Buttons */}
                <button className="not-hidden" onClick={() => clearPath()} aria-label="Clear all paths">Clear Paths</button>
                <button className="not-hidden" onClick={() => clearBoard()} aria-label="Clear the board">Clear Board</button>

                {/* Maze Generation Dropdown Menu */}
                <div className="dropdown-menu">
                    <button 
                        className="menu-btn" 
                        onClick={() => dropMenuBtn('maze-menu-content')} 
                        aria-label="Generate a maze"
                    >
                        Generate Maze <BsCaretDownFill />
                    </button>
                    <div className="maze-menu-content">
                        <button className="hidden" onClick={() => visualizeMaze('Rand-maze')}>Random Maze</button>
                        <button className="hidden" onClick={() => visualizeMaze('Recursive-div')}>Recursive Division</button>
                        <button className="hidden" onClick={() => visualizeMaze('Prim-maze')}>Prim Maze</button>
                    </div>
                </div>

                {/* Speed Dropdown Menu */}
                <div className="dropdown-menu">
                    <button 
                        className="menu-btn" 
                        onClick={() => dropMenuBtn('speed-menu-content')} 
                        aria-label="Select speed for visualization"
                    >
                        Speed <BsCaretDownFill />
                    </button>
                    <div className="speed-menu-content">
                        <button className="hidden" onClick={() => changeCurrentSpeed('Fastest')}>Fastest</button>
                        <button className="hidden" onClick={() => changeCurrentSpeed('Fast')}>Fast</button>
                        <button className="hidden" onClick={() => changeCurrentSpeed('Normal')}>Normal</button>
                        <button className="hidden" onClick={() => changeCurrentSpeed('Slow')}>Slow</button>
                        <button className="hidden" onClick={() => changeCurrentSpeed('Slowest')}>Slowest</button>
                    </div>
                </div>

                {/* Visualize Button */}
                <button className="play" onClick={() => visualizeAlgo()} aria-label="Start algorithm visualization">
                    Visualize
                </button>
            </div>
        );
    }
}
