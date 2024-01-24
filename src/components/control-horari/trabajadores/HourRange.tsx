import React from "react";
import { DayType } from "./types/trabajadoresTypes";


type ExtraHours = {
    day_type: DayType;
    start_hour: string;
    end_hour: string;
    is_entry: boolean;
};

type HourRangeProps = {
    label: DayType;
    ranges: string[];
    extraHours: ExtraHours[];
    onChange: (dayType: DayType, range: string, isChecked: boolean) => void;
};

const HourRange: React.FC<HourRangeProps> = ({ label, ranges, extraHours, onChange }: HourRangeProps) => {
    // Function to check if the hour range is selected
    const isHourRangeSelected = (range: string): boolean => {
        const [start_hour, end_hour] = range.split("-");
        return extraHours.some(
            (eh) => eh.day_type === label && eh.start_hour === start_hour && eh.end_hour === end_hour
        )
    }

    const extraHour = (range: string): ExtraHours | undefined => {
        const [start_hour, end_hour] = range.split("-");
        return extraHours.find((eh) => eh.day_type === label && eh.start_hour === start_hour && eh.end_hour === end_hour);
    }



    return (
        <tr>
            <td>{label === "laborable" ? "Laborables" : "Viernes"}</td>
            {ranges.map((range, index) => {
                const id = `${label}-${range.replace(":", "")}`;
                //const [start_hour, end_hour] = range.split("-");
                //const id = `${label}-${start_hour}-${end_hour}`;

                return (
                    <td key={index}>
                        <label htmlFor={id} style={{ display: 'inline-block', position: 'relative', padding: '0' }}>
                            <input type="checkbox" id={id} checked={isHourRangeSelected(range)} onChange={(e) => onChange(label, range, e.target.checked)} style={{ display: 'none' }} />
                            <span style={{ display: 'inline-block', width: '20px', height: '20px', background: 'white', position: 'relative', border: `2px solid ${isHourRangeSelected(range) ? extraHour(range)?.is_entry ? "green" : "red" : "black"}`, borderRadius: '3px' }}></span>
                            <span style={{ display: 'inline-block', width: '10px', height: '10px', background: `${extraHour(range)?.is_entry ? "green" : "red"}`, position: 'absolute', top: '5px', left: '5px', borderRadius: '2px', visibility: isHourRangeSelected(range) ? 'visible' : 'hidden' }}></span>
                        </label>
                    </td>
                )
            })}
        </tr>
    );
};

export default HourRange;