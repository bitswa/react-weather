import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import { ImageStatus } from "./ImageStatus";
import { getWeekDay } from "../utils/getWeekDay";
import { useQuery } from "@tanstack/react-query";
import { fetchCities } from "../utils/fetchCities";

import search from "../assets/search.svg";
import arrow from "../assets/arrow.svg";
import drop from "../assets/drop.svg";
import cloud from "../assets/cloud.svg";

type Current = {
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
  name: string;
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

type Forecast = {
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

type Air = {
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

type City = {
  country: string;
  lat: string;
  lon: string;
  name: string;
  state: string;
};

type Props = {
  data:
    | {
        current: Current;
        forecast: Forecast;
        air: Air;
      }
    | undefined;
  setLocation: Dispatch<SetStateAction<{ lat: string; lon: string }>>;
};

export const Header = ({ data, setLocation }: Props) => {
  const cityInputRef = useRef<HTMLInputElement>(null);
  const [handleButton, setHandleButton] = useState(false);

  const { data: cities, refetch } = useQuery<City[] | undefined>(
    ["cities"],
    () => fetchCities(cityInputRef.current?.value)
  );

  console.log(cities);

  const handleCitySubmit = (event: FormEvent) => {
    event.preventDefault();

    refetch();
  };

  const datetime = new Date((data?.current?.dt as number) * 1000);

  return (
    <header className="p-5 px-8 bg-white md:w-[310px] md:min-w-[310px]">
      <nav className="flex items-center justify-between relative mb-8">
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
            />
          )}
          {handleButton && (
            <button className="font-medium p-2 hover:bg-slate-200" type="submit">
              <img className="w-8" src={search} alt="" />
            </button>
          )}
          <button
            className={`${handleButton && "p-2 border-l hover:bg-slate-200"}`}
            onClick={() => setHandleButton((prev) => !prev)}
          >
            {handleButton ? (
              <img className="w-8 h-8" src={arrow} alt="return" />
            ) : (
              <img
                className="w-8 h-8 lg:w-6 lg:h-6"
                src={search}
                alt="search"
              />
            )}
          </button>
        </form>

        {!handleButton && (
          <span className="font-medium">{data?.current.name}</span>
        )}

        {cities && handleButton && (
          <div className="absolute top-0 mt-9 w-full border overflow-y-auto max-h-28 rounded-2xl">
            <ul>
              {cities?.map((item) => (
                <li key={item.lat}>
                  <button
                    onClick={() => {
                      setLocation({ lat: item.lat, lon: item.lon });
                      setHandleButton(false);
                    }}
                    className="flex flex-col items-center justify-center bg-white p-2 border-b w-full hover:bg-slate-200"
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
            {data?.forecast?.list[0].pop != undefined && (
              <li>
                <span className="flex items-center gap-2">
                  <img src={drop} alt="water drop" />
                  <span className="font-medium text-lg md:text-base">
                    Rain -{" "}
                    {data?.forecast?.list[0].pop > 0.9
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
