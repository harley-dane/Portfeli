import React from "react"
import profi  from "./Image/profi.jpeg"
import education  from "./Image/education.png"
import experience  from "./Image/experience.png"
import arrow from "./Image/arrow.png"


export default function Section1(){
  function ArrowD(){
    alert("down")
  }
    return (

        <div>
             <section className="about">
      <p className="section__text__p1">Get To Know More</p>
      <h1 className="title">About Me</h1>
      <div className="section-container">
        <div className="section__pic-container">
          <img
            src={profi}
            alt="Profile"
            className="about-pic"
          />
        </div>
        <div className="about-details-container">
          <div className="about-containers">
            <div className="details-container">
              <img
                src= {experience}
                alt="Experience icon"
                className="icon"
              />
              <h3>Experience</h3>
              <p>2+ years <br />Frontend Development</p>
            </div>
            <div className="details-container">
              <img
                src={education}
                alt="Education icon"
                className="icon"
              />
              <h3>Education</h3>
              <p>Just Secondadry School with some technical courses in IT</p>
            </div>
          </div>
          <div className="text-container">
          <p>
          Hi, my name is Harley Clair, and I am a front-end developer. 
          I specialize in creating visually appealing and user-friendly 
          websites and web applications. My expertise includes HTML, CSS, and 
          JavaScript, along with frameworks like React and Angular. 
          I enjoy turning design concepts into interactive, responsive, and 
          accessible digital experiences.
          I’m passionate about staying up-to-date with the latest web technologies
           and  continuously improving my skills to deliver high-quality projects.
          </p>
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
        </div>
    )
}