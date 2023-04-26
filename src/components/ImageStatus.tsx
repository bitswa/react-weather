// night
import nightcloudy from "../assets/nightcloudy.svg";
import nightrain from "../assets/nightrain.svg";
import nightclear from "../assets/nightclear.svg";

// day
import cloudy from "../assets/cloudy.svg";
import rain from "../assets/rain.svg";
import clear from "../assets/clear.svg";

type Props = {
  className: string;
  weather: string | undefined;
  datetime: Date;
};

export const ImageStatus = ({ className, weather, datetime }: Props) => {
  const hours = datetime?.getHours();

  // night
  if (hours != undefined) {
    if (hours >= 18 || hours <= 5) {
      const status =
        weather == "Clouds"
          ? nightcloudy
          : weather == "Rain"
          ? nightrain
          : weather == "Clear"
          ? nightclear
          : "";

      return <img className={className} src={status} alt={status} />;
    }
  }

  // day
  const status =
    weather == "Clouds"
      ? cloudy
      : weather == "Rain"
      ? rain
      : weather == "Clear"
      ? clear
      : "";

  return <img className={className} src={status} alt={status} />;
};
