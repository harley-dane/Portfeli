import { React } from "react"
import Testo from "./Image/Testo.jpeg"
import github from "./Image/github.png" 
import linkedin from "./Image/linkedin.png"
import Resume from "./Image/Resume.pdf"


export default function MainContent() {
  const Contact= () =>  window.scrollTo({
    top: 3000,
    left: 100,
    behavior: "smooth",
  });
    return(
<div>
<section className="profile">
<div className="section__pic-container">
<img src= {Testo}  alt="Harley"
 className="section__pic-container1"/>
</div>
<div className="section__text">
<p className="section__text__p1">Hello, I'm</p>
<h1 className="title">Harley Clair</h1>
<p className="section__text__p2">Frontend Developer</p>
<div className="btn-container">

<button className="btn btn-color-2"><a href={Resume} target="_blank" download={"Resume"} >My Resume</a></button>
<button className="btn btn-color-1" 
onClick= {Contact}>
  Contact Info
</button>
</div>
<div className="socials-container">
<img
  src={linkedin}
  alt="My LinkedIn profile"
  className="icon"
  onClick={Contact}
/>
<img
  src={github}
  alt="My Github profile"
  className="icon"
  onClick={Contact}
/>
</div>
</div>
</section>
        </div>
    )
}