import { ReactNode } from "react";

export const InfoCard = (props: {
  top: string;
  center?: number | undefined;
  rightcenter?: string;
  bottom?: string;
  children?: ReactNode;
}) => {
  return (
    <li className="flex flex-col justify-between w-[50%] h-32 bg-white px-4 py-3 rounded-3xl">
      <span className="font-medium text-sm opacity-40">{props.top}</span>
      {props.children ? (
        props.children
      ) : (
        <>
          <span className="font-medium text-3xl">
            {props.center}
            <span className="font-normal text-sm">{props.rightcenter}</span>
          </span>
          <span className="text-sm">{props.bottom}</span>
        </>
      )}
    </li>
  );
};
