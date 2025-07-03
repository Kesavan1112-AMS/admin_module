import axios, { AxiosResponse } from "axios";
import { API_CONFIG } from "../config/Api.config";
import { TillDate } from "../props/DataTill.props";
import { API_URL_CONFIG } from "../config/ApiUrl.config";
import { getApiHeaders } from "../utils/ApiHeaders";
import { ApiHeaderProps } from "../props/Auth.props";

const baseUrl = API_CONFIG.BACKEND_URL;
const lastDateUrl = API_URL_CONFIG.LAST_DATE_API;

export const fetchYear = async (
  header: ApiHeaderProps,
  countryIds: string[]
): Promise<TillDate> => {
  try {
    const data = new URLSearchParams();
    countryIds.forEach((id) => data.append("countryId[]", id));

    const headers = await getApiHeaders(header);

    const response: AxiosResponse = await axios.post(
      `${baseUrl}${lastDateUrl}`,
      data,
      { headers }
    );

    if (response.data?.status === 1 && response.data.data?.length) {
      const lastDate = response.data.data[0].lastDate;
      if (lastDate) {
        return {
          year: lastDate.substring(0, 4),
          month: lastDate.substring(4, 6),
          date: lastDate.substring(6, 8),
        };
      }
    }
  } catch (error) {
    console.error("Error fetching year data:", error);
  }
  return {
    date: "",
    month: "",
    year: "",
  };
};

export default fetchYear;
