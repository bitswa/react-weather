import { useQuery } from "@tanstack/react-query";
import { fetchData } from "./utils/fetchData";

import sunrise from "./assets/sunrise.svg";
import sunset from "./assets/sunset.svg";

import { ImageStatus } from "./components/ImageStatus";
import { InfoCard } from "./components/InfoCard";
import { Header } from "./components/Header";
import { Loading } from "./components/Loading";
import { useState } from "react";

function App() {
  const [location, setLocation] = useState({
    lat: "-22.5269448",
    lon: "-41.944972",
  });
  const { data, isLoading, refetch } = useQuery(["weather"], () =>
    fetchData({ lat: location.lat, lon: location.lon })
  );

  if (isLoading) {
    return <Loading />;
  }

  console.log(data);

  const sunriseDatetime = new Date(
    (data?.current?.sys.sunrise as number) * 1000
  );
  const sunsetDatetime = new Date((data?.current?.sys.sunset as number) * 1000);

  return (
    <div className="md:flex lg:max-h-[580px] lg:max-w-5xl lg:rounded-3xl overflow-hidden">
      <Header setLocation={setLocation} refetchWeather={refetch} data={data} />
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
                <ImageStatus
                  className="w-16"
                  weather={item?.weather[0].main}
                  datetime={new Date(item.dt * 1000)}
                />
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
              <InfoCard
                top="Wind"
                center={data?.current?.wind?.speed}
                rightcenter="km/h"
                bottom="Average"
              />

              <InfoCard
                top="Visibility"
                center={(data?.current?.visibility as number) / 1000}
                rightcenter="km"
                bottom="Normal"
              />
            </ul>

            <ul className="flex gap-8 my-8">
              <InfoCard
                top="Humidity"
                center={data?.current?.main?.humidity}
                rightcenter="%"
                bottom="Normal"
              />

              <InfoCard top="Temp Status">
                <span className="font-medium text-lg">
                  {Math.round(data?.current?.main?.temp_max as number)}°
                </span>

                <span className="font-medium text-lg opacity-40">
                  {Math.round(data?.current?.main?.temp_min as number)}°
                </span>
              </InfoCard>
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
