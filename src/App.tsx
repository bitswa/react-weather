import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getWeekDay } from "./utils/getWeekDay";
import { fetchData } from "./utils/fetchData";

import search from "./assets/search.svg";
import arrow from "./assets/arrow.svg";
import drop from "./assets/drop.svg";
import cloud from "./assets/cloud.svg";

import sunrise from "./assets/sunrise.svg";
import sunset from "./assets/sunset.svg";

import { ImageStatus } from "./components/ImageStatus";

function App() {
  const [handleButton, setHandleButton] = useState(false);
  const { data } = useQuery(["weather"], () =>
    fetchData({ lat: "-22.5269448", lon: "-41.944972" })
  );

  console.log(data);

  const datetime = new Date((data?.current?.dt as number) * 1000);
  const sunriseDatetime = new Date(
    (data?.current?.sys.sunrise as number) * 1000
  );
  const sunsetDatetime = new Date((data?.current?.sys.sunset as number) * 1000);

  return (
    <div className="md:flex lg:max-h-[580px] lg:max-w-5xl lg:rounded-3xl overflow-hidden">
      <div className="p-8 bg-white md:min-w-[310px]">
        <header className="mb-8">
          <button onClick={() => setHandleButton((prev) => !prev)} className="">
            {handleButton ? (
              <img className="w-8 h-8 lg:w-6 lg:h-6" src={arrow} alt="" />
            ) : (
              <img className="w-8 h-8 lg:w-6 lg:h-6" src={search} alt="" />
            )}
          </button>
        </header>
        <div>
          <div>
            <ImageStatus
              className="w-40 mx-auto"
              weather={data?.current?.weather[0]?.main}
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
              <li>
                <span className="flex items-center gap-2">
                  <img src={drop} alt="water drop" />
                  {data?.forecast?.list[0].pop && (
                    <span className="font-medium text-lg md:text-base">
                      Rain -{" "}
                      {data?.forecast.list[0].pop > 0.9
                        ? data?.forecast?.list[0].pop * 100
                        : (data?.forecast?.list[0].pop * 10)
                            .toString()
                            .slice(0, 3)}
                      %
                    </span>
                  )}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <main className="bg-[#f2f2f2] p-8 w-full lg:max-w-[700px]">
        <span className="border-b-2 border-black font-semibold text-xl">
          Today
        </span>

        <section className="mt-8 w-full md:max-w-sm lg:max-w-full">
          <ul className="flex gap-4 overflow-x-auto">
            {data?.forecast?.list?.map((item) => (
              <li
                key={item?.dt}
                className="flex flex-col justify-between items-center gap-2 bg-white w-24 px-4 py-3 rounded-3xl"
              >
                <span className="font-medium text-lg">
                  {item.dt_txt.split(" ")[1].slice(0, -3)}
                </span>
                <ImageStatus className="w-16" weather={item?.weather[0].main} />
                <div className="flex gap-2 font-medium text-sm">
                  {Math.round(item?.main?.temp_max)}°
                  <span className="opacity-50">
                    {Math.round(item?.main?.temp_min)}°
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="lg:flex lg:gap-8 w-full">
          <div className="w-full">
            <ul className="flex gap-8 my-8">
              <li className="flex flex-col justify-between w-[50%] h-32 bg-white px-4 py-3 rounded-3xl">
                <span className="font-medium text-sm opacity-40">Wind</span>
                <span className="font-medium text-3xl">
                  {data?.current?.wind?.speed}
                  <span className="font-normal text-sm">km/h</span>
                </span>
                <span className="text-sm">
                  Gust - {data?.current?.wind?.gust}
                </span>
              </li>
              <li className="flex flex-col justify-between w-[50%] h-32 bg-white px-4 py-3 rounded-3xl">
                <span className="font-medium text-sm opacity-40">
                  Visibility
                </span>
                <span className="font-medium text-3xl">
                  {(data?.current?.visibility as number) / 1000}
                  <span className="font-normal text-sm">km/h</span>
                </span>
                <span className="text-sm">Average</span>
              </li>
            </ul>

            <ul className="flex gap-8 my-8">
              <li className="flex flex-col justify-between w-[50%] h-32 bg-white px-4 py-3 rounded-3xl">
                <span className="font-medium text-sm opacity-40">Humidity</span>
                <span className="font-medium text-3xl">
                  {data?.current?.main?.humidity}
                  <span className="font-normal text-sm">%</span>
                </span>
                <span className="text-sm">Normal</span>
              </li>

              <li className="flex flex-col justify-between w-[50%] h-32 bg-white px-4 py-3 rounded-3xl">
                <span className="font-medium text-sm opacity-40">
                  Temp Status
                </span>

                <span className="font-medium text-lg">
                  {Math.round(data?.current?.main?.temp_max as number)}°
                </span>

                <span className="font-medium text-lg opacity-40">
                  {Math.round(data?.current?.main?.temp_min as number)}°
                </span>
              </li>
            </ul>
          </div>

          <div className="w-full">
            <ul className="flex flex-col gap-8 mt-8">
              <li className="flex flex-col justify-between px-4 py-3 h-32 bg-white rounded-3xl">
                <span className="font-medium text-sm opacity-40">
                  Air Quality
                </span>
                <span className="font-medium text-base mx-auto">Normal</span>
                <ul className="flex justify-between">
                  <li className="flex flex-col text-center text-sm">
                    {data?.air?.list[0]?.components?.pm2_5}
                    <span className="opacity-60">PM2.5</span>
                  </li>
                  <li className="flex flex-col text-center text-sm">
                    {data?.air?.list[0]?.components?.pm10}
                    <span className="opacity-60">PM10</span>
                  </li>
                  <li className="flex flex-col text-center text-sm">
                    {data?.air?.list[0]?.components?.so2}
                    <span className="opacity-60">SO²</span>
                  </li>
                  <li className="flex flex-col text-center text-sm">
                    {data?.air?.list[0]?.components?.no2}
                    <span className="opacity-60">NO²</span>
                  </li>
                  <li className="flex flex-col text-center text-sm">
                    {data?.air?.list[0]?.components?.o3}
                    <span className="opacity-60">O³</span>
                  </li>
                  <li className="flex flex-col text-center text-sm">
                    {data?.air?.list[0]?.components?.co}
                    <span className="opacity-60">CO</span>
                  </li>
                </ul>
              </li>

              <li className="flex flex-col justify-between px-4 py-3 h-32 bg-white rounded-3xl">
                <span className="font-medium text-sm opacity-60">
                  Sunrise & Sunset
                </span>
                <div className="flex items-center gap-3">
                  <img src={sunrise} alt="sunrise" />
                  <span className="font-medium text-sm">
                    {sunriseDatetime.getHours() < 10 && "0"}
                    {sunriseDatetime.getHours()}:
                    {sunriseDatetime.getMinutes() < 10 && "0"}
                    {sunriseDatetime.getMinutes()} AM
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <img src={sunset} alt="sunset" />
                  <span className="font-medium text-sm">
                    {sunsetDatetime.getHours() < 10 && "0"}
                    {sunsetDatetime.getHours()}:
                    {sunsetDatetime.getMinutes() < 10 && "0"}
                    {sunsetDatetime.getMinutes()} PM
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
