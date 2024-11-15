import axios from "axios"
import { LoginFormData } from "../utils/interfaces"

export const managerLogin = async (formData: LoginFormData) => {
    try {
        const response = await axios.post('http://localhost:3000/authentication/api/manager/manager-login', formData)
        return response.data
    } catch (error) {
        throw error
    }
}