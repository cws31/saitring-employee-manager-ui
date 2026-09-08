import axiosInstance from './axiosInstance';

const ATTENDANCE_API_URL = '/api/attendance';

class AttendanceService {
    markAttendance(data) {
        return axiosInstance.post(ATTENDANCE_API_URL, data);
    }

    getMonthlyAttendance(year, month) {
        return axiosInstance.get(`${ATTENDANCE_API_URL}/month`, {
            params: { year, month }
        });
    }
}

export default new AttendanceService();