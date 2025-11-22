import { powerliftingResults } from "@/src/lib/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React from "react";

type DataContainerType = {
  data: InferSelectModel<typeof powerliftingResults>[] | [];
};

export default function DataContainer({ data }: DataContainerType) {
  return (
    <div className="text-black bg-zinc-200/60 dark:bg-zinc-900/60 dark:text-white  w-[80vw] text-'[clamp(0.55rem,1.2vw,0.75rem)]' overflow-x-hidden backdrop-blur-md m-5 p-5 rounded-lg">
      <table className="text-center w-full border-collapse">
        <thead>
          <tr>
            <th>level</th>
            <th>name</th>
            <th>total</th>
            <th>bench</th>
            <th>deadlift</th>
            <th>squat</th>
            <th>federation</th>
            <th>bodyweightKg</th>
          </tr>
        </thead>

        <tbody>
          {data.map((powerlifter) => (
            <tr
              key={powerlifter.id}
              className={`${
                powerlifter.id == data.length
                  ? ""
                  : "border-b-2 border-black dark:border-white"
              } transform hover:scale-[1.1] transition-transform duration-200 ease-in-out hover:cursor-pointer`}
            >
              <td className="p-4">{powerlifter.id || "-"}</td>
              <td className="text-xl">{powerlifter.name || "-"}</td>
              <td>{powerlifter.totalkg || "-"}</td>
              <td>{powerlifter.best3benchkg || "-"}</td>
              <td>{powerlifter.best3deadliftkg || "-"}</td>
              <td>{powerlifter.best3squatkg || "-"}</td>
              <td>{powerlifter.federation || "-"}</td>
              <td>{powerlifter.bodyweightkg || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
