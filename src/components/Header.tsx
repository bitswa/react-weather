import { FormEvent, useRef, useState } from "react";
import { ImageStatus } from "./ImageStatus";
import { getWeekDay } from "../utils/getWeekDay";
import { useQuery } from "@tanstack/react-query";

import search from "../assets/search.svg";
import arrow from "../assets/arrow.svg";
import drop from "../assets/drop.svg";
import cloud from "../assets/cloud.svg";
import { fetchCities } from "../utils/fetchCities";

type currentProps = {
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

type forecastProps = {
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

type airProps = {
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

type Props = {
  data:
    | {
        current: currentProps;
        forecast: forecastProps;
        air: airProps;
      }
    | undefined;
};


export const Header = ({ data, setLocation, refetchWeather }: Props) => {
  const cityInputRef = useRef<HTMLInputElement>(null);
  const [handleButton, setHandleButton] = useState(false);

  const { data: cities, refetch } = useQuery(["cities"], () =>
    fetchCities(cityInputRef.current?.value)
  );

  const handleCitySubmit = (event: FormEvent) => {
    event.preventDefault();
    
    refetch();
  };

  const datetime = new Date((data?.current?.dt as number) * 1000);

  return (
    <header className="p-8 bg-white md:min-w-[310px]">
      <nav className="relative mb-8">
        <form
          onSubmit={handleCitySubmit}
          className={`${
            handleButton && "border-b-2 pl-2"
          } h-8 relative flex items-center overflow-hidden`}
        >
          {handleButton && (
            <input
              className="w-full h-full outline-none"
              placeholder="City"
              type="text"
              ref={cityInputRef}
              onChange={(e) => console.log(e.target.value)}
            />
          )}
          <button
            className={`${handleButton && ""} `}
            onClick={() => setHandleButton((prev) => !prev)}
          >
            {handleButton ? (
              <img className="w-8 h-8 lg:w-6 lg:h-6" src={arrow} alt="" />
            ) : (
              <img className="w-8 h-8 lg:w-6 lg:h-6" src={search} alt="" />
            )}
          </button>
          {handleButton && <button type="submit">Enviar</button>}
        </form>
        {cities?.length > 0 && handleButton && (
          <div className="absolute mt-2 w-full border overflow-y-auto max-h-28 rounded-2xl">
            <ul>
              {cities?.map((item) => (
                <li key={item.lat}>
                  <button
                    onClick={() => {
                      setLocation({ lat: item.lat, lon: item.lon });
                      setHandleButton(false);
                      refetchWeather();
                    }}
                    className="flex flex-col items-center justify-center bg-white p-2 border-b w-full outline-none"
                  >
                    <span className="font-medium text-sm">{item.name}</span>
                    <span className="text-xs">
                      {item.country} - {item.state}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
      <div>
        <div>
          <ImageStatus
            className="w-40 mx-auto"
            weather={data?.current?.weather[0]?.main}
            datetime={datetime}
          />
          <div className="my-8 flex flex-col gap-3">
            <span className="font-medium text-4xl flex">
              {Math.round(data?.current?.main?.temp as number)}
              <span className="text-xl">°C</span>
            </span>
            <p className="text-lg font-medium">
              {getWeekDay(datetime.getDay())},{" "}
              <span className="font-normal opacity-50">
                {" "}
                {datetime.getHours() < 10 && "0"}
                {datetime.getHours()}
                {":"}
                {datetime.getMinutes() < 10 && "0"}
                {datetime.getMinutes()}
              </span>
            </p>
          </div>
        </div>
        <div className="py-8 border-t-2 ">
          <ul className="flex flex-col gap-3">
            <li>
              <span className="flex items-center gap-2">
                <img src={cloud} alt="cloud" />
                <span className="font-medium text-lg md:text-base">
                  {data?.current?.weather[0]?.description}
                </span>
              </span>
            </li>
            {data?.forecast?.list[0].pop && (
              <li>
                <span className="flex items-center gap-2">
                  <img src={drop} alt="water drop" />
                  <span className="font-medium text-lg md:text-base">
                    Rain -{" "}
                    {data?.forecast.list[0].pop > 0.9
                      ? data?.forecast?.list[0].pop * 100
                      : (data?.forecast?.list[0].pop * 10)
                          .toString()
                          .slice(0, 3)}
                    %
                  </span>
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};
