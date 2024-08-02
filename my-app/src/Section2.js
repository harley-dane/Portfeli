import React from "react"
import checkmark from "./Image/checkmark.png"
import arrow from "./Image/arrow.png"



export default function Section2(){
    function ArrowD(){
        alert("down")
        
      }
    return (
        <section className="experience">
<p className="section__text__p1">Explore My</p>
<h1 className="title">Experience</h1>
<div className="experience-details-container">
<div className="about-containers">
<div className="details-container">
<h2 className="experience-sub-title">Frontend Development</h2>
<div className="article-container">
<article>
<img
src={checkmark}
alt="Experience icon"
className="icon"
/>
<div>
<h3>HTML</h3>
<p>Experienced</p>
</div>
</article>
<article>
<img
src={checkmark}
alt="Experience icon"
className="icon"
/>
<div>
<h3>CSS</h3>
<p>Experienced</p>
</div>
</article>
<article>
<img
src={checkmark}
alt="Experience icon"
className="icon"
/>
<div>
<h3>SASS</h3>
<p>Intermediate</p>
</div>
</article>
<article>
<img
src={checkmark}
alt="Experience icon"
className="icon"
/>
<div>
<h3>JavaScript</h3>
<p>Experienced</p>
</div>
</article>
<article>
<img
src={checkmark}
alt="Experience icon"
className="icon"
/>
<div>
<h3>TypeScript</h3>
<p>Experienced</p>
</div>
</article>
<article>
<img
src={checkmark}
alt="Experience icon"
className="icon"
/>
<div>
<h3>Material UI</h3>
<p>Experienced</p>
</div>
</article>
</div>
</div>
<div className="details-container">
<h2 className="experience-sub-title">Frontend Development</h2>
<div className="article-container">
<article>
<img
src={checkmark}
alt="Experience icon"
className="icon"
/>
<div>
<h3>PostgreSQL</h3>
<p>Experienced</p>
</div>
</article>
<article>
<img
src={checkmark}
alt="Experience icon"
className="icon"
/>
<div>
<h3>Node JS</h3>
<p>Experienced</p>
</div>
</article>
<article>
<img
src={checkmark}
alt="Experience icon"
className="icon"
/>
<div>
<h3>Express JS</h3>
<p>Experienced</p>
</div>
</article>
<article>
<img
src={checkmark}
alt="Experience icon"
className="icon"
/>
<div>
<h3>Git</h3>
<p>Experienced</p>
</div>
</article>
</div>
</div>
</div>
</div>
<img
src={arrow}
alt="Arrow icon"
className="icon arrow"
onClick={ArrowD}
/>
      </section>
    )
}