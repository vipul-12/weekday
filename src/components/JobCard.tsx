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

type JobCardProps = {
  companyName: string;
  jobRole: string;
  location: string;
  maxJdSalary: number;
  minJdSalary: number;
  jobDetailsFromCompany: string;
  minExp: number | null;
  logoUrl: string;
};

const JobCard = (props: JobCardProps) => {
  return (
    <StyledJobCard>
      <div className="card-header">
        <img
          src={props.logoUrl}
          alt="company logo here"
          className="card-header-img"
        />
        <div className="card-header-text">
          <div>
            <span className="grey-col">{props.companyName}</span>
          </div>

          <div>
            <span>{props.jobRole}</span>
          </div>

          <div>
            <span>{props.location}</span>
          </div>
        </div>
      </div>

      <div className="est-salary">
        <span>
          Estimated Salary : ₹{props.minJdSalary} - {props.maxJdSalary}✅
        </span>
      </div>

      <div className="about-company">
        <span>About Company</span>

        <p>
          {props.jobDetailsFromCompany}
        </p>
      </div>

      <div className="min-xp">
        <span className="grey-col">Minimum Experience </span>
        <div>{props.minExp} years</div>
      </div>

      <button className="apply-button">⚡Easy Apply</button>

      <button className="referral-button">Unlock Referral asks</button>
    </StyledJobCard>
  );
};

export default JobCard;