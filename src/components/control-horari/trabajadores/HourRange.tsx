import React from "react";

type DayType = "laborable" | "sabado" | "domingo_festivo";

type ExtraHours = {
    day_type: DayType;
    start_hour: string;
    end_hour: string;
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
    return (
        <tr>
            <td>{label === "laborable" ? "Laborables" : label === "sabado" ? "Sábados" : "Domingos y festivos"}</td>
            {ranges.map((range, index) => {
                const id = `${label}-${range.replace(":", "")}`;
                //const [start_hour, end_hour] = range.split("-");
                //const id = `${label}-${start_hour}-${end_hour}`;

                return (
                    <td key={index}>
                        <input type="checkbox" checked={isHourRangeSelected(range)} id={id} onChange={(e) => onChange(label, range, e.target.checked)} />
                        <label htmlFor={id}></label>
                    </td>
                )
            })}
        </tr>
    );
};

export default HourRange;