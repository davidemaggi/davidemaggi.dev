import React from "react";
import { Link, useLocation } from "react-router-dom";
import personalData from "../assets/data/personal";

import { useTranslation } from "../Utils/i18nUtil";
import styles from "../Utils/styles";
import { BsFacebook } from "react-icons/bs";
import { IconContext } from "react-icons";
import SocialButtons from "./SocialButtons";

const UserAbout: React.FC<{}> = (props) => {
  const { translate, setLanguage } = useTranslation();
  const { pathname } = useLocation();
  return (
    <div className="p-7 pb-0 block-section">
      <h2 className={styles.blockTitle}>About me 👋</h2>
      <p className="text-gray-600 mb-5">
        Libero quas veritatis nulla distinctio fuga nihil temporibus et. Quia
        dicta sapiente qui porro molestiae nobis incidunt voluptatem. Et
        voluptas sunt nihil. At perferendis voluptatem dolores nulla. Adipisci
        dolore non. Praesentium ipsa magnam ut quia explicabo voluptates.
      </p>

      <div className="flex flex-col space-y-4">
        <a href="#0" className="mail-link social-link-hover">
          <i className="bx bx-at text-xl"></i>
          <span>{personalData.email}</span>
        </a>

        <SocialButtons/>
      </div>

      <div className="border-t border-gray-200 my-5"></div>

      <ul className="flex space-x-8 font-medium">
        <li>
          <Link
            className={`menu-link-hover ${
              ["/experience", "/"].includes(pathname)
                ? "menu-link-active"
                : "menu-link"
            }`}
            to="/experience"
          >
            Resume
          </Link>
        </li>

        <li>
          <Link
            className={`menu-link-hover ${
              pathname == "/contact" ? "menu-link-active" : "menu-link"
            }`}
            to="/contact"
          >
            Contact
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserAbout;
