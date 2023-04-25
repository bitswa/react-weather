//import night from "../assets/night.svg";
import cloudy from "../assets/cloudy.svg";
import rain from "../assets/rain.svg";
import clear from "../assets/clear.svg";

type Props = {
  className: string;
  weather: string | undefined;
};

export const ImageStatus = ({ className, weather }: Props) => {
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
