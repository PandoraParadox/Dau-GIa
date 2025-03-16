import { format } from "date-fns";
import CountdownTimer from "../component/CountDown";
export const convertDateTime = (dateString) => {
    return format(new Date(dateString), "HH:mm:ss dd-MM-yyyy");
};
export const compareTime = (inputTime) => {
    const [timePart, datePart] = inputTime.split(" ");
    const [hours, minutes, seconds] = timePart.split(":").map(Number);
    const [day, month, year] = datePart.split("-").map(Number);

    const inputDate = new Date(year, month - 1, day, hours, minutes, seconds);
    const currentDate = new Date();

    return inputDate < currentDate;
};
export const compareNewTime = (time) => {
    const newTime = new Date(time.replace(" ", "T")); // Thời gian đấu giá kết thúc
    const currentTime = new Date(); // Thời gian hiện tại

    // So sánh thời gian một cách chặt chẽ hơn
    if (newTime > currentTime) {
        return 0; // Đang trong thời gian đấu giá (chạy countdown)
    } else {
        return 2; // Hết thời gian đấu giá
    }
};

