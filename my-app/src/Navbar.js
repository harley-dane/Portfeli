import React  from "react";


function Navbar() {
    function toggleMenu() {
        alert ('menu')
    }
    const About= () =>  window.scrollTo({
        top: 700,
        left: 100,
        behavior: "smooth",
      });
const Contact= () =>  window.scrollTo({
    top: 3000,
    left: 100,
    behavior: "smooth",
  });
  const Project= () =>  window.scrollTo({
    top: 2000,
    left: 100,
    behavior: "smooth",
  });
  const Experience= () =>  window.scrollTo({
    top: 1200,
    left: 100,
    behavior: "smooth",
  });

 return (
    <div> 
<nav id="desktop-nav">
<div className="logo">Harley Clair</div>
<div>
<ul className="nav-links">
    <li><a href="#about" onClick={About}>About</a></li>
    <li><a href="#experience" onClick={Experience}>Experience</a></li>
    <li><a href="#projects" onClick={Project}>Projects</a></li>
    <li><a href="#contact" onClick={Contact}>Contact</a></li>
</ul>
    </div>
</nav>
<nav id="hamburger-nav">
<div className="logo">Harley Clair</div>
<div className="hamburger-menu">
<div className="hamburger-icon" onClick={toggleMenu}>
    <span></span>
    <span></span>
    <span></span>
</div>
<div className="menu-links">
    <li><a href="#about" onClick={toggleMenu}>About</a></li>
    <li><a href="#experience" onClick={toggleMenu}>Experience</a></li>
    <li><a href="#projects" onClick={toggleMenu}>Projects</a></li>
    <li><a href="#contact" onClick={toggleMenu}>Contact</a></li>
</div>
</div>
</nav>
</div>
 )
}


export default Navbar