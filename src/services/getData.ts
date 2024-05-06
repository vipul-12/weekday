// Function to get data from API endpoint.

import axios, { AxiosResponse } from "axios";
import { RequestBody } from "../App";

export const getData = async (
  body: RequestBody
): Promise<AxiosResponse<any>> => {
  try {
    const response = await axios.post(
      "https://api.weekday.technology/adhoc/getSampleJdJSON",
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
