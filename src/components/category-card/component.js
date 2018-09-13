import React, { Component } from 'react';

import CategoryLogoAnimals from '../../assets/images/categories/animals.png';
import CategoryLogoCharity from '../../assets/images/categories/charity.png';
import CategoryLogoEducation from '../../assets/images/categories/education.png';
import CategoryLogoEmergency from '../../assets/images/categories/emergency.png';
import CategoryLogoMedical from '../../assets/images/categories/medical.png';
import CategoryLogoMemorials from '../../assets/images/categories/memorials.png';
import CategoryLogoSports from '../../assets/images/categories/sports.png';
import CategoryLogoVolunteer from '../../assets/images/categories/volunteer.png';
import CategoryLogoWishlist from '../../assets/images/categories/wishlist.png';

import './style.css';

class CategoryCard extends React.Component {
  constructor(props) {
    super(props);

    this.categories = {
      animals: CategoryLogoAnimals,
      charity: CategoryLogoCharity,
      education: CategoryLogoEducation,
      emergency: CategoryLogoEmergency,
      medical: CategoryLogoMedical,
      memorials: CategoryLogoMemorials,
      sports: CategoryLogoSports,
      volunteer: CategoryLogoVolunteer,
      wishlist: CategoryLogoWishlist,
    }
  }

  render() {
    return (
      <div id="app-category-card" className={this.props.category.toLowerCase()}>
        <img src={this.props.imgUrl}></img>
        <div>{this.props.category}</div>
      </div>
    );
  }
}

export default CategoryCard;