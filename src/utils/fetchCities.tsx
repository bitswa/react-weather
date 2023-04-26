import axios from "axios";

export const fetchCities = async (city: string | undefined) => {
  if (city?.length != 0) {
    return await axios
      .get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${
          import.meta.env.VITE_API_KEY
        }`
      )
      .then((res) => res.data);
  }

  return "";
};
