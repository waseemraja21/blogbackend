import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <ul className="footer_catagories">
        <li>
          <Link to="/posts/categories/Agriculture">Agriculture</Link>
        </li>
        <li>
          <Link to="/posts/categories/Business">Business</Link>
        </li>
        <li>
          <Link to="/posts/categories/Education">Education</Link>
        </li>
        <li>
          <Link to="/posts/categories/Entertainment">Entertainment</Link>
        </li>
        <li>
          <Link to="/posts/categories/Art">Art</Link>
        </li>
        <li>
          <Link to="/posts/categories/Investment">Investment</Link>
        </li>
        <li>
          <Link to="/posts/categories/Miscellaneous">Miscellaneous</Link>
        </li>
        <li>
          <Link to="/posts/categories/Weather">Weather</Link>
        </li>
      </ul>
      <div className="footer_copyright">
        <small>All Rights Reserved © Waseem Raja</small>
      </div>
    </footer>
  );
}
