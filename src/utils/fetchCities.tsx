import axios from "axios";

export const fetchCities = async (cityName: string | undefined) => {
  if (cityName && cityName?.length != 0) {
    return await axios
      .get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${
          import.meta.env.VITE_API_KEY
        }`
      )
      .then((res) => res.data);
  }

  return "";
};
