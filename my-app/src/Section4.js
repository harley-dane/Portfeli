import React  from "react";
import linkedin from "./Image/linkedin.png"
import email from "./Image/email.png"


export default function Section4() {
    return (
        <section className="contact">
      <p className="section__text__p1">Get in Touch</p>
      <h1 className="title">Contact Me</h1>
      <div className="contact-info-upper-container">
        <div className="contact-info-container">
          <img
            src={email}
            alt="Email icon"
            className="icon contact-icon email-icon"
          />
          <p><a href="mailto:harleydane71@gmail.com">harleydane71@gmail.com</a></p>
        </div>
        <div className="contact-info-container">
          <img
            src={linkedin}
            alt="LinkedIn icon"
            className="icon contact-icon"
          />
          <p><a href="https://www.linkedin.com" target="_blank">LinkedIn</a></p>
        </div>
      </div>
    </section>
    )
}