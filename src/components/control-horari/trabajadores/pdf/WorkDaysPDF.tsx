
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { HourLimits, Trabajador, WorkingDay } from '../types/trabajadoresTypes';
import { calculateWorkedHours, timeToMinutes } from '../TrabajadorDetails';
import { format } from 'date-fns';

// Create PDF styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#E4E4E4',
        padding: 10
    },
    title: {
        textAlign: 'center',
        marginBottom: 10,
    },
    table: {
        display: "flex",
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row"
    },
    tableCol: {
        width: "12.5%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0
    },
    tableCell: {
        margin: "auto",
        marginTop: 5,
        fontSize: 10
    }
});


// Document Component
const WorkDaysPDF = ({ workingDays, selectedTrabajador, hourLimits }: { workingDays: WorkingDay[], selectedTrabajador: Trabajador, hourLimits: HourLimits }) => {

    if (!workingDays) return null;

    // set entry hour for each day to the max entry hour if it is not set
    workingDays.forEach((day: WorkingDay) => {
        // get day of the week
        const dayOfWeek = day.date ? day.date.getDay() : null;
        let dayType = "";
        // TODO: check festivos
        if (dayOfWeek && dayOfWeek >= 1 && dayOfWeek <= 4) {
            dayType = "laborable"
        } else if (dayOfWeek === 5) {
            dayType = "viernes"
        }
        console.log(day.date)
        console.log(dayOfWeek)
        if (dayType === "laborable") {
            const maxEntryHourMinutes = timeToMinutes(hourLimits.laborable.maxEntryHour);
            const enterHourMinutes = timeToMinutes(format(day.enterHour, "HH:mm"));

            const minExitHourMinutes = timeToMinutes(hourLimits.laborable.minExitHour);
            const exitHourMinutes = timeToMinutes(format(day.exitHour, "HH:mm"));
            

            console.log("laborable.maxEntryHour: " + hourLimits.laborable.maxEntryHour)
            console.log("day.enterHour: " + day.enterHour)
            console.log("enterHourMinutes: " + enterHourMinutes
                + " maxEntryHourMinutes: " + maxEntryHourMinutes)
            if (enterHourMinutes < maxEntryHourMinutes) {
                const timeEnterParts = hourLimits.laborable.maxEntryHour.split(':');
                const newEnterDate: Date = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate());
                newEnterDate.setHours(parseInt(timeEnterParts[0]), parseInt(timeEnterParts[1]));
                day.enterHour = newEnterDate;
            }

            if (exitHourMinutes > minExitHourMinutes) {
                const timeExitParts = hourLimits.laborable.minExitHour.split(':');
                const newExitDate: Date = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate());
                newExitDate.setHours(parseInt(timeExitParts[0]), parseInt(timeExitParts[1]));
                day.exitHour = newExitDate;
            }

        } else if (dayType === "viernes") {
            const maxEntryHourMinutes = timeToMinutes(hourLimits.viernes.maxEntryHour);
            const enterHourMinutes = timeToMinutes(format(day.enterHour, "HH:mm"));

            const minExitHourMinutes = timeToMinutes(hourLimits.viernes.minExitHour);
            const exitHourMinutes = timeToMinutes(format(day.exitHour, "HH:mm"));

            if (enterHourMinutes < maxEntryHourMinutes) {
                const timeEnterParts = hourLimits.viernes.maxEntryHour.split(':');
                const newEnterDate: Date = new Date();
                newEnterDate.setHours(parseInt(timeEnterParts[0]), parseInt(timeEnterParts[1]));
                day.enterHour = newEnterDate;
            }

            if (exitHourMinutes > minExitHourMinutes) {
                const timeExitParts = hourLimits.viernes.minExitHour.split(':');
                const newExitDate: Date = new Date();
                newExitDate.setHours(parseInt(timeExitParts[0]), parseInt(timeExitParts[1]));
                day.exitHour = newExitDate;
            }
        }
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>Control Horarios VidreBany - {selectedTrabajador.name} ({selectedTrabajador.code})</Text>
                {/* In case of extra, display normal hours and extra hours */}
                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Fecha</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Hora</Text><Text style={styles.tableCell}>Entrada</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Hora</Text><Text style={styles.tableCell}>Salida</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Inicio</Text><Text style={styles.tableCell}>Desayuno</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Fin</Text><Text style={styles.tableCell}>Desayuno</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Inicio</Text><Text style={styles.tableCell}>Almuerzo</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Fin</Text><Text style={styles.tableCell}>Almuerzo</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Horas</Text><Text style={styles.tableCell}>Trabajadas</Text></View>
                    </View>
                    {/* Table Rows */}
                    {workingDays.map((day: WorkingDay, index: number) => (
                        <View key={index} style={styles.tableRow}>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{day.date ? format(day.date, "dd/MM/yyyy") : '-'}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{day.enterHour ? format(day.enterHour, "HH:mm") : '-'}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{day.exitHour ? format(day.exitHour, "HH:mm") : '-'}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{day.startBreakfastHour ? format(day.startBreakfastHour, "HH:mm") : '-'}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{day.endBreakfastHour ? format(day.endBreakfastHour, "HH:mm") : '-'}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{day.startLunchHour ? format(day.startLunchHour, "HH:mm") : '-'}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{day.endLunchHour ? format(day.endLunchHour, "HH:mm") : '-'}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{calculateWorkedHours(day)}</Text></View>
                        </View>
                    ))}
                </View>
                {/* Footer */}
                <View style={styles.tableRow}>
                    <View style={{ ...styles.tableCol, width: "80%" }}><Text style={styles.tableCell}>Sumatorio Horas Trabajadas</Text></View>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>{workingDays.reduce((acc, day) => acc + parseFloat(calculateWorkedHours(day)), 0).toFixed(2)}</Text></View>
                </View>
            </Page>
        </Document >
    )
};

export default WorkDaysPDF;