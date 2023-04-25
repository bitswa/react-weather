import axios from "axios";

type currentProps = {
  data: {
    dt: number;
    main: {
      humidity: number;
      temp: number;
      temp_max: number;
      temp_min: number;
    };
    wind: {
      speed: number;
      gust: number;
    };
    visibility: number;
    sys: {
      sunrise: number;
      sunset: number;
    };
    weather: {
      description: string;
      main: string;
    }[];
  };
};

type forecastProps = {
  data: {
    list: {
      dt: number;
      dt_txt: string;
      main: {
        temp: number;
        temp_max: number;
        temp_min: number;
      };
      weather: {
        main: string;
      }[];
      pop: number | undefined;
    }[];
  };
};

type airProps = {
  data: {
    list: {
      components: {
        co: number;
        no2: number;
        o3: number;
        pm2_5: number;
        pm10: number;
        so2: number;
      };
    }[];
  };
};

type Props = {
  lat: string;
  lon: string;
};

export async function fetchData({ lat, lon }: Props) {
  const { data: current }: currentProps = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}8&lon=${lon}&appid=${
      import.meta.env.VITE_API_KEY
    }&units=metric`
  );
  const { data: forecast }: forecastProps = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${
      import.meta.env.VITE_API_KEY
    }&units=metric`
  );
  const { data: air }: airProps = await axios.get(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${
      import.meta.env.VITE_API_KEY
    }`
  );

  return {
    current,
    forecast,
    air,
  };
}
