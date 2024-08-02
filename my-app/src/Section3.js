import React  from "react"
import calc from "./Image/calc.png"
import buger from "./Image/buger.png"
import arrow from "./Image/arrow.png"
import project2 from "./Image/project2.png"


export default function Section3() {
    function MyGit(){
        alert('Github')
    }
    return (
    <section className="projects">
<p className="section__text__p1">Browse My Recent</p>
<h1 className="title">Projects</h1>
<div className="experience-details-container">
<div className="about-containers">
    <div className="details-container color-container">
    <div className="article-container">
        <img
        src={calc}
        alt="Project 1"
        className="project-img"
        />
    </div>
    <h2 className="experience-sub-title project-title">Project One</h2>
    <div className="btn-container">
        <button
        className="btn btn-color-2 project-btn"
        onClick={MyGit}
        >
        Github
        </button>
        <button
        className="btn btn-color-2 project-btn"
        onClick={MyGit}
        >
        Live Demo
        </button>
    </div>
    </div>
    <div className="details-container color-container">
    <div className="article-container">
        <img
        src={buger}
        alt="Project 2"
        className="project-img"
        />
    </div>
    <h2 className="experience-sub-title project-title">Project Two</h2>
    <div className="btn-container">
        <button
        className="btn btn-color-2 project-btn"
        onClick={MyGit}
        >
        Github
        </button>
        <button
        className="btn btn-color-2 project-btn"
        onClick={MyGit}
        >
        Live Demo
        </button>
    </div>
    </div>
    <div className="details-container color-container">
    <div className="article-container">
        <img
        src={project2}
        alt="Project 3"
        className="project-img"
        />
    </div>
    <h2 className="experience-sub-title project-title">Project Three</h2>
    <div class="btn-container">
        <button
        className="btn btn-color-2 project-btn"
        onClick={MyGit}
        >
        Github
        </button>
        <button
        className="btn btn-color-2 project-btn"
        onClick={MyGit}
        >
        Live Demo
        </button>
    </div>
    </div>
</div>
</div>
<img
src={arrow}
alt="Arrow icon"
className="icon arrow"
onClick={MyGit}
/>
</section>
    )
}