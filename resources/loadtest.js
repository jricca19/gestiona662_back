import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
    vus: 10, // Incrementa el número de usuarios virtuales
    duration: "20s", // Aumenta la duración de la prueba
};

const BASE_URL = "http://localhost:3000"; // Reemplaza con tu URL del servidor
const TOKEN = __ENV.AUTH_TOKEN;

export default function () {
    const headers = {
        headers: {
            Authorization: `${TOKEN}`,
            "Content-Type": "application/json", // Aseguramos que el Content-Type sea correcto
        },
    };

    // Prueba GET en el endpoint de salud
    const healthRes = http.get(`${BASE_URL}/health`, headers);
    check(healthRes, {
        "health status is 200": (r) => r.status === 200,
    });

    // Prueba GET en el endpoint de departamentos
    const departmentsRes = http.get(`${BASE_URL}/departments`, headers);
    check(departmentsRes, {
        "departments status is 200": (r) => r.status === 200,
    });

    // Obtener escuelas
    const schoolsRes = http.get(`${BASE_URL}/v1/schools`, headers);
    check(schoolsRes, {
        "schools status is 200": (r) => r.status === 200,
    });

    // Generar un schoolNumber único basado en el tiempo actual
    const uniqueSchoolNumber = Math.floor(Date.now() / 1000); // Timestamp en segundos

    // Crear una escuela ¡¡¡USAR TOKEN DE USUARIO STAFF!!!
    const schoolPayload = JSON.stringify({
        schoolNumber: uniqueSchoolNumber, // Número único para evitar duplicados
        departmentId: "6809456179b9d580b693c6ca", // ID de departamento válido
        cityName: "BELLA UNIÓN", // Ciudad válida para el departamento
        address: "Montevideo 586", // Dirección válida
    });
    const schoolRes = http.post(`${BASE_URL}/v1/schools`, schoolPayload, headers);
    check(schoolRes, {
        "school creation status is 201": (r) => r.status === 201,
    });

    sleep(1); // Pausa de 1 segundo entre solicitudes
}