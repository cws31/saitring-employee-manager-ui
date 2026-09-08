import axiosInstance from './axiosInstance';

const EMPLOYEE_API_URL = '/api/employees';

class EmployeeService {
    getAllEmployees() {
        return axiosInstance.get(EMPLOYEE_API_URL);
    }

    addEmployee(employeeData) {
        return axiosInstance.post(EMPLOYEE_API_URL, employeeData);
    }

    updateEmployee(id, employeeData) {
        return axiosInstance.put(`${EMPLOYEE_API_URL}/${id}`, employeeData);
    }

    deleteEmployee(id) {
        return axiosInstance.delete(`${EMPLOYEE_API_URL}/${id}`);
    }

    toggleBlockStatus(id) {
        return axiosInstance.patch(`${EMPLOYEE_API_URL}/${id}/toggle-block`);
    }
}

export default new EmployeeService();