import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { app } from '../../../values/ui';
import cx from 'classnames';

const SplashScreen = ({ onClick, blocks, title }) => {
  const splashClick = (link) => {
    onClick && onClick(link)
  }

  return (
    <div className="reports-menu">
      <div className="reports-splash-header">
        {title || "Select a Report"}
      </div>
      <div className="reports-splash-container">
        {blocks.map((bl, i) => (
          <SplashBlock
            key={`${bl.type}`}
            icon={bl.icon}
            label={bl.label}
            link={bl.link}
            subtext={bl.subtext}
            tagline={bl.tagline}
            onClick={splashClick}
          />
        ))}
      </div>
    </div>
  )
}

SplashScreen.propTypes = {
  onClick: PropTypes.func
}

const SplashBlock = ({label, icon, link, onClick, className, subtext, tagline}) => {
  const splashClick = () => {
    onClick && onClick(link)
  }
  const splashBodyStyle = cx({
    'reports-splash-block-body': true,
    'noIcon': icon ? false : true,
  });

  return (
    <Link to={link} className={`reports-splash-block ${className}`}>
        {icon && (
          <div alt={label} className="reports-splash-block-img">
            {icon()}
          </div>
        )}
        <div className={splashBodyStyle}>
          <div className="reports-splash-block-header">
            {label}
          </div>
          <div className="reports-splash-subtext">{subtext}</div>
          <div className="reports-splash-tagline">{tagline}</div>
        </div>
    </Link>
  )
}

SplashBlock.propTypes = {
  label: PropTypes.string,
  img: PropTypes.string,
  link: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string
}

export default SplashScreen;