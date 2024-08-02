import React from "react";

export default function Footer(){
    return (
        <footer>
      <nav>
        <div className="nav-links-container">
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="https://github.com/harley-dane/caloc" target="_blank">Contact</a></li>
          </ul>
        </div>
      </nav>
      <p>Copyright  @2024 Harley Clair. All Rights Reserved.</p>
    </footer>
    )
}