import React from "react";
import styled from "styled-components";

const StyledJobCard = styled.div`
  display: flex;
  width: 350px;
  padding: 15px;
  //   justify-content: center;
  box-shadow: 0 4px 8px #686666;

  flex-direction: column;
  border: 1px solid #b6b1b1;
  margin: 5px;
  border-radius: 11px;

  .card-header-img {
    height: 50px;
    width: 35px;
  }

  .card-header-text {
    padding: 0px 15px;
  }

  .card-header {
    display: flex;
    padding: 2px;
    // flex-direction: column;
  }

  .apply-button {
    display: inline-block;
    padding: 10px 20px;
    margin-top: 4px;
    background-color: lightgreen;
    text-align: center;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
  }

  .referral-button {
    display: inline-block;
    padding: 10px 20px;
    margin-top: 4px;
    background-color: #3e51ff;
    color: #ffffffff;
    text-align: center;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
  }

  .grey-col {
    color: #7b7a7eff;
    font-weight: bold;
  }
`;

// type JobCardProps = {

// }

const JobCard = () => {
  return (
    <StyledJobCard>
      <div className="card-header">
        <img
          src="https://logo.clearbit.com/dropbox.com"
          alt="company logo here"
          className="card-header-img"
        />
        <div className="card-header-text">
          <div>
            <span className="grey-col">Company Name</span>
          </div>

          <div>
            <span>Job Role</span>
          </div>

          <div>
            <span>Location</span>
          </div>
        </div>
      </div>

      <div className="est-salary">
        <span>Estimated Salary : ₹18 - 30LPA✅</span>
      </div>

      <div className="about-company">
        <span>About Company</span>

        <p>
          This is a sample job and you must have displayed it to understand that
          its not just some random lorem ipsum text but something which was
          manually written. Oh well, if random text is what you were looking for
          then here it is: Lorem Ipsum is simply dummy text of the printing and
          typesetting industry. Lorem Ipsum has been the industry's standard
          dummy text ever since the 1500s, when an unknown printer took a galley
          of type and scrambled it to make a type specimen book. It has survived
          not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in
          the 1960s with the release of Letraset sheets containing Lorem Ipsum
          passages and now in this assignment.
        </p>
      </div>

      <div className="min-xp">
        <span className="grey-col">Minimum Experience </span>
        <div>1 years</div>
      </div>

      <button className="apply-button">⚡Easy Apply</button>

      <button className="referral-button">Unlock Referral asks</button>
    </StyledJobCard>
  );
};

export default JobCard;
