
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
    startLunchHour: Date,
    endLunchHour: Date,
}