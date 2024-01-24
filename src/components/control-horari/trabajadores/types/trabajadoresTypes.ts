
export type Trabajador = {
    name: string,
    code: string,
}

export type WorkingDay = {
    date: Date,
    enterHour: Date,
    exitHour: Date,
    startBreakfastHour: Date,
    endBreakfastHour: Date,
    prevEntryHour: Date | null,
    prevExitHour: Date | null,
    startLunchHour: Date,
    endLunchHour: Date,
    extraWorkedHours: string,
    officialWorkedHours: string,
}

export type DayType = "laborable" | "viernes";

export type ExtraHours = {
    day_type: DayType,
    start_hour: string,
    end_hour: string,
    is_entry: boolean
}

export type HourLimit = {
    minEntryHour: string;
    maxEntryHour: string;
    minExitHour: string;
    maxExitHour: string;
};

export type HourLimits = Record<DayType, HourLimit>;